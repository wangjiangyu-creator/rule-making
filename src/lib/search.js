import { actors } from '../data/actors.js';
import { institutions } from '../data/institutions.js';
import { topics } from '../data/topics.js';

const actorById = new Map(actors.map((actor) => [actor.id, actor]));
const institutionById = new Map(institutions.map((institution) => [institution.id, institution]));
const topicById = new Map(topics.map((topic) => [topic.id, topic]));

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function sourceLinkLabels(sourceLinks) {
  return asList(sourceLinks).map((sourceLink) =>
    sourceLink && typeof sourceLink === 'object' ? sourceLink.label : undefined,
  );
}

function relatedEntityLabels(ids, lookup, fields) {
  return asList(ids).flatMap((id) => {
    const item = lookup.get(id);
    return item ? fields.map((field) => item[field]) : [];
  });
}

export function recordSearchText(record) {
  return [
    record.title,
    record.alternateTitle,
    record.summary,
    record.recordType,
    record.sourceAuthority,
    record.languageStatus,
    record.year,
    ...asList(record.actors),
    ...relatedEntityLabels(record.actors, actorById, ['name']),
    ...asList(record.jurisdictions),
    ...asList(record.institutions),
    ...relatedEntityLabels(record.institutions, institutionById, ['name', 'shortName']),
    ...asList(record.topics),
    ...relatedEntityLabels(record.topics, topicById, ['title', 'shortTitle']),
    ...asList(record.tags),
    ...sourceLinkLabels(record.sourceLinks),
  ]
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .join(' ');
}

function hasFilterValue(value) {
  return String(value ?? '').trim() !== '';
}

function comparableDateValue(value) {
  const text = String(value ?? '').trim();

  if (/^\d{4}$/.test(text)) return `${text}-01-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  return '';
}

function comparableRecordDate(record) {
  return comparableDateValue(record.date) || comparableDateValue(record.year);
}

export function filterRecords(records, filters = {}) {
  const query = normalizeText(filters.query);
  const queryTokens = query.split(' ').filter(Boolean);
  const dateFrom = comparableDateValue(filters.dateFrom);
  const dateTo = comparableDateValue(filters.dateTo);

  return records.filter((record) => {
    const searchText = recordSearchText(record);
    const recordDate = dateFrom || dateTo ? comparableRecordDate(record) : '';

    if (queryTokens.length > 0 && !queryTokens.every((token) => searchText.includes(token))) return false;
    if (filters.recordType && record.recordType !== filters.recordType) return false;
    if (filters.topic && !asList(record.topics).includes(filters.topic)) return false;
    if (filters.actor && !asList(record.actors).includes(filters.actor)) return false;
    if (filters.institution && !asList(record.institutions).includes(filters.institution)) return false;
    if (filters.jurisdiction && !asList(record.jurisdictions).includes(filters.jurisdiction)) return false;
    if (hasFilterValue(filters.year) && String(record.year) !== String(filters.year)) return false;
    if (dateFrom && (!recordDate || recordDate < dateFrom)) return false;
    if (dateTo && (!recordDate || recordDate > dateTo)) return false;
    if (filters.languageStatus && record.languageStatus !== filters.languageStatus) return false;
    if (filters.sourceAuthority && record.sourceAuthority !== filters.sourceAuthority) return false;
    return true;
  });
}

function sortableDateValue(record) {
  const value = record.date ?? record.year ?? '';
  return String(value);
}

export function sortRecordsNewestFirst(records) {
  return [...records].sort((left, right) => sortableDateValue(right).localeCompare(sortableDateValue(left)));
}
