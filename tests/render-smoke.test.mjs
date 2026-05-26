import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderActorDetail } from '../src/views/actors.js';
import { renderHome } from '../src/views/home.js';
import { renderDimensionDetail, renderDimensions } from '../src/views/dimensions.js';
import { renderInstitutionDetail } from '../src/views/institutions.js';
import { renderTopicDetail, renderTopics } from '../src/views/topics.js';
import { renderTimelinePage } from '../src/views/timeline.js';
import { renderSourcesMethod } from '../src/views/sources.js';
import { renderDatabase, renderRecordDetail } from '../src/views/database.js';
import { records } from '../src/data/records.js?v=20260526k';

test('index renders the static app mount and asset links', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<main\s+id="app"/);
  assert.match(html, /href="\.\/src\/styles\.css\?v=20260526k"/);
  assert.match(html, /src="\.\/src\/main\.js\?v=20260526k"/);
  assert.match(html, /Great Powers and Rule-Making/);
  assert.match(html, /class="site-footer"/);
  assert.match(html, /This website was created with Codex by Professor Wang Jiangyu of CityUHK\./);
  assert.doesNotMatch(html, /class="site-header-attribution"/);
});

test('public module graph cache-busts route and records modules', async () => {
  const mainJs = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const viewFiles = [
    '../src/views/actors.js',
    '../src/views/database.js',
    '../src/views/dimensions.js',
    '../src/views/home.js',
    '../src/views/institutions.js',
    '../src/views/timeline.js',
    '../src/views/topics.js',
  ];

  for (const view of ['actors', 'database', 'dimensions', 'home', 'institutions', 'timeline', 'topics']) {
    assert.match(mainJs, new RegExp(`\\.\\/views\\/${view}\\.js\\?v=20260526k`), `${view} view import is cache-busted`);
  }

  for (const viewFile of viewFiles) {
    const viewJs = await readFile(new URL(viewFile, import.meta.url), 'utf8');
    assert.match(viewJs, /\.\.\/data\/records\.js\?v=20260526k/, `${viewFile} records import is cache-busted`);
  }
});

test('view renderers include core portal sections', () => {
  assert.match(renderDimensions(), /Rule-Making Dimensions/);
  assert.match(renderDimensionDetail('agenda-setting'), /Agenda-Setting/);
  assert.match(renderHome(), /Digital Trade/);
  assert.match(renderHome(), /Browse by dimension/);
  assert.match(renderHome(), /class="home-attribution"/);
  assert.match(renderHome(), /This website was created with Codex by Professor Wang Jiangyu of CityUHK\./);
  assert.match(renderTopics(), /Research Topics/);
  assert.match(renderDatabase(), /Rule-Making Records/);
  assert.match(renderSourcesMethod(), /Analytical dimensions/);
});

test('home and topic pages expose entry points into the full timeline view', () => {
  assert.match(renderHome(), /#\/timeline/);
  assert.match(renderTopicDetail('digital-trade-ecommerce'), /#\/timeline\?topic=digital-trade-ecommerce/);
});

test('database renderer includes jurisdiction and date filter controls', () => {
  const html = renderDatabase();

  assert.match(html, /name="dimension"/);
  assert.match(html, /name="jurisdiction"/);
  assert.match(html, /name="dateFrom"/);
  assert.match(html, /name="dateTo"/);
  assert.match(html, /name="year"/);
});

test('stylesheet includes database interface selectors', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.filters\b/);
  assert.match(css, /\.record-row\b/);
  assert.match(css, /\.timeline-list\b/);
  assert.match(css, /\.topic-stat-grid\b/);
  assert.match(css, /\.topic-type-chip\b/);
  assert.match(css, /overflow-wrap\s*:/);
});

test('database renderer escapes unsafe query text', () => {
  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/database?q=<script>' };

  try {
    const html = renderDatabase();

    assert.doesNotMatch(html, /value="<script>"/);
    assert.doesNotMatch(html, /<script>/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('record detail renders unsafe source URLs as plain text', () => {
  const unsafeRecord = {
    id: 'unsafe-source-url-regression',
    title: 'Unsafe Source URL Regression',
    recordType: 'official-statement',
    date: '2026-01-01',
    year: 2026,
    actors: [],
    jurisdictions: [],
    institutions: [],
    topics: [],
    dimensions: ['legitimacy-management'],
    summary: 'A regression fixture for unsafe source URL rendering.',
    sourceAuthority: 'official-government',
    languageStatus: 'official-english',
    sourceLinks: [
      {
        label: 'Unsafe Source',
        url: 'javascript:alert(1)',
      },
    ],
    citation: 'Unsafe source URL regression fixture.',
    relatedRecordIds: [],
    tags: [],
  };

  records.push(unsafeRecord);

  try {
    const html = renderRecordDetail(unsafeRecord.id);

    assert.doesNotMatch(html, /href="javascript:alert\(1\)"/);
    assert.match(html, /Unsafe Source/);
    assert.match(html, /\(invalid source URL\)/);
  } finally {
    records.pop();
  }
});

test('record detail renders dimensions metadata for existing records', () => {
  const html = renderRecordDetail('wto-joint-statement-electronic-commerce-2019');

  assert.match(html, /Dimensions/);
});

test('record detail renders attribution metadata when present', () => {
  const html = renderRecordDetail('un-governing-ai-humanity-2024');

  assert.match(html, /United Nations High-Level Advisory Body on Artificial Intelligence/);
  assert.match(html, /Publisher/);
  assert.match(html, /United Nations/);
});

test('record detail omits authors row when only publisher is present', () => {
  const html = renderRecordDetail('wto-agreement-electronic-commerce-2024');

  assert.match(html, /World Trade Organization/);
  assert.match(html, /Publisher/);
  assert.doesNotMatch(html, /<dt>Authors<\/dt>/);
});

test('database list renderer shows compact attribution lines', () => {
  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/database?topic=ai-governance' };

  try {
    const html = renderDatabase();

    assert.match(html, /United Nations High-Level Advisory Body on Artificial Intelligence \| United Nations/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('record detail renders grouped source dossier blocks', () => {
  const fixtureRecord = {
    id: 'source-dossier-fixture',
    title: 'Source Dossier Fixture',
    recordType: 'institutional-document',
    date: '2024-01-01',
    year: 2024,
    actors: [],
    jurisdictions: ['Global'],
    institutions: ['wto'],
    topics: ['wto-reform'],
    dimensions: ['agenda-setting'],
    summary: 'Fixture record for grouped source-dossier rendering.',
    sourceAuthority: 'official-international-organization',
    languageStatus: 'official-english',
    sourceLinks: [
      {
        label: 'Official text PDF',
        url: 'https://example.com/text.pdf',
        linkType: 'pdf',
        note: 'Controlling text.',
      },
      {
        label: 'Repository page',
        url: 'https://example.com/page',
        linkType: 'official-page',
        note: 'Repository landing page.',
      },
      {
        label: 'Think-tank commentary',
        url: 'https://example.com/commentary',
        linkType: 'commentary',
        authority: 'think-tank',
        note: 'Secondary context.',
      },
    ],
    citation: 'Source Dossier Fixture.',
    relatedRecordIds: [],
    tags: [],
  };

  records.push(fixtureRecord);

  try {
    const html = renderRecordDetail(fixtureRecord.id);
    assert.match(html, /Source dossier/);
    assert.match(html, /Controlling or primary text/);
    assert.match(html, /Official versions and document pages/);
    assert.match(html, /Secondary or contextual links/);
    assert.match(html, /Controlling text\./);
    assert.ok(html.indexOf('Official text PDF') < html.indexOf('Think-tank commentary'));
  } finally {
    records.pop();
  }
});

test('actor and institution detail pages summarize linked dimensions', () => {
  const actorHtml = renderActorDetail('china');
  const institutionHtml = renderInstitutionDetail('wto');

  assert.match(actorHtml, /Rule-making dimensions/);
  assert.match(actorHtml, /Agenda-Setting/);
  assert.match(actorHtml, /Norm Entrepreneurship and Drafting Power/);
  assert.match(institutionHtml, /Rule-making dimensions/);
  assert.match(institutionHtml, /Legitimacy Management/);
  assert.match(institutionHtml, /Agenda-Setting/);
});

test('thin-topic pages surface the new balance-first materials', () => {
  const unitedStatesHtml = renderTopicDetail('united-states');
  const investmentHtml = renderTopicDetail('international-investment');
  const aiHtml = renderTopicDetail('ai-governance');

  assert.match(unitedStatesHtml, /National Cybersecurity Strategy/);
  assert.match(unitedStatesHtml, /Who Controls the Internet/);
  assert.match(investmentHtml, /Code of Conduct for Adjudicators in International Investment Disputes/);
  assert.match(aiHtml, /OECD Framework for the Classification of AI Systems/);
});

test('new batch records propagate to actor and institution pages', () => {
  const actorHtml = renderActorDetail('united-states');
  const institutionHtml = renderInstitutionDetail('imf');

  assert.match(actorHtml, /Declaration for the Future of the Internet/);
  assert.match(institutionHtml, /Integrated Policy Framework/);
});

test('china-linked records are promoted on mixed topic and institution pages', () => {
  const chinaTopicHtml = renderTopicDetail('china');
  const wtoHtml = renderTopicDetail('wto-reform');
  const worldBankHtml = renderInstitutionDetail('world-bank');

  assert.match(chinaTopicHtml, /China and International Rule-Making/);
  assert.match(wtoHtml, /China in this topic/);
  assert.match(worldBankHtml, /China in this institution/);
  assert.match(wtoHtml, /Trade Policy Review: China 2024/);
  assert.match(worldBankHtml, /Country Partnership Framework for China/);
  assert.ok(wtoHtml.indexOf('Trade Policy Review: China 2024') < wtoHtml.indexOf('Ottawa Group and WTO Reform'));
});

test('second China batch propagates to WTO, AIIB, and APEC entry pages', () => {
  const chinaHtml = renderTopicDetail('china');
  const aiibHtml = renderInstitutionDetail('aiib');
  const apecHtml = renderInstitutionDetail('apec');

  assert.match(chinaHtml, /People&#39;s Republic of China: 2025 Article IV Consultation/);
  assert.match(chinaHtml, /China Deepens Partnership with the World Bank&#39;s Knowledge for Change Program/);
  assert.match(aiibHtml, /2025 AIIB Annual Meeting/);
  assert.match(apecHtml, /China Contributes Funding to Promote Digitalization for Green Transitions/);
});

test('third China batch propagates to G20, ASEAN, and AI-governance entry pages', () => {
  const chinaHtml = renderTopicDetail('china');
  const g20Html = renderInstitutionDetail('g20');
  const aseanHtml = renderInstitutionDetail('asean');
  const aiHtml = renderTopicDetail('ai-governance');

  assert.match(chinaHtml, /Global AI Governance Action Plan/);
  assert.match(g20Html, /China in this institution/);
  assert.match(g20Html, /G20 Strategy for Global Trade Growth/);
  assert.match(g20Html, /G20 Guiding Principles for Global Investment Policymaking/);
  assert.match(aseanHtml, /China in this institution/);
  assert.match(aseanHtml, /ASEAN-China Joint Statement on Facilitating Cooperation in Building a Sustainable and Inclusive Digital Ecosystem/);
  assert.match(aseanHtml, /ACFTA 3\.0 Upgrade Protocol/);
  assert.match(aiHtml, /China in this topic/);
  assert.match(aiHtml, /Artificial Intelligence Capacity-Building Action Plan for Good and for All/);
  assert.match(aiHtml, /Global AI Governance Action Plan/);
  assert.ok(aiHtml.indexOf('Global AI Governance Action Plan') < aiHtml.indexOf('OECD AI Principles'));
});

test('China topic page groups linked records by current categories with divider lines', () => {
  const chinaHtml = renderTopicDetail('china');
  const wtoHtml = renderInstitutionDetail('wto');
  const aiibHtml = renderInstitutionDetail('aiib');
  const digitalHtml = renderTopicDetail('digital-trade-ecommerce');

  assert.match(chinaHtml, /grouped under the current category model/);
  assert.match(chinaHtml, /Official statements/);
  assert.match(chinaHtml, /Institutional documents/);
  assert.match(chinaHtml, /Research reports/);
  assert.match(chinaHtml, /Academic articles/);
  assert.match(chinaHtml, /Books and chapters/);
  assert.match(chinaHtml, /record-category-divider/);
  assert.match(chinaHtml, /Different Paths to Power: The Rise of Brazil, India and China at the World Trade Organization/);
  assert.match(chinaHtml, /Shaping AI&#39;s Future\? China in Global AI Governance/);
  assert.match(wtoHtml, /China in this institution/);
  assert.match(wtoHtml, /Different Paths to Power: The Rise of Brazil, India and China at the World Trade Organization/);
  assert.match(aiibHtml, /China challenges global governance\? Chinese international development finance and the AIIB/);
  assert.doesNotMatch(digitalHtml, /record-category-divider/);
});

test('actor detail pages expose topic distribution and the newest comparison materials', () => {
  const unitedStatesHtml = renderActorDetail('united-states');
  const europeHtml = renderTopicDetail('european-union');
  const chinaHtml = renderTopicDetail('china');

  assert.match(unitedStatesHtml, /Topic distribution/);
  assert.match(unitedStatesHtml, /United States and International Rule-Making \(\d+\)/);
  assert.match(unitedStatesHtml, /Cyber Governance and Global Data Governance \(\d+\)/);
  assert.match(unitedStatesHtml, /U\.S\.-EU Trade and Technology Council Inaugural Joint Statement/);
  assert.match(europeHtml, /A European Strategy for Data/);
  assert.match(europeHtml, /White Paper on Artificial Intelligence/);
  assert.match(chinaHtml, /Global Initiative on Data Security/);
  assert.match(chinaHtml, /National Standardization Development Outline/);
});

test('US, EU, and AI rebalance records propagate through topic and institution pages', () => {
  const unitedStatesHtml = renderActorDetail('united-states');
  const europeHtml = renderTopicDetail('european-union');
  const aiHtml = renderTopicDetail('ai-governance');
  const nistHtml = renderInstitutionDetail('nist');
  const unescoHtml = renderInstitutionDetail('unesco');

  assert.match(unitedStatesHtml, /America&#39;s AI Action Plan/);
  assert.match(europeHtml, /European Economic Security Strategy/);
  assert.match(aiHtml, /ISO\/IEC 42001/);
  assert.match(nistHtml, /National Standards Strategy/);
  assert.match(unescoHtml, /Recommendation on the Ethics of Artificial Intelligence/);
});

test('new standards, data, and AI records propagate through topic pages', () => {
  const chinaHtml = renderTopicDetail('china');
  const aiHtml = renderTopicDetail('ai-governance');
  const cyberHtml = renderTopicDetail('cyber-data-governance');
  const unitedStatesHtml = renderTopicDetail('united-states');
  const europeHtml = renderTopicDetail('european-union');

  assert.match(chinaHtml, /Research snapshot/);
  assert.match(chinaHtml, /topic-stat-grid/);
  assert.match(chinaHtml, /Global Cross-Border Data Flow Cooperation Initiative/);
  assert.match(chinaHtml, /Regulations on Network Data Security Management/);
  assert.match(aiHtml, /Expanded ASEAN Guide on AI Governance and Ethics/);
  assert.match(aiHtml, /Shanghai Declaration on Global AI Governance/);
  assert.match(cyberHtml, /Global Digital Compact/);
  assert.match(cyberHtml, /Cyber Resilience Act/);
  assert.match(unitedStatesHtml, /NIST Cybersecurity Framework \(CSF\) 2\.0/);
  assert.match(europeHtml, /European Union Chips Act/);
});

test('britain shelf surfaces in topics, actor detail, and timeline views', () => {
  const issues = [];
  const topicsHtml = renderTopics();
  if (!/Britain and Imperial Rule-Making/.test(topicsHtml)) {
    issues.push('missing Britain topic card');
  }

  const britainHtml = renderTopicDetail('britain-imperial-rulemaking');
  if (!/Lombard Street/.test(britainHtml)) {
    issues.push('missing Lombard Street on Britain topic page');
  }
  if (!/Declaration Respecting Maritime Law/.test(britainHtml)) {
    issues.push('missing Declaration Respecting Maritime Law on Britain topic page');
  }

  const actorHtml = renderActorDetail('united-kingdom');
  if (!/Britain and Imperial Rule-Making/.test(actorHtml)) {
    issues.push('missing Britain topic propagation on UK actor page');
  }
  if (!/The Hegemon&#39;s Dilemma|The Hegemon's Dilemma/.test(actorHtml)) {
    issues.push('missing The Hegemon\'s Dilemma on UK actor page');
  }

  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/timeline?topic=britain-imperial-rulemaking' };

  try {
    const timelineHtml = renderTimelinePage();
    if (!/Cobden-Chevalier Treaty/.test(timelineHtml)) {
      issues.push('missing Cobden-Chevalier Treaty in Britain timeline view');
    }
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }

  assert.equal(issues.length, 0, issues.join('; '));
});

test('database filter form submits named jurisdiction and date fields', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const originalFormData = globalThis.FormData;
  const formValues = {
    q: '',
    topic: '',
    dimension: 'agenda-setting',
    actor: '',
    institution: '',
    recordType: '',
    languageStatus: '',
    sourceAuthority: '',
    jurisdiction: 'China',
    dateFrom: '2020-01-01',
    dateTo: '2020-12-31',
    year: '2020',
  };
  const app = {
    innerHTML: '',
    focus() {},
  };
  let submitHandler;
  const filterForm = {
    hasAttribute(attribute) {
      return attribute === 'data-filter-form';
    },
    addEventListener(event, handler) {
      if (event === 'submit') {
        submitHandler = handler;
      }
    },
  };

  class FakeFormData {
    constructor(form) {
      assert.equal(form, filterForm);
    }

    get(field) {
      return formValues[field] ?? '';
    }

    entries() {
      return Object.entries(formValues)[Symbol.iterator]();
    }

    [Symbol.iterator]() {
      return this.entries();
    }
  }

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
    querySelectorAll(selector) {
      assert.equal(selector, 'form');
      return [filterForm];
    },
  };
  globalThis.window = {
    addEventListener() {},
    scrollTo() {},
    requestAnimationFrame(callback) {
      callback();
    },
  };
  globalThis.location = { hash: '#/database' };
  globalThis.FormData = FakeFormData;

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `filter-form-smoke=${Date.now()}`;

    await import(moduleUrl.href);
    assert.equal(typeof submitHandler, 'function');

    submitHandler({ preventDefault() {} });

    assert.match(globalThis.location.hash, /^#\/database\?/);

    const params = new URLSearchParams(globalThis.location.hash.split('?')[1]);

    assert.equal(params.get('jurisdiction'), 'China');
    assert.equal(params.get('dimension'), 'agenda-setting');
    assert.equal(params.get('dateFrom'), '2020-01-01');
    assert.equal(params.get('dateTo'), '2020-12-31');
    assert.equal(params.get('year'), '2020');
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }

    if (originalFormData === undefined) {
      delete globalThis.FormData;
    } else {
      globalThis.FormData = originalFormData;
    }
  }
});

test('topic detail pages expose local search and category filters', () => {
  const html = renderTopicDetail('china');

  assert.match(html, /data-topic-filter-form/);
  assert.match(html, /data-filter-base="#\/topics\/china"/);
  assert.match(html, /name="q"/);
  assert.match(html, /name="recordType"/);
  assert.match(html, /name="dimension"/);
  assert.match(html, /name="actor"/);
  assert.match(html, /name="institution"/);
  assert.match(html, /name="sourceAuthority"/);
  assert.match(html, /name="year"/);
  assert.match(html, /Academic articles/);
  assert.match(html, /Clear topic filters/);
});

test('topic detail filters records within the current topic', () => {
  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/topics/china?q=AIIB&recordType=academic-article' };

  try {
    const html = renderTopicDetail('china');

    assert.match(html, /filtered from \d+ total records linked to this topic/);
    assert.match(html, /China challenges global governance\? Chinese international development finance and the AIIB/);
    assert.doesNotMatch(html, /People&#39;s Republic of China: 2025 Article IV Consultation/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('topic filter form keeps users on the current topic page', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const originalFormData = globalThis.FormData;
  const formValues = {
    q: 'AIIB',
    recordType: 'academic-article',
    dimension: '',
    actor: '',
    institution: '',
    sourceAuthority: '',
    year: '',
  };
  const app = {
    innerHTML: '',
    focus() {},
  };
  let submitHandler;
  const filterForm = {
    hasAttribute(attribute) {
      return attribute === 'data-filter-form' || attribute === 'data-topic-filter-form';
    },
    getAttribute(attribute) {
      return attribute === 'data-filter-base' ? '#/topics/china' : null;
    },
    addEventListener(event, handler) {
      if (event === 'submit') {
        submitHandler = handler;
      }
    },
  };

  class FakeFormData {
    constructor(form) {
      assert.equal(form, filterForm);
    }

    get(field) {
      return formValues[field] ?? '';
    }

    entries() {
      return Object.entries(formValues)[Symbol.iterator]();
    }

    [Symbol.iterator]() {
      return this.entries();
    }
  }

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
    querySelectorAll(selector) {
      assert.equal(selector, 'form');
      return [filterForm];
    },
  };
  globalThis.window = {
    addEventListener() {},
    scrollTo() {},
    requestAnimationFrame(callback) {
      callback();
    },
  };
  globalThis.location = { hash: '#/topics/china' };
  globalThis.FormData = FakeFormData;

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `topic-filter-form-smoke=${Date.now()}`;

    await import(moduleUrl.href);
    assert.equal(typeof submitHandler, 'function');

    submitHandler({ preventDefault() {} });

    assert.equal(globalThis.location.hash, '#/topics/china?q=AIIB&recordType=academic-article');
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }

    if (originalFormData === undefined) {
      delete globalThis.FormData;
    } else {
      globalThis.FormData = originalFormData;
    }
  }
});

test('topic filter dropdown changes apply without requiring a button click', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const originalFormData = globalThis.FormData;
  const formValues = {
    q: '',
    recordType: 'academic-article',
    dimension: '',
    actor: '',
    institution: '',
    sourceAuthority: '',
    languageStatus: '',
    year: '',
  };
  const app = {
    innerHTML: '',
    focus() {},
  };
  let changeHandler;
  const filterForm = {
    hasAttribute(attribute) {
      return attribute === 'data-filter-form' || attribute === 'data-topic-filter-form';
    },
    getAttribute(attribute) {
      return attribute === 'data-filter-base' ? '#/topics/china' : null;
    },
    addEventListener(event, handler) {
      if (event === 'change') {
        changeHandler = handler;
      }
    },
  };

  class FakeFormData {
    constructor(form) {
      assert.equal(form, filterForm);
    }

    entries() {
      return Object.entries(formValues)[Symbol.iterator]();
    }

    [Symbol.iterator]() {
      return this.entries();
    }
  }

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
    querySelectorAll(selector) {
      assert.equal(selector, 'form');
      return [filterForm];
    },
  };
  globalThis.window = {
    addEventListener() {},
    scrollTo() {},
    requestAnimationFrame(callback) {
      callback();
    },
  };
  globalThis.location = { hash: '#/topics/china' };
  globalThis.FormData = FakeFormData;

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `topic-filter-change-smoke=${Date.now()}-${Math.random()}`;

    await import(moduleUrl.href);
    assert.equal(typeof changeHandler, 'function');

    changeHandler({ target: { matches: () => false } });

    assert.equal(globalThis.location.hash, '#/topics/china?recordType=academic-article');
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }

    if (originalFormData === undefined) {
      delete globalThis.FormData;
    } else {
      globalThis.FormData = originalFormData;
    }
  }
});

test('topic filter submissions keep linked records visible after rerender', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const originalFormData = globalThis.FormData;
  const formValues = {
    q: '',
    recordType: 'academic-article',
    dimension: '',
    actor: '',
    institution: '',
    sourceAuthority: '',
    languageStatus: '',
    year: '',
  };
  const app = {
    innerHTML: '',
    focus() {},
  };
  let submitHandler;
  let hashChangeHandler;
  let scrollCalls = 0;
  let resultScrollCalls = 0;
  const resultsSection = {
    scrollIntoView(options) {
      resultScrollCalls += 1;
      assert.deepEqual(options, { block: 'start' });
    },
  };
  const filterForm = {
    hasAttribute(attribute) {
      return attribute === 'data-filter-form' || attribute === 'data-topic-filter-form';
    },
    getAttribute(attribute) {
      return attribute === 'data-filter-base' ? '#/topics/china' : null;
    },
    addEventListener(event, handler) {
      if (event === 'submit') {
        submitHandler = handler;
      }
    },
  };

  class FakeFormData {
    constructor(form) {
      assert.equal(form, filterForm);
    }

    entries() {
      return Object.entries(formValues)[Symbol.iterator]();
    }

    [Symbol.iterator]() {
      return this.entries();
    }
  }

  globalThis.document = {
    querySelector(selector) {
      if (selector === '#app') return app;
      if (selector === '[data-topic-filter-results]') return resultsSection;
      if (selector === 'form[data-topic-filter-form]') return filterForm;
      return null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, 'form');
      return [filterForm];
    },
  };
  globalThis.window = {
    addEventListener(event, handler) {
      if (event === 'hashchange') {
        hashChangeHandler = handler;
      }
    },
    scrollTo() {
      scrollCalls += 1;
    },
    requestAnimationFrame(callback) {
      callback();
    },
  };
  globalThis.location = { hash: '#/topics/china' };
  globalThis.FormData = FakeFormData;

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `topic-filter-scroll-smoke=${Date.now()}-${Math.random()}`;

    await import(moduleUrl.href);
    assert.equal(typeof submitHandler, 'function');
    assert.equal(typeof hashChangeHandler, 'function');

    scrollCalls = 0;
    submitHandler({ preventDefault() {} });

    assert.equal(globalThis.location.hash, '#/topics/china?recordType=academic-article');

    hashChangeHandler();

    assert.equal(scrollCalls, 0);
    assert.equal(resultScrollCalls, 1);
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }

    if (originalFormData === undefined) {
      delete globalThis.FormData;
    } else {
      globalThis.FormData = originalFormData;
    }
  }
});

test('main renders hero content and focuses the app on route changes', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const app = {
    innerHTML: '',
    focus(options) {
      routeEvents.push(['focus', options]);
    },
  };
  let hashchangeHandler;
  const routeEvents = [];

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
  };
  globalThis.window = {
    addEventListener(event, handler) {
      if (event === 'hashchange') {
        hashchangeHandler = handler;
      }
    },
    scrollTo(...args) {
      routeEvents.push(['scrollTo', args]);
    },
    requestAnimationFrame(callback) {
      routeEvents.push(['requestAnimationFrame']);
      callback();
    },
  };
  globalThis.location = { hash: '#/' };

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `renderer-smoke=${Date.now()}`;

    await import(moduleUrl.href);

    assert.match(app.innerHTML, /Great Powers and Rule-Making/);
    assert.match(app.innerHTML, /#\/topics\/digital-trade-ecommerce/);
    assert.match(app.innerHTML, /#\/database/);
    assert.match(app.innerHTML, /#\/dimensions/);
    assert.deepEqual(routeEvents.slice(0, 4), [
      ['focus', { preventScroll: true }],
      ['scrollTo', [0, 0]],
      ['requestAnimationFrame'],
      ['scrollTo', [0, 0]],
    ]);
    assert.equal(typeof hashchangeHandler, 'function');

    globalThis.location.hash = '#/database';
    hashchangeHandler();

    assert.deepEqual(routeEvents.slice(4, 8), [
      ['focus', { preventScroll: true }],
      ['scrollTo', [0, 0]],
      ['requestAnimationFrame'],
      ['scrollTo', [0, 0]],
    ]);
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('main renders a filtered timeline route for a topic timeline view', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const app = {
    innerHTML: '',
    focus() {},
  };

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
    querySelectorAll() {
      return [];
    },
  };
  globalThis.window = {
    addEventListener() {},
    scrollTo() {},
    requestAnimationFrame(callback) {
      callback();
    },
  };
  globalThis.location = { hash: '#/timeline?topic=digital-trade-ecommerce' };

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `timeline-route-smoke=${Date.now()}`;

    await import(moduleUrl.href);

    assert.match(app.innerHTML, /Rule-Making Timeline/);
    assert.match(app.innerHTML, /WTO establishes Work Programme on Electronic Commerce/);
    assert.doesNotMatch(app.innerHTML, /European Union adopts the Artificial Intelligence Act/);
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});
