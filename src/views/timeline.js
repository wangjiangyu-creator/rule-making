import { records } from '../data/records.js?v=20260526j';
import { timeline } from '../data/timeline.js';
import { topics } from '../data/topics.js';
import { formatDate } from '../lib/format.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function topicIdFromHash() {
  const hash = globalThis.location?.hash ?? '#/timeline';
  const query = hash.includes('?') ? hash.split('?')[1] : '';
  const params = new URLSearchParams(query);

  return params.get('topic') ?? '';
}

function sortedTimelineEntries() {
  return [...timeline].sort((left, right) => left.date.localeCompare(right.date));
}

function topicTimelineCounts() {
  const counts = new Map();

  for (const entry of timeline) {
    counts.set(entry.topicId, (counts.get(entry.topicId) ?? 0) + 1);
  }

  return topics
    .filter((topic) => counts.has(topic.id))
    .map((topic) => ({
      ...topic,
      count: counts.get(topic.id) ?? 0,
    }))
    .sort((left, right) => right.count - left.count || left.title.localeCompare(right.title));
}

function renderRelatedRecords(ids) {
  const links = ids
    .map((recordId) => records.find((record) => record.id === recordId))
    .filter(Boolean)
    .map(
      (record) =>
        `<a href="#/records/${escapeHtml(record.id)}">${escapeHtml(record.title)}</a>`,
    );

  return links.length ? links.join(', ') : 'No linked records';
}

function renderTimelineEntry(entry) {
  const topic = topics.find((item) => item.id === entry.topicId);

  return `
    <li>
      <time datetime="${escapeHtml(entry.date)}">${escapeHtml(formatDate(entry.date))}</time>
      <div class="timeline-entry">
        <strong class="timeline-entry-title">${escapeHtml(entry.title)}</strong>
        <p class="record-taxonomy">
          Topic:
          <a href="#/topics/${escapeHtml(entry.topicId)}">${escapeHtml(topic?.title ?? entry.topicId)}</a>
        </p>
        <p class="record-taxonomy">Linked records: ${renderRelatedRecords(entry.relatedIds ?? [])}</p>
      </div>
    </li>
  `;
}

export function renderTimelinePage() {
  const requestedTopicId = topicIdFromHash();
  const selectedTopic = topics.find((topic) => topic.id === requestedTopicId);
  const selectedTopicId = selectedTopic?.id ?? '';
  const entries = sortedTimelineEntries().filter(
    (entry) => !selectedTopicId || entry.topicId === selectedTopicId,
  );
  const timelineTopics = topicTimelineCounts();

  return `
    <section class="page-hero">
      <p class="eyebrow">Chronology</p>
      <h1>Rule-Making Timeline</h1>
      <p class="lede">
        ${
          selectedTopic
            ? `A focused chronology for ${escapeHtml(selectedTopic.title)}, linking major rule-making moments back to the portal's topic and record archive.`
            : `A cross-topic chronology of major rule-making moments, designed to connect negotiations, instruments, and institutional turning points across the portal.`
        }
      </p>
      <div class="button-row">
        ${
          selectedTopic
            ? `
              <a class="button button-primary" href="#/topics/${escapeHtml(selectedTopic.id)}">Open Topic Page</a>
              <a class="button button-secondary" href="#/timeline">View Full Timeline</a>
            `
            : `
              <a class="button button-primary" href="#/topics/digital-trade-ecommerce">Open Digital Trade Pilot</a>
              <a class="button button-secondary" href="#/database">Open Database</a>
            `
        }
      </div>
    </section>

    <section>
      <h2>Timeline pathways</h2>
      <p class="record-taxonomy">
        ${timelineTopics
          .map(
            (topic) =>
              `<a href="#/timeline?topic=${escapeHtml(topic.id)}">${escapeHtml(topic.title)} (${topic.count})</a>`,
          )
          .join(', ')}
      </p>
    </section>

    <section>
      <h2>${selectedTopic ? `${escapeHtml(selectedTopic.title)} chronology` : 'Full chronology'}</h2>
      <p>${entries.length} timeline entries shown.</p>
      <ol class="timeline-list">
        ${entries.map(renderTimelineEntry).join('')}
      </ol>
    </section>
  `;
}
