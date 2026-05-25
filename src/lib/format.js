const recordTypeLabels = {
  'treaty-agreement': 'Treaty / agreement',
  'institutional-document': 'Institutional document',
  'negotiation-record': 'Negotiation record',
  'national-law-policy': 'National law / policy',
  'case-dispute-award': 'Case / dispute / award',
  'official-statement': 'Official statement',
  'research-report': 'Research report',
  'academic-article': 'Academic article',
  'book-chapter': 'Book / chapter',
};

const authorityLabels = {
  'official-international-organization': 'Official international organization',
  'official-government': 'Official government',
  'official-regulator': 'Official regulator',
  'official-court-tribunal': 'Official court or tribunal',
  'treaty-depository': 'Treaty depository',
  'academic-publisher': 'Academic publisher',
  'think-tank': 'Think tank',
  'professional-commentary': 'Professional commentary',
};

const sourceLinkTypeLabels = {
  'official-page': 'Official page',
  'full-text': 'Full text',
  'pdf': 'PDF',
  'html-text': 'HTML text',
  'metadata': 'Metadata',
  'summary': 'Summary',
  'press-release': 'Press release',
  'working-paper': 'Working paper',
  'commentary': 'Commentary',
};

export function humanizeId(value) {
  return String(value ?? '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatDate(value) {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}$/.test(value)) return value;
  if (typeof value === 'string' && /^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, 1));
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function recordTypeLabel(value) {
  return recordTypeLabels[value] ?? humanizeId(value);
}

export function authorityLabel(value) {
  return authorityLabels[value] ?? humanizeId(value);
}

export function sourceLinkTypeLabel(value) {
  return sourceLinkTypeLabels[value] ?? humanizeId(value);
}
