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
    ...asList(record.jurisdictions),
    ...asList(record.institutions),
    ...asList(record.topics),
    ...asList(record.tags),
  ]
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .join(' ');
}

export function filterRecords(records, filters = {}) {
  const query = normalizeText(filters.query);
  const queryTokens = query.split(' ').filter(Boolean);

  return records.filter((record) => {
    const searchText = recordSearchText(record);

    if (queryTokens.length > 0 && !queryTokens.every((token) => searchText.includes(token))) return false;
    if (filters.recordType && record.recordType !== filters.recordType) return false;
    if (filters.topic && !asList(record.topics).includes(filters.topic)) return false;
    if (filters.actor && !asList(record.actors).includes(filters.actor)) return false;
    if (filters.institution && !asList(record.institutions).includes(filters.institution)) return false;
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
