import { dimensionById, summarizeDimensions } from '../lib/dimensions.js';
import { actors } from '../data/actors.js';
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

function recordsForActor(actorId) {
  return sortRecordsNewestFirst(records.filter((record) => asList(record.actors).includes(actorId)));
}

function renderTopicLinks(topicIds) {
  return asList(topicIds)
    .map((topicId) => {
      const topic = topics.find((item) => item.id === topicId);
      const label = topic?.title ?? topic?.shortTitle ?? humanizeId(topicId);

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

function renderActorCard(actor) {
  const linkedRecords = recordsForActor(actor.id);

  return `
    <article class="actor-card">
      <p class="eyebrow">${escapeHtml(humanizeId(actor.type))} | ${linkedRecords.length} linked records</p>
      <h3><a href="#/actors/${escapeHtml(actor.id)}">${escapeHtml(actor.name)}</a></h3>
      <p>${escapeHtml(actor.summary)}</p>
      <p>${renderTopicLinks(actor.topicIds)}</p>
    </article>
  `;
}

export function renderActors() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Power and agency</p>
      <h1>Actors</h1>
      <p class="lede">
        State, regional, and middle-power actors connected to rule-making strategies,
        legal instruments, and institutional agendas.
      </p>
    </section>
    <section>
      <div class="card-grid">
        ${actors.map(renderActorCard).join('')}
      </div>
    </section>
  `;
}

export function renderActorDetail(actorId) {
  const actor = actors.find((item) => item.id === actorId);

  if (!actor) {
    return `
      <section class="page-hero">
        <p class="eyebrow">Actor not found</p>
        <h1>Actor not found</h1>
        <p class="lede">The requested actor is not in the portal index.</p>
        <a class="button button-secondary" href="#/actors">Back to Actors</a>
      </section>
    `;
  }

  const linkedRecords = recordsForActor(actor.id);
  const linkedDimensions = summarizeDimensions(linkedRecords);

  return `
    <section class="page-hero">
      <p class="eyebrow">${escapeHtml(humanizeId(actor.type))}</p>
      <h1>${escapeHtml(actor.name)}</h1>
      <p class="lede">${escapeHtml(actor.summary)}</p>
    </section>
    <section>
      <h2>Linked topics</h2>
      <p>${renderTopicLinks(actor.topicIds)}</p>
    </section>
    <section>
      <h2>Rule-making dimensions</h2>
      <p>${renderDimensionLinks(linkedDimensions)}</p>
    </section>
    <section>
      <h2>Linked records</h2>
      <p>${linkedRecords.length} records linked to this actor.</p>
      <div class="record-list">
        ${
          linkedRecords.length > 0
            ? linkedRecords.map(renderRecordRow).join('')
            : '<p>No records are directly linked to this actor yet.</p>'
        }
      </div>
    </section>
  `;
}
