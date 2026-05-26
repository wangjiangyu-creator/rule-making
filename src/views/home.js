import { records } from '../data/records.js?v=20260526o';
import { timeline } from '../data/timeline.js';
import { topics } from '../data/topics.js';
import { attributionDisplay } from '../lib/attribution.js';
import { formatDate, recordTypeLabel } from '../lib/format.js';
import { sortRecordsNewestFirst } from '../lib/search.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderRecentRecord(record) {
  const attribution = attributionDisplay(record);

  return `
    <li class="record-row">
      <p class="eyebrow">${escapeHtml(recordTypeLabel(record.recordType))}</p>
      <h3><a href="#/records/${escapeHtml(record.id)}">${escapeHtml(record.title)}</a></h3>
      ${attribution ? `<p class="record-attribution">${escapeHtml(attribution)}</p>` : ''}
      <p>${escapeHtml(record.summary)}</p>
    </li>
  `;
}

function renderTopicCard(topic) {
  return `
    <article class="topic-card">
      <p class="eyebrow">Research topic</p>
      <h3><a href="#/topics/${escapeHtml(topic.id)}">${escapeHtml(topic.title)}</a></h3>
      <p>${escapeHtml(topic.summary)}</p>
    </article>
  `;
}

function renderTimelineItem(entry) {
  return `
    <li>
      <time datetime="${escapeHtml(entry.date)}">${escapeHtml(formatDate(entry.date))}</time>
      <span>${escapeHtml(entry.title)}</span>
    </li>
  `;
}

export function renderHome() {
  const digitalTradeTopic = topics.find((topic) => topic.id === 'digital-trade-ecommerce');
  const recentRecords = sortRecordsNewestFirst(records).slice(0, 5);
  const totalRecordCount = records.length.toLocaleString('en-US');
  const digitalTradeTimeline = timeline
    .filter((entry) => entry.topicId === 'digital-trade-ecommerce')
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(0, 5);

  return `
    <section class="page-hero">
      <p class="eyebrow">International economic governance</p>
      <h1 class="home-title">Great Powers and Rule-Making</h1>
      <p class="home-attribution">This website was created with Codex by Professor Wang Jiangyu of CityUHK.</p>
      <p class="lede">
        A research portal and structured database on how great powers shape rules,
        institutions, and bargaining agendas in the international economic system.
      </p>
      <form class="search-form" data-global-search>
        <label for="global-search">Search the rule-making database</label>
        <div class="button-row">
          <input id="global-search" name="query" type="search" autocomplete="off">
          <button class="button button-primary" type="submit">Search</button>
        </div>
      </form>
    </section>

    <section class="record-count-box" aria-label="Portal record count">
      <div>
        <p class="eyebrow">Database size</p>
        <p>Structured source records currently available for search, topic pages, and actor comparisons.</p>
      </div>
      <p class="record-count-value"><span>${escapeHtml(totalRecordCount)}</span> Total records</p>
    </section>

    <section class="feature-panel">
      <p class="eyebrow">Featured topic</p>
      <h2>Digital Trade and E-Commerce</h2>
      <p>${escapeHtml(digitalTradeTopic?.summary ?? '')}</p>
      <div class="button-row">
        <a class="button button-primary" href="#/topics/digital-trade-ecommerce">Open Digital Trade Topic</a>
        <a class="button button-secondary" href="#/database?topic=digital-trade-ecommerce">Filter Database</a>
      </div>
    </section>

    <section class="feature-panel">
      <p class="eyebrow">Research pathways</p>
      <h2>Compare the portal by topic, dimension, or actor</h2>
      <p>
        Move between substantive issue areas, cross-cutting rule-making dimensions,
        and actor profiles without leaving the structured database.
      </p>
      <div class="button-row">
        <a class="button button-primary" href="#/topics">Browse by topic</a>
        <a class="button button-secondary" href="#/dimensions">Browse by dimension</a>
        <a class="button button-secondary" href="#/actors">Browse by actor</a>
      </div>
    </section>

    <section>
      <h2>Recent records</h2>
      <ol class="record-list">
        ${recentRecords.map(renderRecentRecord).join('')}
      </ol>
    </section>

    <section>
      <h2>Topic atlas</h2>
      <div class="card-grid">
        ${topics.map(renderTopicCard).join('')}
      </div>
    </section>

    <section>
      <h2>Digital trade timeline preview</h2>
      <div class="button-row">
        <a class="button button-secondary" href="#/timeline?topic=digital-trade-ecommerce">Open full timeline</a>
      </div>
      <ol class="timeline-list">
        ${digitalTradeTimeline.map(renderTimelineItem).join('')}
      </ol>
    </section>
  `;
}
