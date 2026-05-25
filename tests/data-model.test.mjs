import assert from 'node:assert/strict';
import test from 'node:test';
import { recordTypes, languageStatuses, sourceAuthorities } from '../src/data/schema.js';
import { topics } from '../src/data/topics.js';
import { actors } from '../src/data/actors.js';
import { institutions } from '../src/data/institutions.js';
import { records } from '../src/data/records.js';
import { timeline } from '../src/data/timeline.js';
import { formatDate, recordTypeLabel } from '../src/lib/format.js';
import { filterRecords, sortRecordsNewestFirst } from '../src/lib/search.js';

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

test('every topic has at least one linked record', () => {
  const linkedTopicIds = new Set(records.flatMap((record) => (Array.isArray(record.topics) ? record.topics : [])));

  for (const topic of topics) {
    assert.ok(linkedTopicIds.has(topic.id), `${topic.id} has at least one linked record`);
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

test('search helpers filter records by query, topic, and actor', () => {
  const queryResults = filterRecords(records, { query: 'source code' });
  const investmentResults = filterRecords(records, { topic: 'international-investment' });
  const chinaResults = filterRecords(records, { actor: 'china' });

  assert.deepEqual(
    queryResults.map((record) => record.id),
    ['usmca-digital-trade-chapter-2020'],
  );
  assert.ok(investmentResults.length > 0, 'international investment filter returns records');
  assert.ok(
    investmentResults.every((record) => record.topics.includes('international-investment')),
    'topic filter only returns international investment records',
  );
  assert.ok(chinaResults.length > 0, 'China actor filter returns records');
  assert.ok(
    chinaResults.every((record) => record.actors.includes('china')),
    'actor filter only returns China records',
  );
});

test('search helpers filter records by jurisdiction', () => {
  const chinaResults = filterRecords(records, { jurisdiction: 'China' });

  assert.ok(chinaResults.length > 0, 'China jurisdiction filter returns records');
  assert.ok(
    chinaResults.every((record) => record.jurisdictions.includes('China')),
    'jurisdiction filter only returns records whose jurisdictions include China',
  );
  assert.ok(
    chinaResults.some((record) => record.id === 'china-data-security-law-2021'),
    'China jurisdiction filter includes the China Data Security Law record',
  );
});

test('search helpers filter records by date range', () => {
  const dateResults = filterRecords(records, { dateFrom: '2020-01-01', dateTo: '2020-12-31' });
  const resultIds = dateResults.map((record) => record.id);

  assert.ok(resultIds.includes('depa-agreement-2020'), 'date range includes the DEPA record');
  assert.ok(resultIds.includes('usmca-digital-trade-chapter-2020'), 'date range includes the USMCA record');
  assert.ok(
    !resultIds.includes('china-data-security-law-2021'),
    'date range excludes the 2021 China Data Security Law record',
  );
});

test('search helpers filter records by year', () => {
  const yearResults = filterRecords(records, { year: '2020' });
  const resultIds = yearResults.map((record) => record.id);

  assert.ok(resultIds.includes('depa-agreement-2020'), 'year filter includes the DEPA record');
  assert.ok(resultIds.includes('usmca-digital-trade-chapter-2020'), 'year filter includes the USMCA record');
  assert.ok(yearResults.every((record) => record.year === 2020), 'year filter only returns 2020 records');
});

test('search helpers include source-link labels in query text', () => {
  const queryResults = filterRecords(records, { query: 'USTR' });

  assert.ok(
    queryResults.some((record) => record.id === 'usmca-digital-trade-chapter-2020'),
    'USTR query finds the USMCA record because source labels are searchable',
  );
});

test('search helpers include related entity display labels in query text', () => {
  assert.ok(
    filterRecords(records, { query: 'World Trade Organization' }).some(
      (record) => record.id === 'wto-work-programme-electronic-commerce-1998',
    ),
    'World Trade Organization query finds WTO-linked records',
  );
  assert.ok(
    filterRecords(records, { query: 'International Monetary Fund' }).some(
      (record) => record.id === 'imf-institutional-view-capital-flows-2012',
    ),
    'International Monetary Fund query finds IMF-linked records',
  );
  assert.ok(
    filterRecords(records, { query: 'Global AI Governance' }).some(
      (record) => record.id === 'oecd-ai-principles-2019',
    ),
    'Global AI Governance query finds AI-governance topic records',
  );
});

test('search helpers tolerate missing list fields when filtering', () => {
  const partialRecords = [
    {
      title: 'Partial',
      summary: 'Digital source record',
      recordType: 'research-report',
      sourceAuthority: 'think-tank',
      languageStatus: 'english-only',
      year: 2024,
    },
  ];

  assert.deepEqual(filterRecords(partialRecords, { topic: 'digital-trade-ecommerce' }), []);
});

test('search helpers match multi-word queries across searchable fields', () => {
  const queryResults = filterRecords(records, { query: 'digital source' });

  assert.ok(
    queryResults.some((record) => record.id === 'usmca-digital-trade-chapter-2020'),
    'tokenized query finds the USMCA source code record',
  );
});

test('format helpers provide readable labels and dates', () => {
  assert.equal(recordTypeLabel('negotiation-record'), 'Negotiation record');
  assert.equal(formatDate('2020-06-12'), 'Jun 12, 2020');
  assert.equal(formatDate('2020'), '2020');
});

test('sortRecordsNewestFirst returns a new array with the latest record first', () => {
  const input = [
    { id: 'older-date', date: '2020-06-12', year: 2020 },
    { id: 'latest-date', date: '2022-10-19', year: 2022 },
    { id: 'year-only', year: 2021 },
  ];
  const originalOrder = input.map((record) => record.id);

  const sorted = sortRecordsNewestFirst(input);

  assert.notEqual(sorted, input);
  assert.deepEqual(input.map((record) => record.id), originalOrder);
  assert.equal(sorted[0].id, 'latest-date');
});
