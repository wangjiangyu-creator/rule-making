import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderActorDetail } from '../src/views/actors.js';
import { renderHome } from '../src/views/home.js';
import { renderDimensionDetail, renderDimensions } from '../src/views/dimensions.js';
import { renderInstitutionDetail } from '../src/views/institutions.js';
import { renderTopicDetail, renderTopics } from '../src/views/topics.js';
import { renderTimelinePage } from '../src/views/timeline.js';
import { renderSourcesMethod } from '../src/views/sources.js';
import { renderDatabase, renderRecordDetail } from '../src/views/database.js';
import { records } from '../src/data/records.js';

test('index renders the static app mount and asset links', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<main\s+id="app"/);
  assert.match(html, /href="\.\/src\/styles\.css\?v=20260526b"/);
  assert.match(html, /src="\.\/src\/main\.js\?v=20260526b"/);
  assert.match(html, /Great Powers and Rule-Making/);
  assert.match(html, /class="site-footer"/);
  assert.match(html, /This website was created with Codex by Professor Wang Jiangyu of CityUHK\./);
  assert.doesNotMatch(html, /class="site-header-attribution"/);
});

test('view renderers include core portal sections', () => {
  assert.match(renderDimensions(), /Rule-Making Dimensions/);
  assert.match(renderDimensionDetail('agenda-setting'), /Agenda-Setting/);
  assert.match(renderHome(), /Digital Trade/);
  assert.match(renderHome(), /Browse by dimension/);
  assert.match(renderHome(), /class="home-attribution"/);
  assert.match(renderHome(), /This website was created with Codex by Professor Wang Jiangyu of CityUHK\./);
  assert.match(renderTopics(), /Research Topics/);
  assert.match(renderDatabase(), /Rule-Making Records/);
  assert.match(renderSourcesMethod(), /Analytical dimensions/);
});

test('home and topic pages expose entry points into the full timeline view', () => {
  assert.match(renderHome(), /#\/timeline/);
  assert.match(renderTopicDetail('digital-trade-ecommerce'), /#\/timeline\?topic=digital-trade-ecommerce/);
});

test('database renderer includes jurisdiction and date filter controls', () => {
  const html = renderDatabase();

  assert.match(html, /name="dimension"/);
  assert.match(html, /name="jurisdiction"/);
  assert.match(html, /name="dateFrom"/);
  assert.match(html, /name="dateTo"/);
  assert.match(html, /name="year"/);
});

test('stylesheet includes database interface selectors', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.filters\b/);
  assert.match(css, /\.record-row\b/);
  assert.match(css, /\.timeline-list\b/);
  assert.match(css, /overflow-wrap\s*:/);
});

test('database renderer escapes unsafe query text', () => {
  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/database?q=<script>' };

  try {
    const html = renderDatabase();

    assert.doesNotMatch(html, /value="<script>"/);
    assert.doesNotMatch(html, /<script>/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('record detail renders unsafe source URLs as plain text', () => {
  const unsafeRecord = {
    id: 'unsafe-source-url-regression',
    title: 'Unsafe Source URL Regression',
    recordType: 'official-statement',
    date: '2026-01-01',
    year: 2026,
    actors: [],
    jurisdictions: [],
    institutions: [],
    topics: [],
    dimensions: ['legitimacy-management'],
    summary: 'A regression fixture for unsafe source URL rendering.',
    sourceAuthority: 'official-government',
    languageStatus: 'official-english',
    sourceLinks: [
      {
        label: 'Unsafe Source',
        url: 'javascript:alert(1)',
      },
    ],
    citation: 'Unsafe source URL regression fixture.',
    relatedRecordIds: [],
    tags: [],
  };

  records.push(unsafeRecord);

  try {
    const html = renderRecordDetail(unsafeRecord.id);

    assert.doesNotMatch(html, /href="javascript:alert\(1\)"/);
    assert.match(html, /Unsafe Source/);
    assert.match(html, /\(invalid source URL\)/);
  } finally {
    records.pop();
  }
});

test('record detail renders dimensions metadata for existing records', () => {
  const html = renderRecordDetail('wto-joint-statement-electronic-commerce-2019');

  assert.match(html, /Dimensions/);
});

test('record detail renders attribution metadata when present', () => {
  const html = renderRecordDetail('un-governing-ai-humanity-2024');

  assert.match(html, /United Nations High-Level Advisory Body on Artificial Intelligence/);
  assert.match(html, /Publisher/);
  assert.match(html, /United Nations/);
});

test('record detail omits authors row when only publisher is present', () => {
  const html = renderRecordDetail('wto-agreement-electronic-commerce-2024');

  assert.match(html, /World Trade Organization/);
  assert.match(html, /Publisher/);
  assert.doesNotMatch(html, /<dt>Authors<\/dt>/);
});

test('database list renderer shows compact attribution lines', () => {
  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/database?topic=ai-governance' };

  try {
    const html = renderDatabase();

    assert.match(html, /United Nations High-Level Advisory Body on Artificial Intelligence \| United Nations/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('record detail renders grouped source dossier blocks', () => {
  const fixtureRecord = {
    id: 'source-dossier-fixture',
    title: 'Source Dossier Fixture',
    recordType: 'institutional-document',
    date: '2024-01-01',
    year: 2024,
    actors: [],
    jurisdictions: ['Global'],
    institutions: ['wto'],
    topics: ['wto-reform'],
    dimensions: ['agenda-setting'],
    summary: 'Fixture record for grouped source-dossier rendering.',
    sourceAuthority: 'official-international-organization',
    languageStatus: 'official-english',
    sourceLinks: [
      {
        label: 'Official text PDF',
        url: 'https://example.com/text.pdf',
        linkType: 'pdf',
        note: 'Controlling text.',
      },
      {
        label: 'Repository page',
        url: 'https://example.com/page',
        linkType: 'official-page',
        note: 'Repository landing page.',
      },
      {
        label: 'Think-tank commentary',
        url: 'https://example.com/commentary',
        linkType: 'commentary',
        authority: 'think-tank',
        note: 'Secondary context.',
      },
    ],
    citation: 'Source Dossier Fixture.',
    relatedRecordIds: [],
    tags: [],
  };

  records.push(fixtureRecord);

  try {
    const html = renderRecordDetail(fixtureRecord.id);
    assert.match(html, /Source dossier/);
    assert.match(html, /Controlling or primary text/);
    assert.match(html, /Official versions and document pages/);
    assert.match(html, /Secondary or contextual links/);
    assert.match(html, /Controlling text\./);
    assert.ok(html.indexOf('Official text PDF') < html.indexOf('Think-tank commentary'));
  } finally {
    records.pop();
  }
});

test('actor and institution detail pages summarize linked dimensions', () => {
  const actorHtml = renderActorDetail('china');
  const institutionHtml = renderInstitutionDetail('wto');

  assert.match(actorHtml, /Rule-making dimensions/);
  assert.match(actorHtml, /Agenda-Setting/);
  assert.match(actorHtml, /Norm Entrepreneurship and Drafting Power/);
  assert.match(institutionHtml, /Rule-making dimensions/);
  assert.match(institutionHtml, /Legitimacy Management/);
  assert.match(institutionHtml, /Agenda-Setting/);
});

test('thin-topic pages surface the new balance-first materials', () => {
  const unitedStatesHtml = renderTopicDetail('united-states');
  const investmentHtml = renderTopicDetail('international-investment');
  const aiHtml = renderTopicDetail('ai-governance');

  assert.match(unitedStatesHtml, /National Cybersecurity Strategy/);
  assert.match(unitedStatesHtml, /Who Controls the Internet/);
  assert.match(investmentHtml, /Code of Conduct for Adjudicators in International Investment Disputes/);
  assert.match(aiHtml, /OECD Framework for the Classification of AI Systems/);
});

test('new batch records propagate to actor and institution pages', () => {
  const actorHtml = renderActorDetail('united-states');
  const institutionHtml = renderInstitutionDetail('imf');

  assert.match(actorHtml, /Declaration for the Future of the Internet/);
  assert.match(institutionHtml, /Integrated Policy Framework/);
});

test('china-linked records are promoted on mixed topic and institution pages', () => {
  const chinaTopicHtml = renderTopicDetail('china');
  const wtoHtml = renderTopicDetail('wto-reform');
  const worldBankHtml = renderInstitutionDetail('world-bank');

  assert.match(chinaTopicHtml, /China and International Rule-Making/);
  assert.match(wtoHtml, /China in this topic/);
  assert.match(worldBankHtml, /China in this institution/);
  assert.match(wtoHtml, /Trade Policy Review: China 2024/);
  assert.match(worldBankHtml, /Country Partnership Framework for China/);
  assert.ok(wtoHtml.indexOf('Trade Policy Review: China 2024') < wtoHtml.indexOf('Ottawa Group and WTO Reform'));
});

test('second China batch propagates to WTO, AIIB, and APEC entry pages', () => {
  const chinaHtml = renderTopicDetail('china');
  const aiibHtml = renderInstitutionDetail('aiib');
  const apecHtml = renderInstitutionDetail('apec');

  assert.match(chinaHtml, /People&#39;s Republic of China: 2025 Article IV Consultation/);
  assert.match(chinaHtml, /China Deepens Partnership with the World Bank&#39;s Knowledge for Change Program/);
  assert.match(aiibHtml, /2025 AIIB Annual Meeting/);
  assert.match(apecHtml, /China Contributes Funding to Promote Digitalization for Green Transitions/);
});

test('actor detail pages expose topic distribution and the newest comparison materials', () => {
  const unitedStatesHtml = renderActorDetail('united-states');
  const europeHtml = renderTopicDetail('european-union');
  const chinaHtml = renderTopicDetail('china');

  assert.match(unitedStatesHtml, /Topic distribution/);
  assert.match(unitedStatesHtml, /United States and International Rule-Making \(\d+\)/);
  assert.match(unitedStatesHtml, /Cyber Governance and Global Data Governance \(\d+\)/);
  assert.match(unitedStatesHtml, /U\.S\.-EU Trade and Technology Council Inaugural Joint Statement/);
  assert.match(europeHtml, /A European Strategy for Data/);
  assert.match(europeHtml, /White Paper on Artificial Intelligence/);
  assert.match(chinaHtml, /Global Initiative on Data Security/);
  assert.match(chinaHtml, /National Standardization Development Outline/);
});

test('britain shelf surfaces in topics, actor detail, and timeline views', () => {
  const issues = [];
  const topicsHtml = renderTopics();
  if (!/Britain and Imperial Rule-Making/.test(topicsHtml)) {
    issues.push('missing Britain topic card');
  }

  const britainHtml = renderTopicDetail('britain-imperial-rulemaking');
  if (!/Lombard Street/.test(britainHtml)) {
    issues.push('missing Lombard Street on Britain topic page');
  }
  if (!/Declaration Respecting Maritime Law/.test(britainHtml)) {
    issues.push('missing Declaration Respecting Maritime Law on Britain topic page');
  }

  const actorHtml = renderActorDetail('united-kingdom');
  if (!/Britain and Imperial Rule-Making/.test(actorHtml)) {
    issues.push('missing Britain topic propagation on UK actor page');
  }
  if (!/The Hegemon&#39;s Dilemma|The Hegemon's Dilemma/.test(actorHtml)) {
    issues.push('missing The Hegemon\'s Dilemma on UK actor page');
  }

  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/timeline?topic=britain-imperial-rulemaking' };

  try {
    const timelineHtml = renderTimelinePage();
    if (!/Cobden-Chevalier Treaty/.test(timelineHtml)) {
      issues.push('missing Cobden-Chevalier Treaty in Britain timeline view');
    }
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }

  assert.equal(issues.length, 0, issues.join('; '));
});

test('database filter form submits named jurisdiction and date fields', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const originalFormData = globalThis.FormData;
  const formValues = {
    q: '',
    topic: '',
    dimension: 'agenda-setting',
    actor: '',
    institution: '',
    recordType: '',
    languageStatus: '',
    sourceAuthority: '',
    jurisdiction: 'China',
    dateFrom: '2020-01-01',
    dateTo: '2020-12-31',
    year: '2020',
  };
  const app = {
    innerHTML: '',
    focus() {},
  };
  let submitHandler;
  const filterForm = {
    hasAttribute(attribute) {
      return attribute === 'data-filter-form';
    },
    addEventListener(event, handler) {
      if (event === 'submit') {
        submitHandler = handler;
      }
    },
  };

  class FakeFormData {
    constructor(form) {
      assert.equal(form, filterForm);
    }

    get(field) {
      return formValues[field] ?? '';
    }

    entries() {
      return Object.entries(formValues)[Symbol.iterator]();
    }

    [Symbol.iterator]() {
      return this.entries();
    }
  }

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
    querySelectorAll(selector) {
      assert.equal(selector, 'form');
      return [filterForm];
    },
  };
  globalThis.window = {
    addEventListener() {},
    scrollTo() {},
    requestAnimationFrame(callback) {
      callback();
    },
  };
  globalThis.location = { hash: '#/database' };
  globalThis.FormData = FakeFormData;

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `filter-form-smoke=${Date.now()}`;

    await import(moduleUrl.href);
    assert.equal(typeof submitHandler, 'function');

    submitHandler({ preventDefault() {} });

    assert.match(globalThis.location.hash, /^#\/database\?/);

    const params = new URLSearchParams(globalThis.location.hash.split('?')[1]);

    assert.equal(params.get('jurisdiction'), 'China');
    assert.equal(params.get('dimension'), 'agenda-setting');
    assert.equal(params.get('dateFrom'), '2020-01-01');
    assert.equal(params.get('dateTo'), '2020-12-31');
    assert.equal(params.get('year'), '2020');
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }

    if (originalFormData === undefined) {
      delete globalThis.FormData;
    } else {
      globalThis.FormData = originalFormData;
    }
  }
});

test('main renders hero content and focuses the app on route changes', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const app = {
    innerHTML: '',
    focus(options) {
      routeEvents.push(['focus', options]);
    },
  };
  let hashchangeHandler;
  const routeEvents = [];

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
  };
  globalThis.window = {
    addEventListener(event, handler) {
      if (event === 'hashchange') {
        hashchangeHandler = handler;
      }
    },
    scrollTo(...args) {
      routeEvents.push(['scrollTo', args]);
    },
    requestAnimationFrame(callback) {
      routeEvents.push(['requestAnimationFrame']);
      callback();
    },
  };
  globalThis.location = { hash: '#/' };

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `renderer-smoke=${Date.now()}`;

    await import(moduleUrl.href);

    assert.match(app.innerHTML, /Great Powers and Rule-Making/);
    assert.match(app.innerHTML, /#\/topics\/digital-trade-ecommerce/);
    assert.match(app.innerHTML, /#\/database/);
    assert.match(app.innerHTML, /#\/dimensions/);
    assert.deepEqual(routeEvents.slice(0, 4), [
      ['focus', { preventScroll: true }],
      ['scrollTo', [0, 0]],
      ['requestAnimationFrame'],
      ['scrollTo', [0, 0]],
    ]);
    assert.equal(typeof hashchangeHandler, 'function');

    globalThis.location.hash = '#/database';
    hashchangeHandler();

    assert.deepEqual(routeEvents.slice(4, 8), [
      ['focus', { preventScroll: true }],
      ['scrollTo', [0, 0]],
      ['requestAnimationFrame'],
      ['scrollTo', [0, 0]],
    ]);
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('main renders a filtered timeline route for a topic timeline view', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const app = {
    innerHTML: '',
    focus() {},
  };

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
    querySelectorAll() {
      return [];
    },
  };
  globalThis.window = {
    addEventListener() {},
    scrollTo() {},
    requestAnimationFrame(callback) {
      callback();
    },
  };
  globalThis.location = { hash: '#/timeline?topic=digital-trade-ecommerce' };

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `timeline-route-smoke=${Date.now()}`;

    await import(moduleUrl.href);

    assert.match(app.innerHTML, /Rule-Making Timeline/);
    assert.match(app.innerHTML, /WTO establishes Work Programme on Electronic Commerce/);
    assert.doesNotMatch(app.innerHTML, /European Union adopts the Artificial Intelligence Act/);
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});
