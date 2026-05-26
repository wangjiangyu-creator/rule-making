import assert from 'node:assert/strict';
import test from 'node:test';
import { dimensions } from '../src/data/dimensions.js';
import { authorKinds, recordTypes, languageStatuses, sourceAuthorities, sourceLinkTypes } from '../src/data/schema.js';
import { topics } from '../src/data/topics.js';
import { actors } from '../src/data/actors.js';
import { institutions } from '../src/data/institutions.js';
import { records } from '../src/data/records.js';
import { timeline } from '../src/data/timeline.js';
import { formatDate, recordTypeLabel } from '../src/lib/format.js';
import { filterRecords, recordSearchText, sortRecordsNewestFirst } from '../src/lib/search.js';

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

const expectedSourceLinkTypes = [
  'official-page',
  'full-text',
  'pdf',
  'html-text',
  'metadata',
  'summary',
  'press-release',
  'working-paper',
  'commentary',
];

const expectedAuthorKinds = [
  'person',
  'institution',
];

const expectedTopicIds = [
  'theories-rulemaking',
  'great-powers',
  'britain-imperial-rulemaking',
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

const expectedDimensionIds = [
  'agenda-setting',
  'coalition-consensus-building',
  'legitimacy-management',
  'norm-entrepreneurship-drafting-power',
  'objective-setting',
];

function assertUniqueIds(items, label) {
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, `${label} ids must be unique`);
}

test('schema lists allowed categories', () => {
  assert.deepEqual(recordTypes, expectedRecordTypes);
  assert.deepEqual(languageStatuses, expectedLanguageStatuses);
  assert.deepEqual(sourceAuthorities, expectedSourceAuthorities);
  assert.deepEqual(sourceLinkTypes, expectedSourceLinkTypes);
  assert.deepEqual(authorKinds, expectedAuthorKinds);
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
  assert.ok(institutions.some((institution) => institution.id === 'aiib'));
  assert.ok(institutions.some((institution) => institution.id === 'new-development-bank'));
  assert.ok(institutions.some((institution) => institution.id === 'brics'));
  assert.ok(institutions.some((institution) => institution.id === 'belt-road-forum'));
});

test('records expose a stable dimensions classification layer', () => {
  assert.deepEqual(
    dimensions.map((dimension) => dimension.id).sort(),
    expectedDimensionIds,
  );

  const dimensionIds = new Set(dimensions.map((dimension) => dimension.id));
  const linkedDimensionIds = new Set();

  for (const topic of topics) {
    assert.ok(Array.isArray(topic.dimensionIds), `${topic.id} defines relevant dimensions`);
    assert.ok(topic.dimensionIds.length >= 1, `${topic.id} has at least one relevant dimension`);

    for (const dimensionId of topic.dimensionIds) {
      assert.ok(dimensionIds.has(dimensionId), `${topic.id} references dimension ${dimensionId}`);
    }
  }

  for (const record of records) {
    assert.ok(Array.isArray(record.dimensions), `${record.id} exposes dimensions`);
    assert.ok(record.dimensions.length >= 1, `${record.id} has at least one dimension`);

    for (const dimensionId of record.dimensions) {
      assert.ok(dimensionIds.has(dimensionId), `${record.id} references dimension ${dimensionId}`);
      linkedDimensionIds.add(dimensionId);
    }
  }

  assert.deepEqual([...linkedDimensionIds].sort(), expectedDimensionIds);
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
    assert.ok(
      record.date === undefined
        || /^\d{4}$/.test(String(record.date))
        || /^\d{4}-\d{2}$/.test(String(record.date))
        || /^\d{4}-\d{2}-\d{2}$/.test(String(record.date)),
      `${record.id} uses a supported date precision`,
    );

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

test('second content batch adds official rulemaking materials across the portal map', () => {
  const expectedIds = [
    'cptpp-electronic-commerce-chapter-2018',
    'rcep-electronic-commerce-chapter-2020',
    'wto-agreement-electronic-commerce-2024',
    'singapore-australia-digital-economy-agreement-2020',
    'eu-data-act-2023',
    'eu-general-data-protection-regulation-2016',
    'china-personal-information-protection-law-2021',
    'cjeu-schrems-ii-2020',
    'eu-artificial-intelligence-act-2024',
    'un-general-assembly-ai-resolution-78-265-2024',
    'g7-hiroshima-ai-process-code-conduct-2023',
    'wto-investment-facilitation-development-agreement-2024',
    'fsb-crypto-asset-recommendations-2023',
    'basel-iii-finalising-post-crisis-reforms-2017',
    'wto-world-trade-report-digital-technologies-2018',
    'wto-mc12-outcome-document-2022',
  ];
  const recordIds = new Set(records.map((record) => record.id));
  const digitalTradeRecords = records.filter((record) => record.topics.includes('digital-trade-ecommerce'));
  const officialOrCourtRecords = expectedIds
    .map((id) => records.find((record) => record.id === id))
    .filter(Boolean);

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(digitalTradeRecords.length >= 13, 'digital trade pilot has at least thirteen records');
  assert.equal(officialOrCourtRecords.length, expectedIds.length);
  assert.ok(
    officialOrCourtRecords.every((record) =>
      ['official-international-organization', 'official-government', 'official-court-tribunal'].includes(
        record.sourceAuthority,
      ),
    ),
    'second batch is anchored in official or court sources',
  );
});

test('third content batch gives every topic a substantive mixed-source shelf', () => {
  const expectedIds = [
    'krasner-structural-causes-regime-consequences-1982',
    'goldstein-kahler-keohane-slaughter-legalization-world-politics-2000',
    'keohane-after-hegemony-1984',
    'braithwaite-drahos-global-business-regulation-2000',
    'ikenberry-after-victory-2001',
    'drezner-all-politics-is-global-2007',
    'farrell-newman-weaponized-interdependence-2019',
    'us-chips-and-science-act-2022',
    'ustr-national-trade-estimate-report-2024',
    'us-international-cyberspace-digital-policy-strategy-2024',
    'us-japan-digital-trade-agreement-2019',
    'bradford-brussels-effect-2020',
    'eu-digital-markets-act-2022',
    'eu-nis2-directive-2022',
    'china-cybersecurity-law-2016',
    'china-global-ai-governance-initiative-2023',
    'china-generative-ai-measures-2023',
    'saving-wto-middle-power-insiders-jsis-2023',
    'developing-country-coalitions-wto-rolland-2010',
    'apec-privacy-framework-2015',
    'wto-mpia-2020',
    'wto-mc13-abu-dhabi-ministerial-declaration-2024',
    'chatham-house-reforming-wto-2020',
    'uk-singapore-digital-economy-agreement-2022',
    'un-cross-border-paperless-trade-framework-2016',
    'wto-digital-trade-for-development-2023',
    'cigi-data-digital-trade-regulation-2018',
    'budapest-convention-cybercrime-2001',
    'council-europe-convention-108-plus-2018',
    'oecd-government-access-private-sector-data-2022',
    'un-cybercrime-convention-2024',
    'imf-articles-of-agreement-1944',
    'cpmi-iosco-principles-financial-market-infrastructures-2012',
    'fsb-key-attributes-resolution-regimes-2014',
    'iosco-objectives-principles-securities-regulation-2017',
    'icsid-convention-1965',
    'icsid-rules-regulations-2022',
    'unctad-world-investment-report-2025',
    'cjeu-achmea-2018',
    'nist-ai-risk-management-framework-2023',
    'us-executive-order-ai-14110-2023',
    'council-europe-ai-framework-convention-2024',
    'bletchley-declaration-2023',
  ];
  const recordIds = new Set(records.map((record) => record.id));
  const literatureTypes = new Set(['academic-article', 'book-chapter']);

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(records.length >= 70, 'database has at least seventy records after broad expansion');
  assert.ok(records.filter((record) => literatureTypes.has(record.recordType)).length >= 12, 'database has a literature shelf');
  assert.ok(records.filter((record) => record.sourceAuthority === 'think-tank').length >= 4, 'database includes think tank reports and analysis');

  for (const topic of topics) {
    const topicRecords = records.filter((record) => record.topics.includes(topic.id));
    const topicRecordTypes = new Set(topicRecords.map((record) => record.recordType));

    assert.ok(topicRecords.length >= 5, `${topic.id} has at least five records`);
    assert.ok(topicRecordTypes.size >= 2, `${topic.id} has more than one material type`);
  }
});

test('records use valid attribution fields when present', () => {
  for (const record of records) {
    if (record.authors) {
      assert.ok(Array.isArray(record.authors), `${record.id} authors is an array`);
      assert.ok(record.authors.length >= 1, `${record.id} authors is not empty`);

      for (const author of record.authors) {
        assert.ok(author.name.length >= 3, `${record.id} author has a display name`);
        assert.ok(authorKinds.includes(author.kind), `${record.id} author uses a valid kind`);
      }
    }

    if (record.publisher) {
      assert.ok(record.publisher.length >= 3, `${record.id} publisher is descriptive`);
    }
  }
});

test('first-pass attribution records expose structured authors and publishers', () => {
  const requiredIds = [
    'wto-work-programme-electronic-commerce-1998',
    'wto-agreement-electronic-commerce-2024',
    'china-data-security-law-2021',
    'eu-artificial-intelligence-act-2024',
    'un-governing-ai-humanity-2024',
    'krasner-structural-causes-regime-consequences-1982',
    'goldstein-kahler-keohane-slaughter-legalization-world-politics-2000',
    'keohane-after-hegemony-1984',
    'steinberg-shadow-law-power-gatt-wto-2002',
    'bradford-brussels-effect-2020',
  ];

  for (const recordId of requiredIds) {
    const record = records.find((item) => item.id === recordId);
    assert.ok(record.authors?.length || record.publisher, `${recordId} has first-pass attribution`);
  }
});

test('records use valid structured source-link fields when present', () => {
  for (const record of records) {
    for (const sourceLink of record.sourceLinks) {
      if (sourceLink.linkType) {
        assert.ok(sourceLinkTypes.includes(sourceLink.linkType), `${record.id} uses valid source link type`);
      }

      if (sourceLink.authority) {
        assert.ok(sourceAuthorities.includes(sourceLink.authority), `${record.id} uses valid per-link authority`);
      }

      if (sourceLink.languageStatus) {
        assert.ok(languageStatuses.includes(sourceLink.languageStatus), `${record.id} uses valid per-link language status`);
      }

      if (sourceLink.note) {
        assert.ok(sourceLink.note.length >= 12, `${record.id} source note is descriptive`);
      }
    }
  }
});

test('first-pass dossier records expose structured source variants', () => {
  const requiredIds = [
    'wto-work-programme-electronic-commerce-1998',
    'china-data-security-law-2021',
    'eu-artificial-intelligence-act-2024',
    'un-governing-ai-humanity-2024',
  ];

  for (const recordId of requiredIds) {
    const record = records.find((item) => item.id === recordId);
    assert.ok(record, `${recordId} exists`);
    assert.ok(record.sourceLinks.some((link) => link.linkType), `${recordId} has typed source links`);
    assert.ok(record.sourceLinks.some((link) => link.note), `${recordId} has source notes`);
  }

  const chinaDsl = records.find((item) => item.id === 'china-data-security-law-2021');
  assert.ok(chinaDsl.sourceLinks.some((link) => link.languageStatus === 'official-original'));
  assert.ok(chinaDsl.sourceLinks.some((link) => link.languageStatus === 'official-english'));
});

test('theories topic has a deep rule-making shelf across literatures and practice materials', () => {
  const theoryRecords = records.filter((record) => record.topics.includes('theories-rulemaking'));
  const theoryRecordIds = new Set(theoryRecords.map((record) => record.id));
  const theoryRecordTypes = new Set(theoryRecords.map((record) => record.recordType));
  const expectedIds = [
    'ruggie-embedded-liberalism-postwar-order-1982',
    'ruggie-multilateralism-anatomy-institution-1992',
    'young-political-leadership-regime-formation-1991',
    'krasner-state-power-structure-international-trade-1976',
    'snidal-limits-hegemonic-stability-theory-1985',
    'kindleberger-dominance-leadership-international-economy-1981',
    'stein-hegemons-dilemma-1984',
    'lake-leadership-hegemony-international-economy-1993',
    'gilpin-war-change-world-politics-1981',
    'haas-introduction-epistemic-communities-1992',
    'haas-when-knowledge-is-power-1990',
    'tallberg-power-of-the-chair-2010',
    'gruber-ruling-the-world-2000',
    'steil-battle-bretton-woods-2013',
    'helleiner-forgotten-foundations-bretton-woods-2014',
    'pedersen-cooperative-hegemony-2002',
    'damro-market-power-europe-2012',
    'manners-normative-power-europe-2002',
    'meunier-nicolaidis-conflicted-trade-power-2006',
    'bradford-brussels-effect-2020',
    'ikenberry-liberal-leviathan-2011',
    'hasenclever-mayer-rittberger-theories-international-regimes-1997',
    'steinberg-trade-environment-negotiations-eu-nafta-wto-1997',
    'steinberg-great-power-management-world-trading-system-1998',
    'steinberg-shadow-law-power-gatt-wto-2002',
    'steinberg-judicial-lawmaking-wto-2004',
    'steinberg-zasloff-power-international-law-2006',
    'goldstein-steinberg-negotiate-litigate-wto-2008',
    'goldstein-steinberg-regulatory-shift-wto-2009',
    'steinberg-hidden-world-wto-governance-reply-2009',
    'steinberg-wanted-dead-or-alive-realism-international-law-2013',
    'steinberg-international-trade-law-state-transformation-2013',
    'hudec-enforcing-international-trade-law-1993',
    'weiler-rule-of-lawyers-ethos-diplomats-wto-2001',
    'howse-nicolaidis-legitimacy-global-governance-wto-step-too-far-2001',
    'howse-politics-technocracy-back-multilateral-trading-regime-2002',
    'shaffer-parliamentary-oversight-wto-rulemaking-2004',
    'shaffer-power-governance-wto-comparative-institutional-approach-2005',
    'wto-future-of-wto-institutional-challenges-2005',
    'wolfe-decision-making-transparency-medieval-wto-2005',
    'jackson-wto-international-organization-key-problems-2006',
    'esty-good-governance-wto-administrative-law-2007',
    'lang-scott-hidden-world-wto-governance-2009',
    'steger-future-of-wto-institutional-reform-2009',
    'stewart-badin-wto-global-administrative-law-2011',
    'lang-world-trade-law-after-neoliberalism-2011',
    'shaffer-how-wto-shapes-regulatory-governance-2015',
    'raustiala-form-substance-international-agreements-2005',
    'raustiala-architecture-international-cooperation-2002',
    'keohane-nye-transgovernmental-relations-1974',
    'franck-power-legitimacy-among-nations-1990',
    'bodansky-concept-legitimacy-international-law-2008',
    'brunnee-toope-legitimacy-legality-international-law-2010',
    'kingsbury-krisch-stewart-emergence-global-administrative-law-2005',
    'rosenau-governance-order-change-world-politics-1992',
    'slaughter-real-new-world-order-1997',
    'finkelstein-what-is-global-governance-1995',
    'avant-finnemore-sell-who-governs-the-globe-2010',
    'chayes-chayes-new-sovereignty-1995',
    'pauwelyn-wessel-wouters-informal-international-lawmaking-2012',
    'pauwelyn-wessel-wouters-introduction-informal-international-lawmaking-2012',
    'abbott-snidal-governance-triangle-2009',
    'alter-meunier-international-regime-complexity-2009',
    'alter-raustiala-rise-international-regime-complexity-2018',
    'black-polycentric-regulatory-regimes-legitimacy-accountability-2008',
    'alvarez-international-organizations-law-makers-2006',
    'emergence-private-authority-global-governance-2002',
    'biersteker-hall-private-authority-global-governance-2002',
    'abbott-genschel-snidal-zangl-orchestration-global-governance-2012',
    'abbott-snidal-law-legalization-politics-2012',
    'finnemore-toope-alternatives-legalization-2001',
    'biermann-kanie-kim-global-governance-goal-setting-2017',
    'lake-rightful-rules-global-governance-2010',
    'carnegie-rules-of-order-global-governance-2023',
    'cigi-institutional-collaboration-global-governance-2021',
    'chatham-house-inclusive-global-governance-2021',
  ];

  for (const expectedId of expectedIds) {
    assert.ok(theoryRecordIds.has(expectedId), `${expectedId} is linked to theories-rulemaking`);
  }

  assert.ok(theoryRecords.length >= 83, 'theories topic has at least eighty-three records');
  assert.ok(
    theoryRecords.filter((record) => ['academic-article', 'book-chapter'].includes(record.recordType)).length >= 78,
    'theories topic has at least seventy-eight literature records',
  );
  assert.ok(
    theoryRecords.filter((record) => ['think-tank', 'official-international-organization'].includes(record.sourceAuthority)).length >= 4,
    'theories topic includes at least four policy or institutional governance items',
  );
  assert.ok(theoryRecordTypes.has('academic-article'), 'theories topic includes journal articles');
  assert.ok(theoryRecordTypes.has('book-chapter'), 'theories topic includes books or chapters');
  assert.ok(theoryRecordTypes.has('research-report'), 'theories topic includes policy or think tank reports');
});

test('britain and imperial rule-making shelf has a substantive mixed historical corpus', () => {
  const expectedIds = [
    'navigation-acts-repeal-1849',
    'bank-charter-act-1844',
    'declaration-paris-maritime-law-1856',
    'cobden-chevalier-treaty-1860',
    'general-act-berlin-conference-1885',
    'bagehot-lombard-street-1873',
    'hall-treatise-international-law-1880',
    'oppenheim-international-law-1905',
    'gallagher-robinson-imperialism-free-trade-1953',
    'cain-hopkins-british-imperialism-1993',
    'darwin-empire-project-2009',
    'findlay-orourke-power-plenty-2007',
  ];
  const recordIds = new Set(records.map((record) => record.id));
  const britainShelf = records.filter((record) => record.topics.includes('britain-imperial-rulemaking'));
  const missingIds = expectedIds.filter((expectedId) => !recordIds.has(expectedId));
  const issues = [];

  if (missingIds.length > 0) {
    issues.push(`missing Britain records: ${missingIds.join(', ')}`);
  }

  if (britainShelf.length < 18) {
    issues.push(`britain shelf count is ${britainShelf.length}, expected at least 18`);
  }
  if (!britainShelf.some((record) => ['academic-article', 'book-chapter'].includes(record.recordType))) {
    issues.push('britain shelf is missing scholarship');
  }
  if (
    !britainShelf.some((record) =>
      ['treaty-agreement', 'national-law-policy', 'institutional-document'].includes(record.recordType),
    )
  ) {
    issues.push('britain shelf is missing primary or official historical materials');
  }
  if (!britainShelf.some((record) => record.topics.includes('great-powers'))) {
    issues.push('britain shelf is missing great-powers propagation');
  }
  if (!britainShelf.some((record) => record.topics.includes('monetary-financial-regulation'))) {
    issues.push('britain shelf is missing monetary-financial-regulation propagation');
  }

  assert.equal(issues.length, 0, issues.join('; '));
});

test('applied topic shelves beyond theory have broader documentary and literature coverage', () => {
  const recordIds = new Set(records.map((record) => record.id));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );
  const expectedIds = [
    'china-wto-reform-proposal-2019',
    'china-foreign-investment-law-2019',
    'china-export-control-law-2020',
    'aiib-articles-of-agreement-2015',
    'brics-new-development-bank-agreement-2014',
    'cmim-agreement-2010',
    'amro-agreement-2016',
    'unctad-investment-policy-framework-sustainable-development-2015',
    'mauritius-convention-transparency-2014',
    'us-model-bit-2012',
    'schill-multilateralization-investment-law-2009',
    'bonnitcha-poulsen-waibel-political-economy-investment-treaty-regime-2017',
    'dodd-frank-act-2010',
    'eu-us-data-privacy-framework-2023',
    'european-digital-rights-principles-2022',
    'ottawa-group-wto-reform-2019',
    'global-cbpr-declaration-2022',
    'asean-defa-leaders-statement-2023',
    'unesco-recommendation-ethics-ai-2021',
    'un-governing-ai-humanity-2024',
    'seoul-declaration-ai-2024',
  ];

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(byTopic.china.length >= 13, 'china topic has at least thirteen records');
  assert.ok(new Set(byTopic.china.map((record) => record.recordType)).size >= 4, 'china topic spans at least four material types');
  assert.ok(byTopic['international-investment'].length >= 13, 'international investment has at least thirteen records');
  assert.ok(
    byTopic['international-investment'].some((record) => ['academic-article', 'book-chapter'].includes(record.recordType)),
    'international investment includes literature',
  );
  assert.ok(byTopic['united-states'].length >= 12, 'united states topic has at least twelve records');
  assert.ok(byTopic['monetary-financial-regulation'].length >= 15, 'money and finance topic has at least fifteen records');
  assert.ok(byTopic['middle-small-powers'].length >= 17, 'middle and small powers topic has at least seventeen records');
  assert.ok(byTopic['ai-governance'].length >= 15, 'ai governance topic has at least fifteen records');
  assert.ok(
    byTopic['ai-governance'].some((record) => record.recordType === 'research-report'),
    'ai governance includes report-style governance materials',
  );
  assert.ok(byTopic['european-union'].length >= 17, 'european union topic has at least seventeen records');
  assert.ok(byTopic['cyber-data-governance'].length >= 24, 'cyber and data governance topic has at least twenty-four records');
});

test('thin-topic balance batch raises the weaker shelves with mixed-source additions', () => {
  const unitedStatesIds = [
    'us-national-cybersecurity-strategy-2023',
    'declaration-future-internet-2022',
    'us-ai-bill-of-rights-2022',
    'political-declaration-responsible-military-ai-autonomy-2023',
    'goldsmith-wu-who-controls-internet-2006',
  ];
  const chinaIds = [
    'xi-high-level-dialogue-global-development-2022',
    'gdi-concept-note-2022',
    'vision-actions-belt-road-2015',
    'china-anti-foreign-sanctions-law-2021',
    'third-belt-road-forum-chairs-statement-2023',
  ];
  const investmentIds = [
    'uncitral-code-conduct-adjudicators-isds-2023',
    'world-bank-global-investment-competitiveness-report-2019-2020',
    'world-bank-global-investment-competitiveness-report-2017-2018',
    'unctad-investment-facilitation-iias-trends-policy-options-2023',
    'unctad-facilitating-investment-sdgs-2022',
  ];
  const financeIds = [
    'toward-integrated-policy-framework-2020',
    'fsb-global-stablecoin-high-level-recommendations-2023',
    'g20-common-framework-debt-treatments-2020',
    'enhancing-cross-border-payments-roadmap-2020',
    'tooze-crashed-decade-financial-crises-2018',
  ];
  const aiIds = [
    'oecd-framework-classification-ai-systems-2022',
    'un-ai-advisory-body-interim-report-2023',
    'unesco-ai-readiness-assessment-methodology-2023',
  ];

  const expectedIds = [...unitedStatesIds, ...chinaIds, ...investmentIds, ...financeIds, ...aiIds];
  const recordById = new Map(records.map((record) => [record.id, record]));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordById.has(expectedId), `${expectedId} exists`);
  }

  for (const recordId of unitedStatesIds) {
    const record = recordById.get(recordId);
    assert.ok(record, `${recordId} exists`);
    assert.ok(record.topics.includes('united-states'), `${recordId} is linked to united-states`);
  }

  for (const recordId of chinaIds) {
    const record = recordById.get(recordId);
    assert.ok(record, `${recordId} exists`);
    assert.ok(record.topics.includes('china'), `${recordId} is linked to china`);
  }

  for (const recordId of investmentIds) {
    const record = recordById.get(recordId);
    assert.ok(record, `${recordId} exists`);
    assert.ok(record.topics.includes('international-investment'), `${recordId} is linked to international-investment`);
  }

  for (const recordId of financeIds) {
    const record = recordById.get(recordId);
    assert.ok(record, `${recordId} exists`);
    assert.ok(
      record.topics.includes('monetary-financial-regulation'),
      `${recordId} is linked to monetary-financial-regulation`,
    );
  }

  for (const recordId of aiIds) {
    const record = recordById.get(recordId);
    assert.ok(record, `${recordId} exists`);
    assert.ok(record.topics.includes('ai-governance'), `${recordId} is linked to ai-governance`);
  }

  assert.ok(byTopic['united-states'].length >= 18, 'united states topic has at least eighteen records');
  assert.ok(byTopic.china.length >= 19, 'china topic has at least nineteen records');
  assert.ok(
    byTopic['international-investment'].length >= 18,
    'international investment topic has at least eighteen records',
  );
  assert.ok(
    byTopic['monetary-financial-regulation'].length >= 20,
    'money and finance topic has at least twenty records',
  );
  assert.ok(byTopic['ai-governance'].length >= 20, 'ai governance topic has at least twenty records');

  assert.ok(
    byTopic['united-states'].some((record) => ['academic-article', 'book-chapter'].includes(record.recordType)),
    'united states shelf includes literature',
  );
  assert.ok(
    byTopic.china.some((record) => ['official-statement', 'research-report'].includes(record.recordType)),
    'china shelf includes statements or report-style materials',
  );
  assert.ok(
    byTopic['international-investment'].some((record) => record.recordType === 'research-report'),
    'international investment includes report-style reform materials',
  );
  assert.ok(
    byTopic['monetary-financial-regulation'].some((record) => record.recordType === 'official-statement'),
    'money and finance includes official statements',
  );
  assert.ok(
    byTopic['ai-governance'].some((record) =>
      ['academic-article', 'book-chapter', 'research-report'].includes(record.recordType),
    ),
    'ai governance includes literature or report-style governance materials',
  );
});

test('fifth content batch deepens the US, EU, and China comparison shelves', () => {
  const unitedStatesIds = [
    'us-eu-trade-technology-council-inaugural-joint-statement-2021',
    'us-national-security-strategy-2022',
    'cloud-act-2018',
    'executive-order-14086-signals-intelligence-2022',
  ];
  const europeIds = [
    'european-strategy-data-2020',
    'eu-white-paper-artificial-intelligence-2020',
    'eu-data-governance-act-2022',
  ];
  const chinaIds = [
    'china-global-initiative-data-security-2020',
    'china-international-strategy-cooperation-cyberspace-2017',
    'china-national-standardization-development-outline-2021',
    'china-outbound-data-transfer-security-assessment-measures-2022',
  ];
  const expectedIds = [...unitedStatesIds, ...europeIds, ...chinaIds];
  const recordById = new Map(records.map((record) => [record.id, record]));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordById.has(expectedId), `${expectedId} exists`);
  }

  for (const recordId of unitedStatesIds) {
    const record = recordById.get(recordId);
    assert.ok(record.topics.includes('united-states'), `${recordId} is linked to united-states`);
  }

  for (const recordId of europeIds) {
    const record = recordById.get(recordId);
    assert.ok(record.topics.includes('european-union'), `${recordId} is linked to european-union`);
  }

  for (const recordId of chinaIds) {
    const record = recordById.get(recordId);
    assert.ok(record.topics.includes('china'), `${recordId} is linked to china`);
  }

  assert.ok(byTopic['united-states'].length >= 22, 'united states topic has at least twenty-two records');
  assert.ok(byTopic['european-union'].length >= 20, 'european union topic has at least twenty records');
  assert.ok(byTopic.china.length >= 23, 'china topic has at least twenty-three records');
  assert.ok(
    byTopic['european-union'].some((record) => record.topics.includes('cyber-data-governance')),
    'european union shelf intersects with cyber and data governance',
  );
  assert.ok(
    byTopic.china.some((record) => record.topics.includes('cyber-data-governance')),
    'china shelf intersects with cyber and data governance',
  );
});

test('US, EU, and AI rebalance batch deepens the remaining thin shelves', () => {
  const unitedStatesIds = [
    'us-ai-action-plan-2025',
    'us-executive-order-14179-ai-leadership-2025',
    'us-national-standards-strategy-cet-2023',
    'us-outbound-investment-final-rule-2024',
    'us-bis-advanced-computing-export-controls-2022',
  ];
  const europeIds = [
    'eu-economic-security-strategy-2023',
    'eu-anti-coercion-instrument-2023',
    'eu-carbon-border-adjustment-mechanism-2023',
    'eu-critical-raw-materials-act-2024',
    'eu-standardisation-strategy-2022',
  ];
  const aiGovernanceIds = [
    'iso-iec-42001-ai-management-system-2023',
    'international-ai-safety-report-2025',
    'international-network-ai-safety-institutes-2024',
    'paris-ai-action-summit-statement-2025',
    'smuha-race-ai-regulation-2021',
    'veale-borgesius-demystifying-eu-ai-act-2021',
  ];
  const expectedIds = [...unitedStatesIds, ...europeIds, ...aiGovernanceIds];
  const recordById = new Map(records.map((record) => [record.id, record]));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );
  const expectedAuthorityMix = new Set([
    'official-government',
    'official-international-organization',
    'academic-publisher',
  ]);

  for (const expectedId of expectedIds) {
    assert.ok(recordById.has(expectedId), `${expectedId} exists`);
  }

  for (const recordId of unitedStatesIds) {
    assert.ok(recordById.get(recordId).topics.includes('united-states'), `${recordId} is linked to united-states`);
  }

  for (const recordId of europeIds) {
    assert.ok(recordById.get(recordId).topics.includes('european-union'), `${recordId} is linked to european-union`);
  }

  for (const recordId of aiGovernanceIds) {
    assert.ok(recordById.get(recordId).topics.includes('ai-governance'), `${recordId} is linked to ai-governance`);
  }

  assert.ok(byTopic['united-states'].length >= 27, 'united states topic has at least twenty-seven records');
  assert.ok(byTopic['european-union'].length >= 27, 'european union topic has at least twenty-seven records');
  assert.ok(byTopic['ai-governance'].length >= 31, 'ai governance topic has at least thirty-one records');
  assert.ok(
    [...expectedAuthorityMix].every((authority) =>
      expectedIds.some((recordId) => recordById.get(recordId).sourceAuthority === authority),
    ),
    'rebalance batch includes official, intergovernmental, and academic sources',
  );
  assert.ok(
    byTopic['ai-governance'].filter((record) => ['academic-article', 'research-report'].includes(record.recordType))
      .length >= 5,
    'ai governance includes a deeper scholarship and report shelf',
  );
});

test('china institutional-practice batch materially deepens the China shelf', () => {
  const expectedIds = [
    'wto-trade-policy-review-china-secretariat-report-2024',
    'wto-trade-policy-review-china-government-report-2024',
    'wto-china-round-table-accessions-2026',
    'wto-investment-facilitation-workshop-2017',
    'china-welcomes-wto-ecommerce-interim-arrangements-2026',
    'imfc-statement-pan-gongsheng-2024',
    'imfc-statement-pan-gongsheng-2026',
    'world-bank-china-country-partnership-framework-2020-2025',
    'china-wbg-global-center-ecological-systems-transitions-2024',
    'aiib-corporate-strategy-2021-2030',
    'ndb-general-strategy-2022-2026',
    'global-development-initiative-building-on-2030-sdgs-2021',
    'group-friends-global-development-initiative-launch-2022',
    'gdi-ministerial-meeting-un-desa-statement-2022',
    'un-china-sustainable-development-cooperation-framework-2021-2025',
    'unctad-invest-china-building-prosperous-future-2023',
    'g20-hangzhou-communique-2016',
    'apec-beijing-agenda-2014',
    'apec-accord-innovative-development-economic-reform-growth-2014',
    'brics-xiamen-declaration-2017',
    'brics-beijing-declaration-2022',
    'bri-debt-sustainability-framework-participating-countries-2019',
    'bri-debt-sustainability-framework-market-access-countries-2023',
    'second-belt-road-forum-joint-communique-2019',
    'beijing-initiative-belt-road-green-development-2023',
    'beijing-declaration-belt-road-ceo-conference-2023',
  ];

  const recordIds = new Set(records.map((record) => record.id));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(byTopic.china.length >= 45, 'china topic has at least forty-five records');
  assert.ok(
    new Set(byTopic.china.map((record) => record.recordType)).size >= 6,
    'china topic spans at least six material types',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('wto')),
    'china topic includes WTO-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('imf')),
    'china topic includes IMF-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('world-bank')),
    'china topic includes World Bank-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('g20')),
    'china topic includes G20-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('apec')),
    'china topic includes APEC-linked records',
  );
});

test('second China official-source batch adds participation, proposal, and performance materials', () => {
  const expectedIds = [
    'china-mc12-statement-wto-reform-2022',
    'australia-china-thailand-small-steps-wto-reform-2023',
    'china-cosponsors-wto-ecommerce-annex4-request-2025',
    'china-funded-wto-digital-trade-workshop-ldcs-2024',
    'imf-china-2025-article-iv-consultation-2026',
    'imf-china-2023-article-iv-executive-board-2024',
    'world-bank-china-country-climate-development-report-2022',
    'china-world-bank-kcp-contribution-2026',
    'china-wbg-global-center-collaboration-space-2026',
    'china-hosts-aiib-annual-meeting-2025',
    'aiib-annual-meeting-beijing-2025',
    'ndb-bank-huzhou-sustainable-infrastructure-china-2024',
    'ndb-bank-china-haitong-green-projects-china-2025',
    'china-apec-digitalization-green-transitions-fund-2024',
    'unctad-china-investment-fair-opening-2025',
    'xi-16th-brics-summit-statement-2024',
    'brics-kazan-declaration-2024',
  ];
  const recordIds = new Set(records.map((record) => record.id));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(byTopic.china.length >= 60, 'china topic has at least sixty records');
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('aiib')),
    'china topic includes AIIB-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('new-development-bank')),
    'china topic includes NDB-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('unctad')),
    'china topic includes UNCTAD-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('brics')),
    'china topic includes BRICS-linked records',
  );
  assert.ok(
    byTopic.china.filter((record) => record.year >= 2024).length >= 20,
    'china topic includes a substantial current-practice shelf from 2024 onward',
  );
});

test('third China official-source batch deepens G20, ASEAN, and UN AI governance links', () => {
  const expectedIds = [
    'g20-digital-economy-development-cooperation-initiative-2016',
    'g20-strategy-global-trade-growth-2016',
    'g20-guiding-principles-global-investment-policymaking-2016',
    'asean-china-digital-ecosystem-joint-statement-2024',
    'acfta-3-upgrade-protocol-2025',
    'china-ai-capacity-building-action-plan-good-for-all-2024',
    'china-global-ai-governance-action-plan-2025',
  ];
  const recordIds = new Set(records.map((record) => record.id));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(byTopic.china.length >= 73, 'china topic has at least seventy-three records');
  assert.ok(byTopic['digital-trade-ecommerce'].length >= 32, 'digital trade topic has at least thirty-two records');
  assert.ok(
    byTopic['international-investment'].length >= 36,
    'international investment topic has at least thirty-six records',
  );
  assert.ok(byTopic['ai-governance'].length >= 23, 'ai governance topic has at least twenty-three records');
  assert.ok(
    byTopic.china.filter((record) => record.institutions.includes('g20')).length >= 4,
    'china topic includes a deeper G20-linked shelf',
  );
  assert.ok(
    byTopic.china.filter((record) => record.institutions.includes('asean')).length >= 3,
    'china topic includes a deeper ASEAN-linked shelf',
  );
  assert.ok(
    byTopic.china.filter((record) => record.institutions.includes('un')).length >= 6,
    'china topic includes a deeper UN-linked shelf',
  );
  assert.ok(
    byTopic.china.filter((record) => record.topics.includes('ai-governance')).length >= 4,
    'china topic includes a thicker AI-governance shelf',
  );
});

test('China scholarship batch adds a broad academic shelf across trade, investment, governance, and technology', () => {
  const expectedIds = [
    'hopewell-rise-brazil-india-china-wto-2014',
    'breslin-embedded-socialist-compromise-wto-2003',
    'qin-wto-plus-obligations-china-accession-2003',
    'zhou-gao-bai-wto-inspired-soe-reform-2019',
    'bishop-zhang-reluctant-leader-wto-2019',
    'scott-china-threat-evidence-wto-2013',
    'antkiewicz-whalley-china-regional-trade-agreements-2005',
    'pearson-china-geneva-early-years-wto-2006',
    'kong-chinese-approach-practice-bits-2003',
    'cai-china-us-bit-negotiations-2009',
    'cohen-schneiderman-chinese-bit-policy-2017',
    'blanchard-zeng-global-economic-governance-bits-2020',
    'gu-humphrey-messner-rise-china-global-governance-2007',
    'chin-thakur-change-rules-global-order-2010',
    'hameiri-jones-china-challenges-global-governance-aiib-2018',
    'wu-remaking-bretton-woods-aiib-2018',
    'hooijmaaijers-brics-limitations-global-economic-governance-2019',
    'zeng-chinese-views-global-economic-governance-2019',
    'ji-lim-chinese-way-reforming-global-economic-governance-g20-2021',
    'hearson-prichard-china-tax-rules-global-governance-2018',
    'creemers-cyber-sovereignty-rhetoric-realization-2020',
    'hong-goodnight-think-about-cyber-sovereignty-china-2019',
    'borgogno-zangrandi-data-governance-trade-policy-2024',
    'cheng-zeng-china-global-ai-governance-2022',
    'roberts-moraes-ferguson-geoeconomic-order-2019',
  ];
  const recordIds = new Set(records.map((record) => record.id));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(byTopic.china.length >= 95, 'china topic has at least ninety-five records');
  assert.ok(
    byTopic.china.filter((record) => record.recordType === 'academic-article').length >= 20,
    'china topic includes a deep academic-article shelf',
  );
  assert.ok(
    byTopic.china.filter((record) => record.recordType === 'book-chapter').length >= 2,
    'china topic includes book or chapter coverage',
  );
  assert.ok(
    byTopic['wto-reform'].some((record) => record.id === 'hopewell-rise-brazil-india-china-wto-2014'),
    'wto reform topic includes the new China scholarship shelf',
  );
  assert.ok(
    byTopic['international-investment'].some((record) => record.id === 'cai-china-us-bit-negotiations-2009'),
    'international investment topic includes the new China treaty literature',
  );
  assert.ok(
    byTopic['monetary-financial-regulation'].some(
      (record) => record.id === 'hameiri-jones-china-challenges-global-governance-aiib-2018',
    ),
    'money and finance topic includes China governance scholarship',
  );
  assert.ok(
    byTopic['cyber-data-governance'].some(
      (record) => record.id === 'borgogno-zangrandi-data-governance-trade-policy-2024',
    ),
    'cyber and data topic includes new China scholarship',
  );
  assert.ok(
    byTopic['ai-governance'].some((record) => record.id === 'cheng-zeng-china-global-ai-governance-2022'),
    'AI governance topic includes new China scholarship',
  );
});

test('standards, data, and AI governance batch adds current official materials across key shelves', () => {
  const expectedIds = [
    'un-global-digital-compact-2024',
    'oecd-ai-principles-revised-2024',
    'asean-expanded-guide-generative-ai-2025',
    'china-cross-border-data-flow-provisions-2024',
    'china-global-cross-border-data-flow-cooperation-initiative-2024',
    'china-shanghai-declaration-global-ai-governance-2024',
    'china-network-data-security-management-regulations-2024',
    'nist-cybersecurity-framework-2-2024',
    'eu-cyber-resilience-act-2024',
    'ipef-supply-chain-agreement-2023',
    'eu-chips-act-2023',
  ];
  const recordById = new Map(records.map((record) => [record.id, record]));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordById.has(expectedId), `${expectedId} exists`);
    assert.ok(recordById.get(expectedId).dimensions.length >= 1, `${expectedId} has analytical dimensions`);
  }

  assert.ok(byTopic.china.length >= 103, 'china topic has at least one hundred and three records');
  assert.ok(byTopic['digital-trade-ecommerce'].length >= 58, 'digital trade topic has at least fifty-eight records');
  assert.ok(byTopic['cyber-data-governance'].length >= 53, 'cyber and data topic has at least fifty-three records');
  assert.ok(byTopic['ai-governance'].length >= 41, 'ai governance topic has at least forty-one records');
  assert.ok(byTopic['united-states'].length >= 30, 'united states topic has at least thirty records');
  assert.ok(byTopic['european-union'].length >= 33, 'european union topic has at least thirty-three records');
  assert.ok(byTopic['middle-small-powers'].length >= 66, 'middle and small powers topic has at least sixty-six records');
  assert.ok(
    byTopic.china.filter((record) => record.year >= 2024).length >= 31,
    'china topic includes a thicker current official-practice shelf',
  );
  assert.ok(
    expectedIds.every((id) => recordById.get(id).sourceLinks.some((sourceLink) => sourceLink.url.startsWith('https://'))),
    'new batch records use HTTPS source links',
  );
  assert.ok(
    expectedIds.some((id) => recordById.get(id).sourceAuthority === 'official-international-organization'),
    'new batch includes intergovernmental sources',
  );
  assert.ok(
    expectedIds.some((id) => recordById.get(id).sourceAuthority === 'official-government'),
    'new batch includes government sources',
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

  assert.ok(
    queryResults.some((record) => record.id === 'usmca-digital-trade-chapter-2020'),
    'source code query finds the USMCA record',
  );
  assert.ok(
    queryResults.every((record) => recordSearchText(record).includes('source code')),
    'source code query only returns records whose searchable text contains both terms',
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

test('search helpers include authors and publishers in query text', () => {
  assert.ok(
    filterRecords(records, { query: 'Steinberg' }).some(
      (record) => record.id === 'steinberg-shadow-law-power-gatt-wto-2002',
    ),
    'Steinberg query finds the structured-attribution record',
  );
  assert.ok(
    filterRecords(records, { query: 'Oxford University Press' }).some(
      (record) => record.id === 'bradford-brussels-effect-2020',
    ),
    'publisher query finds the Bradford record',
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
  assert.equal(formatDate('2020-06'), 'Jun 2020');
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
