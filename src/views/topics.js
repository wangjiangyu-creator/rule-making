import { records } from '../data/records.js';
import { timeline } from '../data/timeline.js';
import { topics } from '../data/topics.js';
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

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function recordsForTopic(topicId) {
  return sortRecordsNewestFirst(records.filter((record) => asList(record.topics).includes(topicId)));
}

function renderTopicCard(topic) {
  const linkedRecords = recordsForTopic(topic.id);

  return `
    <article class="topic-card">
      <p class="eyebrow">${topic.pilot ? 'Pilot topic' : `${linkedRecords.length} linked records`}</p>
      <h3><a href="#/topics/${escapeHtml(topic.id)}">${escapeHtml(topic.title)}</a></h3>
      <p>${escapeHtml(topic.summary)}</p>
    </article>
  `;
}

function renderRecordRow(record) {
  return `
    <article class="record-row">
      <p class="eyebrow">
        ${escapeHtml(recordTypeLabel(record.recordType))}
        ${record.date || record.year ? ` | ${escapeHtml(formatDate(record.date ?? record.year))}` : ''}
      </p>
      <h3><a href="#/records/${escapeHtml(record.id)}">${escapeHtml(record.title)}</a></h3>
      <p>${escapeHtml(record.summary)}</p>
    </article>
  `;
}

function renderTimeline(entry) {
  return `
    <li>
      <time datetime="${escapeHtml(entry.date)}">${escapeHtml(formatDate(entry.date))}</time>
      <span>${escapeHtml(entry.title)}</span>
    </li>
  `;
}

export function renderTopics() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Atlas</p>
      <h1>Research Topics</h1>
      <p class="lede">
        The portal organizes rule-making materials by actors, institutions, legal fields,
        and cross-cutting governance questions.
      </p>
    </section>
    <section>
      <div class="card-grid">
        ${topics.map(renderTopicCard).join('')}
      </div>
    </section>
  `;
}

export function renderTopicDetail(topicId) {
  const topic = topics.find((item) => item.id === topicId);

  if (!topic) {
    return `
      <section class="page-hero">
        <p class="eyebrow">Topic not found</p>
        <h1>Topic not found</h1>
        <p class="lede">The requested research topic is not in the portal index.</p>
        <a class="button button-secondary" href="#/topics">Back to Topics</a>
      </section>
    `;
  }

  const linkedRecords = recordsForTopic(topic.id);
  const topicTimeline = timeline.filter((entry) => entry.topicId === topic.id);

  return `
    <section class="page-hero">
      <p class="eyebrow">${topic.pilot ? 'Pilot topic' : 'Research topic'}</p>
      <h1>${escapeHtml(topic.title)}</h1>
      <p class="lede">${escapeHtml(topic.summary)}</p>
      <div class="button-row">
        <a class="button button-primary" href="#/database?topic=${escapeHtml(topic.id)}">
          View ${linkedRecords.length} linked records
        </a>
      </div>
    </section>

    <section>
      <h2>Research questions</h2>
      <ul>
        ${asList(topic.questions)
          .map((question) => `<li>${escapeHtml(question)}</li>`)
          .join('')}
      </ul>
    </section>

    ${
      topicTimeline.length > 0
        ? `
          <section>
            <h2>Timeline</h2>
            <ol class="timeline-list">
              ${topicTimeline.map(renderTimeline).join('')}
            </ol>
          </section>
        `
        : ''
    }

    <section>
      <h2>Linked records</h2>
      <p>${linkedRecords.length} records linked to this topic.</p>
      <div class="record-list">
        ${linkedRecords.map(renderRecordRow).join('')}
      </div>
    </section>
  `;
}
