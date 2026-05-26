import { dimensions } from '../data/dimensions.js';
import { records } from '../data/records.js?v=20260527a';
import { topics } from '../data/topics.js';
import { attributionDisplay } from '../lib/attribution.js';
import { formatDate, recordTypeLabel } from '../lib/format.js';
import { sortRecordsNewestFirst } from '../lib/search.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function recordsForDimension(dimensionId) {
  return sortRecordsNewestFirst(records.filter((record) => asList(record.dimensions).includes(dimensionId)));
}

function renderTopicLinks(ids) {
  return asList(ids)
    .map((topicId) => {
      const topic = topics.find((item) => item.id === topicId);
      return {
        topicId,
        label: topic?.shortTitle ?? topic?.title ?? topicId,
      };
    })
    .map(({ topicId, label }) => `<a href="#/topics/${escapeHtml(topicId)}">${escapeHtml(label)}</a>`)
    .join(', ');
}

function renderDimensionCard(dimension) {
  const linkedRecords = recordsForDimension(dimension.id);

  return `
    <article class="topic-card">
      <p class="eyebrow">${linkedRecords.length} linked records</p>
      <h3><a href="#/dimensions/${escapeHtml(dimension.id)}">${escapeHtml(dimension.title)}</a></h3>
      <p>${escapeHtml(dimension.summary)}</p>
    </article>
  `;
}

function renderRecordRow(record) {
  const attribution = attributionDisplay(record);

  return `
    <article class="record-row">
      <p class="eyebrow">
        ${escapeHtml(recordTypeLabel(record.recordType))}
        ${record.date || record.year ? ` | ${escapeHtml(formatDate(record.date ?? record.year))}` : ''}
      </p>
      <h3><a href="#/records/${escapeHtml(record.id)}">${escapeHtml(record.title)}</a></h3>
      ${attribution ? `<p class="record-attribution">${escapeHtml(attribution)}</p>` : ''}
      <p>${escapeHtml(record.summary)}</p>
      <p class="record-taxonomy">${renderTopicLinks(record.topics)}</p>
    </article>
  `;
}

export function renderDimensions() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Framework</p>
      <h1>Rule-Making Dimensions</h1>
      <p class="lede">
        Cross-cutting analytical lenses for comparing how actors shape objectives,
        legitimacy, agendas, coalitions, and operative rule text.
      </p>
    </section>
    <section>
      <div class="card-grid">
        ${dimensions.map(renderDimensionCard).join('')}
      </div>
    </section>
  `;
}

export function renderDimensionDetail(dimensionId) {
  const dimension = dimensions.find((item) => item.id === dimensionId);

  if (!dimension) {
    return `
      <section class="page-hero">
        <p class="eyebrow">Dimension not found</p>
        <h1>Dimension not found</h1>
        <p class="lede">The requested analytical lens is not in the portal index.</p>
        <a class="button button-secondary" href="#/dimensions">Back to Dimensions</a>
      </section>
    `;
  }

  const linkedRecords = recordsForDimension(dimension.id);

  return `
    <section class="page-hero">
      <p class="eyebrow">Analytical lens</p>
      <h1>${escapeHtml(dimension.title)}</h1>
      <p class="lede">${escapeHtml(dimension.summary)}</p>
      <div class="button-row">
        <a class="button button-primary" href="#/database?dimension=${escapeHtml(dimension.id)}">
          View ${linkedRecords.length} linked records
        </a>
      </div>
    </section>

    <section>
      <h2>Research questions</h2>
      <ul>
        ${asList(dimension.questions)
          .map((question) => `<li>${escapeHtml(question)}</li>`)
          .join('')}
      </ul>
    </section>

    <section>
      <h2>Linked records</h2>
      <p>${linkedRecords.length} records linked to this dimension.</p>
      <div class="record-list">
        ${linkedRecords.map(renderRecordRow).join('')}
      </div>
    </section>
  `;
}
