import { actors } from '../data/actors.js';
import { institutions } from '../data/institutions.js';
import { records } from '../data/records.js';
import { languageStatuses, recordTypes, sourceAuthorities } from '../data/schema.js';
import { topics } from '../data/topics.js';
import { authorityLabel, formatDate, humanizeId, recordTypeLabel } from '../lib/format.js';
import { filterRecords, sortRecordsNewestFirst } from '../lib/search.js';

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

function findById(items, id) {
  return items.find((item) => item.id === id);
}

function currentHashParams() {
  const hash = globalThis.location?.hash ?? '';
  const queryStart = hash.indexOf('?');

  return new URLSearchParams(queryStart === -1 ? '' : hash.slice(queryStart + 1));
}

function currentFilters() {
  const params = currentHashParams();

  return {
    query: params.get('q') ?? '',
    topic: params.get('topic') ?? '',
    actor: params.get('actor') ?? '',
    institution: params.get('institution') ?? '',
    recordType: params.get('recordType') ?? '',
    languageStatus: params.get('languageStatus') ?? '',
    sourceAuthority: params.get('sourceAuthority') ?? '',
  };
}

function renderOption(value, label, selectedValue) {
  const selected = value === selectedValue ? ' selected' : '';

  return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
}

function renderSelect(name, label, options, selectedValue, emptyLabel) {
  return `
    <label>
      <span>${escapeHtml(label)}</span>
      <select name="${escapeHtml(name)}">
        ${renderOption('', emptyLabel, selectedValue)}
        ${options.map((option) => renderOption(option.value, option.label, selectedValue)).join('')}
      </select>
    </label>
  `;
}

function renderFilterForm(filters) {
  return `
    <form class="filter-form" data-filter-form>
      <label>
        <span>Search</span>
        <input name="q" type="search" autocomplete="off" value="${escapeHtml(filters.query)}">
      </label>
      ${renderSelect(
        'topic',
        'Topic',
        topics.map((topic) => ({ value: topic.id, label: topic.title })),
        filters.topic,
        'All topics',
      )}
      ${renderSelect(
        'actor',
        'Actor',
        actors.map((actor) => ({ value: actor.id, label: actor.name })),
        filters.actor,
        'All actors',
      )}
      ${renderSelect(
        'institution',
        'Institution',
        institutions.map((institution) => ({ value: institution.id, label: institution.shortName ?? institution.name })),
        filters.institution,
        'All institutions',
      )}
      ${renderSelect(
        'recordType',
        'Record type',
        recordTypes.map((type) => ({ value: type, label: recordTypeLabel(type) })),
        filters.recordType,
        'All record types',
      )}
      ${renderSelect(
        'languageStatus',
        'Language status',
        languageStatuses.map((status) => ({ value: status, label: humanizeId(status) })),
        filters.languageStatus,
        'All language statuses',
      )}
      ${renderSelect(
        'sourceAuthority',
        'Source authority',
        sourceAuthorities.map((authority) => ({ value: authority, label: authorityLabel(authority) })),
        filters.sourceAuthority,
        'All source authorities',
      )}
      <div class="button-row">
        <button class="button button-primary" type="submit">Apply Filters</button>
        <a class="button button-secondary" href="#/database">Clear</a>
      </div>
    </form>
  `;
}

function renderLinkedItems(ids, items, routeBase, labelSelector = (item) => item.name ?? item.title) {
  const links = asList(ids)
    .map((id) => {
      const item = findById(items, id);
      const label = item ? labelSelector(item) : humanizeId(id);

      return `<a href="#/${routeBase}/${escapeHtml(id)}">${escapeHtml(label)}</a>`;
    })
    .join(', ');

  return links || 'None listed';
}

function renderRecordRow(record) {
  return `
    <article class="record-row">
      <p class="eyebrow">
        ${escapeHtml(recordTypeLabel(record.recordType))}
        ${record.date || record.year ? ` | ${escapeHtml(formatDate(record.date ?? record.year))}` : ''}
      </p>
      <h3><a href="#/records/${escapeHtml(record.id)}">${escapeHtml(record.title)}</a></h3>
      <p>${escapeHtml(record.summary)}</p>
      <p>
        ${renderLinkedItems(record.topics, topics, 'topics', (topic) => topic.shortTitle ?? topic.title)}
      </p>
    </article>
  `;
}

function renderSourceLink(sourceLink) {
  return `
    <li>
      <a href="${escapeHtml(sourceLink.url)}" rel="noreferrer" target="_blank">${escapeHtml(sourceLink.label)}</a>
    </li>
  `;
}

export function renderDatabase() {
  const filters = currentFilters();
  const filteredRecords = sortRecordsNewestFirst(
    filterRecords(records, {
      query: filters.query,
      topic: filters.topic,
      actor: filters.actor,
      institution: filters.institution,
      recordType: filters.recordType,
      languageStatus: filters.languageStatus,
      sourceAuthority: filters.sourceAuthority,
    }),
  );

  return `
    <section class="page-hero">
      <p class="eyebrow">Structured database</p>
      <h1>Rule-Making Records</h1>
      <p class="lede">
        Search and filter primary materials, institutional documents, legal texts,
        official reports, and research records linked to the portal topics.
      </p>
    </section>

    <section>
      <h2>Filters</h2>
      ${renderFilterForm(filters)}
    </section>

    <section>
      <h2>Records</h2>
      <p>${filteredRecords.length} record${filteredRecords.length === 1 ? '' : 's'} found.</p>
      <div class="record-list">
        ${
          filteredRecords.length > 0
            ? filteredRecords.map(renderRecordRow).join('')
            : '<p>No records match the current filters.</p>'
        }
      </div>
    </section>
  `;
}

export function renderRecordDetail(recordId) {
  const record = records.find((item) => item.id === recordId);

  if (!record) {
    return `
      <section class="page-hero">
        <p class="eyebrow">Record not found</p>
        <h1>Record not found</h1>
        <p class="lede">The requested rule-making record is not in the database.</p>
        <a class="button button-secondary" href="#/database">Back to Database</a>
      </section>
    `;
  }

  const formattedDate = record.date || record.year ? formatDate(record.date ?? record.year) : 'Date not listed';

  return `
    <article class="record-detail">
      <section class="page-hero">
        <p class="eyebrow">${escapeHtml(recordTypeLabel(record.recordType))}</p>
        <h1>${escapeHtml(record.title)}</h1>
        ${record.alternateTitle ? `<p class="lede">${escapeHtml(record.alternateTitle)}</p>` : ''}
      </section>

      <section>
        <h2>Summary</h2>
        <p>${escapeHtml(record.summary)}</p>
      </section>

      <section>
        <h2>Metadata</h2>
        <dl>
          <dt>Date</dt>
          <dd>${escapeHtml(formattedDate)}</dd>
          <dt>Source authority</dt>
          <dd>${escapeHtml(authorityLabel(record.sourceAuthority))}</dd>
          <dt>Language status</dt>
          <dd>${escapeHtml(humanizeId(record.languageStatus))}</dd>
          <dt>Topics</dt>
          <dd>${renderLinkedItems(record.topics, topics, 'topics', (topic) => topic.title)}</dd>
          <dt>Actors</dt>
          <dd>${renderLinkedItems(record.actors, actors, 'actors')}</dd>
          <dt>Institutions</dt>
          <dd>${renderLinkedItems(record.institutions, institutions, 'institutions', (institution) => institution.shortName ?? institution.name)}</dd>
        </dl>
      </section>

      <section>
        <h2>Sources</h2>
        <ul>
          ${asList(record.sourceLinks).map(renderSourceLink).join('')}
        </ul>
      </section>

      <section>
        <h2>Citation</h2>
        <p>${escapeHtml(record.citation)}</p>
      </section>
    </article>
  `;
}
