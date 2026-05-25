function asList(value) {
  return Array.isArray(value) ? value : [];
}

function cleanText(value) {
  return String(value ?? '').trim();
}

export function authorDisplay(authors) {
  const names = asList(authors)
    .map((author) => cleanText(author?.name))
    .filter(Boolean);

  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;
}

export function attributionDisplay(record) {
  const authorText = authorDisplay(record?.authors);
  const publisherText = cleanText(record?.publisher);

  if (authorText && publisherText) return `${authorText} | ${publisherText}`;
  return authorText || publisherText;
}

export function hasAttribution(record) {
  return attributionDisplay(record).length > 0;
}
