import { dimensionById, summarizeDimensions } from '../lib/dimensions.js';
import { institutions } from '../data/institutions.js';
import { records } from '../data/records.js';
import { topics } from '../data/topics.js';
import { attributionDisplay } from '../lib/attribution.js';
import { formatDate, humanizeId, recordTypeLabel } from '../lib/format.js';
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

function recordsForInstitution(institutionId) {
  return sortRecordsNewestFirst(records.filter((record) => asList(record.institutions).includes(institutionId)));
}

function renderTopicLinks(topicIds) {
  return asList(topicIds)
    .map((topicId) => {
      const topic = topics.find((item) => item.id === topicId);
      const label = topic?.shortTitle ?? topic?.title ?? humanizeId(topicId);

      return `<a href="#/topics/${escapeHtml(topicId)}">${escapeHtml(label)}</a>`;
    })
    .join(', ');
}

function renderDimensionLinks(items) {
  return asList(items)
    .map((item) => {
      const dimensionId = typeof item === 'string' ? item : item.id;
      const count = typeof item === 'string' ? null : item.count;
      const dimension = dimensionById.get(dimensionId);
      const label = dimension?.title ?? humanizeId(dimensionId);

      return `<a href="#/dimensions/${escapeHtml(dimensionId)}">${escapeHtml(label)}${count ? ` (${count})` : ''}</a>`;
    })
    .join(', ');
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
      <p class="record-taxonomy">
        ${renderTopicLinks(record.topics)}
      </p>
      <p class="record-taxonomy">
        ${renderDimensionLinks(record.dimensions)}
      </p>
    </article>
  `;
}

function renderInstitutionCard(institution) {
  const linkedRecords = recordsForInstitution(institution.id);

  return `
    <article class="institution-card">
      <p class="eyebrow">${escapeHtml(humanizeId(institution.type))} | ${linkedRecords.length} linked records</p>
      <h3><a href="#/institutions/${escapeHtml(institution.id)}">${escapeHtml(institution.name)}</a></h3>
      <p>${escapeHtml(institution.summary)}</p>
      <p>${renderTopicLinks(institution.topicIds)}</p>
    </article>
  `;
}

export function renderInstitutions() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Forums and institutions</p>
      <h1>Institutions</h1>
      <p class="lede">
        International organizations, forums, and rule-producing bodies that structure
        bargaining, standards, dispute settlement, and legal harmonization.
      </p>
    </section>
    <section>
      <div class="card-grid">
        ${institutions.map(renderInstitutionCard).join('')}
      </div>
    </section>
  `;
}

export function renderInstitutionDetail(institutionId) {
  const institution = institutions.find((item) => item.id === institutionId);

  if (!institution) {
    return `
      <section class="page-hero">
        <p class="eyebrow">Institution not found</p>
        <h1>Institution not found</h1>
        <p class="lede">The requested institution is not in the portal index.</p>
        <a class="button button-secondary" href="#/institutions">Back to Institutions</a>
      </section>
    `;
  }

  const linkedRecords = recordsForInstitution(institution.id);
  const linkedDimensions = summarizeDimensions(linkedRecords);

  return `
    <section class="page-hero">
      <p class="eyebrow">${escapeHtml(humanizeId(institution.type))}</p>
      <h1>${escapeHtml(institution.name)}</h1>
      <p class="lede">${escapeHtml(institution.summary)}</p>
    </section>
    <section>
      <h2>Linked topics</h2>
      <p>${renderTopicLinks(institution.topicIds)}</p>
    </section>
    <section>
      <h2>Rule-making dimensions</h2>
      <p>${renderDimensionLinks(linkedDimensions)}</p>
    </section>
    <section>
      <h2>Linked records</h2>
      <p>${linkedRecords.length} records linked to this institution.</p>
      <div class="record-list">
        ${
          linkedRecords.length > 0
            ? linkedRecords.map(renderRecordRow).join('')
            : '<p>No records are directly linked to this institution yet.</p>'
        }
      </div>
    </section>
  `;
}
