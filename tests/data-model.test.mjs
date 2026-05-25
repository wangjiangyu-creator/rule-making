import assert from 'node:assert/strict';
import test from 'node:test';
import { recordTypes, languageStatuses, sourceAuthorities } from '../src/data/schema.js';
import { topics } from '../src/data/topics.js';
import { actors } from '../src/data/actors.js';
import { institutions } from '../src/data/institutions.js';
import { records } from '../src/data/records.js';
import { timeline } from '../src/data/timeline.js';

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

test('records use valid schema values and resolved references', () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  const actorIds = new Set(actors.map((actor) => actor.id));
  const institutionIds = new Set(institutions.map((institution) => institution.id));
  const recordIds = new Set(records.map((record) => record.id));

  assertUniqueIds(records, 'record');

  for (const record of records) {
    assert.ok(recordTypes.includes(record.recordType), `${record.id} has valid recordType`);
    assert.ok(languageStatuses.includes(record.languageStatus), `${record.id} has valid languageStatus`);
    assert.ok(sourceAuthorities.includes(record.sourceAuthority), `${record.id} has valid sourceAuthority`);

    for (const topicId of record.topics) {
      assert.ok(topicIds.has(topicId), `${record.id} references topic ${topicId}`);
    }

    for (const actorId of record.actors) {
      assert.ok(actorIds.has(actorId), `${record.id} references actor ${actorId}`);
    }

    for (const institutionId of record.institutions) {
      assert.ok(institutionIds.has(institutionId), `${record.id} references institution ${institutionId}`);
    }

    for (const relatedRecordId of record.relatedRecordIds) {
      assert.ok(recordIds.has(relatedRecordId), `${record.id} references record ${relatedRecordId}`);
    }
  }
});

test('records include usable source and summary metadata', () => {
  for (const record of records) {
    assert.ok(record.title.length > 5, `${record.id} has a descriptive title`);
    assert.ok(record.summary.length > 30, `${record.id} has a descriptive summary`);
    assert.ok(record.sourceLinks.length > 0, `${record.id} has at least one source link`);

    for (const sourceLink of record.sourceLinks) {
      assert.ok(sourceLink.label.length > 3, `${record.id} source link has a label`);
      assert.ok(sourceLink.url.startsWith('https://'), `${record.id} source link uses HTTPS`);
    }
  }
});

test('pilot corpus covers digital trade plus investment and financial rulemaking', () => {
  const digitalTradeRecords = records.filter((record) => record.topics.includes('digital-trade-ecommerce'));

  assert.ok(digitalTradeRecords.length >= 7, 'digital trade pilot has at least seven records');
  assert.ok(
    records.some((record) => record.topics.includes('international-investment')),
    'corpus includes international investment record',
  );
  assert.ok(
    records.some((record) => record.topics.includes('monetary-financial-regulation')),
    'corpus includes monetary and financial regulation record',
  );
});

test('timeline entries resolve to topic and record ids', () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  const recordIds = new Set(records.map((record) => record.id));

  for (const entry of timeline) {
    assert.ok(topicIds.has(entry.topicId), `${entry.title} references topic ${entry.topicId}`);
    assert.ok(entry.relatedIds.length > 0, `${entry.title} has related records`);

    for (const relatedId of entry.relatedIds) {
      assert.ok(recordIds.has(relatedId), `${entry.title} references record ${relatedId}`);
    }
  }
});

test('OECD digital trade record uses the official publication date', () => {
  const oecdRecord = records.find((record) => record.id === 'oecd-digital-trade-inventory-2023');

  assert.ok(oecdRecord, 'OECD digital trade record exists');
  assert.equal(oecdRecord.date, '2023-01-10');
});

test('DEPA record includes Chile with a resolved actor profile', () => {
  const chileActor = actors.find((actor) => actor.id === 'chile');
  const depaRecord = records.find((record) => record.id === 'depa-agreement-2020');

  assert.ok(chileActor, 'Chile actor exists');
  assert.equal(chileActor.name, 'Chile');
  assert.equal(chileActor.type, 'middle-power');
  assert.ok(chileActor.topicIds.includes('middle-small-powers'));
  assert.ok(chileActor.topicIds.includes('digital-trade-ecommerce'));
  assert.ok(depaRecord, 'DEPA record exists');
  assert.deepEqual([...depaRecord.actors].sort(), ['chile', 'new-zealand', 'singapore']);
});
