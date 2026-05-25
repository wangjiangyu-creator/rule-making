function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeList(values) {
  if (!Array.isArray(values)) return [];
  return values.map((value) => normalizeText(value)).filter(Boolean);
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
    ...normalizeList(record.actors),
    ...normalizeList(record.jurisdictions),
    ...normalizeList(record.institutions),
    ...normalizeList(record.topics),
    ...normalizeList(record.tags),
  ]
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .join(' ');
}

export function filterRecords(records, filters = {}) {
  const query = normalizeText(filters.query);

  return records.filter((record) => {
    if (query && !recordSearchText(record).includes(query)) return false;
    if (filters.recordType && record.recordType !== filters.recordType) return false;
    if (filters.topic && !record.topics.includes(filters.topic)) return false;
    if (filters.actor && !record.actors.includes(filters.actor)) return false;
    if (filters.institution && !record.institutions.includes(filters.institution)) return false;
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
