import assert from 'node:assert/strict';
import test from 'node:test';
import { recordTypes, languageStatuses, sourceAuthorities } from '../src/data/schema.js';
import { topics } from '../src/data/topics.js';
import { actors } from '../src/data/actors.js';
import { institutions } from '../src/data/institutions.js';

const expectedRecordTypes = [
  'treaty-agreement',
  'institutional-document',
  'negotiation-record',
  'national-law-policy',
  'case-dispute-award',
  'official-statement',
  'research-report',
  'academic-article',
  'book-chapter',
];

const expectedLanguageStatuses = [
  'official-original',
  'official-english',
  'official-bilingual',
  'official-summary',
  'unofficial-translation',
  'english-only',
  'chinese-only',
  'site-summary',
];

const expectedSourceAuthorities = [
  'official-international-organization',
  'official-government',
  'official-regulator',
  'official-court-tribunal',
  'treaty-depository',
  'academic-publisher',
  'think-tank',
  'professional-commentary',
];

const expectedTopicIds = [
  'theories-rulemaking',
  'great-powers',
  'united-states',
  'european-union',
  'china',
  'middle-small-powers',
  'wto-reform',
  'digital-trade-ecommerce',
  'cyber-data-governance',
  'monetary-financial-regulation',
  'international-investment',
  'ai-governance',
];

function assertUniqueIds(items, label) {
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, `${label} ids must be unique`);
}

test('schema lists allowed categories', () => {
  assert.deepEqual(recordTypes, expectedRecordTypes);
  assert.deepEqual(languageStatuses, expectedLanguageStatuses);
  assert.deepEqual(sourceAuthorities, expectedSourceAuthorities);
  assert.ok(recordTypes.includes('negotiation-record'));
  assert.ok(languageStatuses.includes('official-bilingual'));
  assert.ok(sourceAuthorities.includes('official-international-organization'));
});

test('topics, actors, and institutions use stable unique ids', () => {
  assert.deepEqual(
    topics.map((topic) => topic.id),
    expectedTopicIds,
  );
  assertUniqueIds(topics, 'topic');
  assertUniqueIds(actors, 'actor');
  assertUniqueIds(institutions, 'institution');
  assert.ok(topics.some((topic) => topic.id === 'digital-trade-ecommerce' && topic.pilot));
});

test('actor and institution topic references resolve', () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  for (const actor of actors) {
    for (const topicId of actor.topicIds) {
      assert.ok(topicIds.has(topicId), `${actor.id} references ${topicId}`);
    }
  }

  for (const institution of institutions) {
    for (const topicId of institution.topicIds) {
      assert.ok(topicIds.has(topicId), `${institution.id} references ${topicId}`);
    }
  }
});
