const groupTitles = {
  primary: 'Controlling or primary text',
  official: 'Official versions and document pages',
  secondary: 'Secondary or contextual links',
};

const priorityByType = {
  'full-text': 10,
  'html-text': 20,
  'pdf': 30,
  'official-page': 40,
  'summary': 50,
  'press-release': 60,
  'metadata': 70,
  'working-paper': 80,
  'commentary': 90,
};

function inferLinkType(record, sourceLink) {
  const label = String(sourceLink.label ?? '').toLowerCase();

  if (label.includes('pdf')) return 'pdf';
  if (label.includes('summary')) return 'summary';
  if (label.includes('press')) return 'press-release';
  if (record.sourceAuthority?.startsWith('official-') || record.sourceAuthority === 'treaty-depository') {
    return 'official-page';
  }

  return 'metadata';
}

function resolveGroup(linkType, authority) {
  if (linkType === 'full-text' || linkType === 'html-text' || linkType === 'pdf') return 'primary';
  if (authority?.startsWith('official-') || authority === 'treaty-depository') return 'official';
  return 'secondary';
}

export function normalizeSourceLink(record, sourceLink, index = 0) {
  const linkType = sourceLink.linkType ?? inferLinkType(record, sourceLink);
  const authority = sourceLink.authority ?? record.sourceAuthority;
  const languageStatus = sourceLink.languageStatus ?? record.languageStatus;
  const note = String(sourceLink.note ?? '').trim();
  const group = resolveGroup(linkType, authority);
  const sortKey = Number(sourceLink.sortHint ?? priorityByType[linkType] ?? 999) + index / 1000;

  return {
    ...sourceLink,
    linkType,
    authority,
    languageStatus,
    note,
    group,
    sortKey,
  };
}

export function groupSourceLinks(record) {
  const normalized = (Array.isArray(record.sourceLinks) ? record.sourceLinks : [])
    .map((sourceLink, index) => normalizeSourceLink(record, sourceLink, index))
    .sort((left, right) => left.sortKey - right.sortKey);

  return ['primary', 'official', 'secondary']
    .map((groupId) => ({
      id: groupId,
      title: groupTitles[groupId],
      links: normalized.filter((sourceLink) => sourceLink.group === groupId),
    }))
    .filter((group) => group.links.length > 0);
}
