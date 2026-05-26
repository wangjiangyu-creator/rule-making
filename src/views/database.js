import { actors } from '../data/actors.js';
import { dimensions } from '../data/dimensions.js';
import { institutions } from '../data/institutions.js';
import { records } from '../data/records.js?v=20260526g';
import { languageStatuses, recordTypes, sourceAuthorities } from '../data/schema.js';
import { topics } from '../data/topics.js';
import { attributionDisplay, authorDisplay } from '../lib/attribution.js';
import { authorityLabel, formatDate, humanizeId, recordTypeLabel, sourceLinkTypeLabel } from '../lib/format.js';
import { filterRecords, sortRecordsNewestFirst } from '../lib/search.js';
import { groupSourceLinks } from '../lib/sources.js';

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
    dimension: params.get('dimension') ?? '',
    actor: params.get('actor') ?? '',
    institution: params.get('institution') ?? '',
    recordType: params.get('recordType') ?? '',
    languageStatus: params.get('languageStatus') ?? '',
    sourceAuthority: params.get('sourceAuthority') ?? '',
    jurisdiction: params.get('jurisdiction') ?? '',
    dateFrom: params.get('dateFrom') ?? '',
    dateTo: params.get('dateTo') ?? '',
    year: params.get('year') ?? '',
  };
}

function uniqueSortedOptions(values, sort = (left, right) => left.localeCompare(right)) {
  return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))]
    .sort(sort)
    .map((value) => ({ value, label: value }));
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

function renderDateInput(name, label, selectedValue) {
  return `
    <label>
      <span>${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" type="date" value="${escapeHtml(selectedValue)}">
    </label>
  `;
}

function renderFilterForm(filters) {
  const jurisdictionOptions = uniqueSortedOptions(records.flatMap((record) => asList(record.jurisdictions)));
  const yearOptions = uniqueSortedOptions(records.map((record) => record.year), (left, right) =>
    right.localeCompare(left),
  );

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
        'dimension',
        'Dimension',
        dimensions.map((dimension) => ({ value: dimension.id, label: dimension.title })),
        filters.dimension,
        'All dimensions',
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
      ${renderSelect('jurisdiction', 'Jurisdiction', jurisdictionOptions, filters.jurisdiction, 'All jurisdictions')}
      ${renderSelect('year', 'Year', yearOptions, filters.year, 'All years')}
      ${renderDateInput('dateFrom', 'Date from', filters.dateFrom)}
      ${renderDateInput('dateTo', 'Date to', filters.dateTo)}
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
        ${renderLinkedItems(record.topics, topics, 'topics', (topic) => topic.shortTitle ?? topic.title)}
      </p>
      <p class="record-taxonomy">
        ${renderLinkedItems(record.dimensions, dimensions, 'dimensions', (dimension) => dimension.shortTitle ?? dimension.title)}
      </p>
    </article>
  `;
}

function renderSourceBadge(label) {
  return `<span class="source-badge">${escapeHtml(label)}</span>`;
}

function renderSourceDossierRow(sourceLink) {
  const href = sanitizeSourceHref(sourceLink.url);
  const linkMarkup = href
    ? `<a href="${escapeHtml(href)}" rel="noreferrer" target="_blank">${escapeHtml(sourceLink.label)}</a>`
    : `${escapeHtml(sourceLink.label)} <span class="source-url-invalid">(invalid source URL)</span>`;

  const badges = [
    sourceLinkTypeLabel(sourceLink.linkType),
    authorityLabel(sourceLink.authority),
    humanizeId(sourceLink.languageStatus),
  ];

  return `
    <li class="source-dossier-row">
      <p class="source-dossier-link">${linkMarkup}</p>
      <p class="source-badge-list">${badges.map(renderSourceBadge).join('')}</p>
      ${sourceLink.note ? `<p class="source-note">${escapeHtml(sourceLink.note)}</p>` : ''}
    </li>
  `;
}

function renderSourceDossierGroup(group) {
  return `
    <section class="source-dossier-group">
      <h3>${escapeHtml(group.title)}</h3>
      <ul class="clean-list source-dossier-list">
        ${group.links.map(renderSourceDossierRow).join('')}
      </ul>
    </section>
  `;
}

function sanitizeSourceHref(value) {
  try {
    const parsedUrl = new URL(String(value ?? '').trim());
    const allowedProtocols = new Set(['http:', 'https:', 'mailto:']);

    return allowedProtocols.has(parsedUrl.protocol) ? parsedUrl.href : '';
  } catch {
    return '';
  }
}

export function renderDatabase() {
  const filters = currentFilters();
  const filteredRecords = sortRecordsNewestFirst(
    filterRecords(records, {
      query: filters.query,
      topic: filters.topic,
      dimension: filters.dimension,
      actor: filters.actor,
      institution: filters.institution,
      jurisdiction: filters.jurisdiction,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      year: filters.year,
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
  const attribution = attributionDisplay(record);
  const authors = authorDisplay(record.authors);
  const sourceGroups = groupSourceLinks(record);

  return `
    <article class="record-detail">
      <section class="page-hero">
        <p class="eyebrow">${escapeHtml(recordTypeLabel(record.recordType))}</p>
        <h1>${escapeHtml(record.title)}</h1>
        ${record.alternateTitle ? `<p class="lede">${escapeHtml(record.alternateTitle)}</p>` : ''}
        ${attribution ? `<p class="record-attribution record-attribution-detail">${escapeHtml(attribution)}</p>` : ''}
      </section>

      <section>
        <h2>Summary</h2>
        <p>${escapeHtml(record.summary)}</p>
      </section>

      <section>
        <h2>Metadata</h2>
        <dl>
          ${authors ? `<dt>Authors</dt><dd>${escapeHtml(authors)}</dd>` : ''}
          ${record.publisher ? `<dt>Publisher</dt><dd>${escapeHtml(record.publisher)}</dd>` : ''}
          <dt>Date</dt>
          <dd>${escapeHtml(formattedDate)}</dd>
          <dt>Source authority</dt>
          <dd>${escapeHtml(authorityLabel(record.sourceAuthority))}</dd>
          <dt>Language status</dt>
          <dd>${escapeHtml(humanizeId(record.languageStatus))}</dd>
          <dt>Topics</dt>
          <dd>${renderLinkedItems(record.topics, topics, 'topics', (topic) => topic.title)}</dd>
          <dt>Dimensions</dt>
          <dd>${renderLinkedItems(record.dimensions, dimensions, 'dimensions', (dimension) => dimension.title)}</dd>
          <dt>Actors</dt>
          <dd>${renderLinkedItems(record.actors, actors, 'actors')}</dd>
          <dt>Institutions</dt>
          <dd>${renderLinkedItems(record.institutions, institutions, 'institutions', (institution) => institution.shortName ?? institution.name)}</dd>
        </dl>
      </section>

      <section>
        <h2>Source dossier</h2>
        <div class="source-dossier">
          ${sourceGroups.map(renderSourceDossierGroup).join('')}
        </div>
      </section>

      <section>
        <h2>Citation</h2>
        <p>${escapeHtml(record.citation)}</p>
      </section>
    </article>
  `;
}
