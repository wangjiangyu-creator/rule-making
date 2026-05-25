import assert from 'node:assert/strict';
import test from 'node:test';
import { groupSourceLinks, normalizeSourceLink } from '../src/lib/sources.js';

const fixtureRecord = {
  id: 'fixture-record',
  sourceAuthority: 'official-government',
  languageStatus: 'official-original',
};

test('normalizeSourceLink inherits record-level authority and language status', () => {
  const normalized = normalizeSourceLink(
    fixtureRecord,
    {
      label: 'Official text',
      url: 'https://example.com/text',
      linkType: 'full-text',
      note: 'Controlling text.',
    },
    0,
  );

  assert.equal(normalized.authority, 'official-government');
  assert.equal(normalized.languageStatus, 'official-original');
  assert.equal(normalized.group, 'primary');
});

test('groupSourceLinks orders primary, official, and secondary links', () => {
  const groups = groupSourceLinks({
    ...fixtureRecord,
    sourceLinks: [
      { label: 'Repository page', url: 'https://example.com/page', linkType: 'official-page' },
      { label: 'Commentary', url: 'https://example.com/commentary', linkType: 'commentary', authority: 'think-tank' },
      { label: 'Official PDF', url: 'https://example.com/text.pdf', linkType: 'pdf' },
    ],
  });

  assert.deepEqual(
    groups.map((group) => group.id),
    ['primary', 'official', 'secondary'],
  );
  assert.equal(groups[0].links[0].label, 'Official PDF');
  assert.equal(groups[2].links[0].label, 'Commentary');
});

test('groupSourceLinks gives legacy links a safe fallback group', () => {
  const groups = groupSourceLinks({
    ...fixtureRecord,
    sourceLinks: [
      { label: 'Legacy official page', url: 'https://example.com/legacy' },
    ],
  });

  assert.equal(groups[0].id, 'official');
  assert.equal(groups[0].links[0].linkType, 'official-page');
});
