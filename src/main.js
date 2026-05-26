import { renderActorDetail, renderActors } from './views/actors.js?v=20260526o';
import { renderDatabase, renderRecordDetail } from './views/database.js?v=20260526o';
import { renderDimensionDetail, renderDimensions } from './views/dimensions.js?v=20260526o';
import { renderHome } from './views/home.js?v=20260526o';
import { renderInstitutionDetail, renderInstitutions } from './views/institutions.js?v=20260526o';
import { renderSourcesMethod } from './views/sources.js?v=20260526o';
import { renderTimelinePage } from './views/timeline.js?v=20260526o';
import { renderTopicDetail, renderTopics } from './views/topics.js?v=20260526o';

const app = document.querySelector('#app');
let keepTopicFilterResultsVisible = false;

function pathParts() {
  const hash = globalThis.location?.hash ?? '#/';
  const [path] = hash.replace(/^#\/?/, '').split('?');

  return path
    .split('/')
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    })
    .filter(Boolean);
}

function renderNotFound() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Page not found</p>
      <h1>Page not found</h1>
      <p class="lede">The requested portal page does not exist.</p>
      <a class="button button-secondary" href="#/">Return Home</a>
    </section>
  `;
}

function route() {
  const parts = pathParts();
  const [section, id] = parts;

  if (parts.length === 0 || section === 'home') {
    app.innerHTML = renderHome();
  } else if (section === 'dimensions' && id) {
    app.innerHTML = renderDimensionDetail(id);
  } else if (section === 'dimensions') {
    app.innerHTML = renderDimensions();
  } else if (section === 'timeline') {
    app.innerHTML = renderTimelinePage();
  } else if (section === 'topics' && id) {
    app.innerHTML = renderTopicDetail(id);
  } else if (section === 'topics') {
    app.innerHTML = renderTopics();
  } else if (section === 'database') {
    app.innerHTML = renderDatabase();
  } else if (section === 'records' && id) {
    app.innerHTML = renderRecordDetail(id);
  } else if (section === 'actors' && id) {
    app.innerHTML = renderActorDetail(id);
  } else if (section === 'actors') {
    app.innerHTML = renderActors();
  } else if (section === 'institutions' && id) {
    app.innerHTML = renderInstitutionDetail(id);
  } else if (section === 'institutions') {
    app.innerHTML = renderInstitutions();
  } else if (section === 'sources-method') {
    app.innerHTML = renderSourcesMethod();
  } else {
    app.innerHTML = renderNotFound();
  }

  bindForms();

  if (keepTopicFilterResultsVisible) {
    keepTopicFilterResultsVisible = false;

    if (scrollToTopicFilterResults()) return;
  }

  app.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  window.requestAnimationFrame?.(() => window.scrollTo(0, 0));
}

function scrollToTopicFilterResults() {
  const target =
    document.querySelector('[data-topic-filter-results]') ?? document.querySelector('form[data-topic-filter-form]');

  if (target && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ block: 'start' });
    return true;
  }

  return false;
}

function filterHashFromForm(form) {
  const formData = new FormData(form);
  const params = new URLSearchParams();
  const filterBase =
    typeof form.getAttribute === 'function' ? form.getAttribute('data-filter-base') || '#/database' : '#/database';

  for (const [field, rawValue] of formData) {
    const value = String(rawValue ?? '').trim();

    if (field && value) params.set(field, value);
  }

  return params.toString() ? `${filterBase}?${params.toString()}` : filterBase;
}

function applyFilterForm(form) {
  const nextHash = filterHashFromForm(form);
  const isTopicFilter = form.hasAttribute('data-topic-filter-form');

  if (isTopicFilter) keepTopicFilterResultsVisible = true;

  if (globalThis.location.hash === nextHash) {
    if (isTopicFilter) scrollToTopicFilterResults();
    return;
  }

  globalThis.location.hash = nextHash;
}

function bindForms() {
  const forms = typeof document.querySelectorAll === 'function' ? document.querySelectorAll('form') : [];

  for (const form of forms) {
    if (form.hasAttribute('data-global-search')) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const query = String(formData.get('query') ?? '').trim();
        const params = new URLSearchParams();

        if (query) params.set('q', query);

        globalThis.location.hash = params.toString() ? `#/database?${params.toString()}` : '#/database';
      });
    }

    if (form.hasAttribute('data-filter-form')) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        applyFilterForm(form);
      });

      if (form.hasAttribute('data-topic-filter-form')) {
        form.addEventListener('change', (event) => {
          const target = event.target;

          if (target?.matches?.('input[type="search"]')) return;

          applyFilterForm(form);
        });
      }
    }
  }
}

window.addEventListener('hashchange', route);
route();
