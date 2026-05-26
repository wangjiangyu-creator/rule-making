import { dimensions } from '../data/dimensions.js';
import { records } from '../data/records.js?v=20260526f';
import { timeline } from '../data/timeline.js';
import { topics } from '../data/topics.js';
import { attributionDisplay } from '../lib/attribution.js';
import { formatDate, recordTypeLabel } from '../lib/format.js';
import { isChinaRelatedRecord, sortRecordsForContext } from '../lib/search.js';

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

function renderDimensionLinks(ids) {
  return asList(ids)
    .map((dimensionId) => {
      const dimension = dimensions.find((item) => item.id === dimensionId);
      const label = dimension ? dimension.title : dimensionId;

      return `<a href="#/dimensions/${escapeHtml(dimensionId)}">${escapeHtml(label)}</a>`;
    })
    .join(', ');
}

function renderRecordDimensionLinks(ids) {
  return asList(ids)
    .map((dimensionId) => {
      const dimension = dimensions.find((item) => item.id === dimensionId);
      const label = dimension?.shortTitle ?? dimension?.title ?? dimensionId;

      return `<a href="#/dimensions/${escapeHtml(dimensionId)}">${escapeHtml(label)}</a>`;
    })
    .join(', ');
}

function recordsForTopic(topicId) {
  return sortRecordsForContext(
    records.filter((record) => asList(record.topics).includes(topicId)),
    { promoteChina: topicId !== 'china' },
  );
}

const chinaRecordTypeOrder = [
  'official-statement',
  'negotiation-record',
  'institutional-document',
  'treaty-agreement',
  'national-law-policy',
  'case-dispute-award',
  'research-report',
  'academic-article',
  'book-chapter',
];

const chinaRecordTypeSectionLabels = {
  'official-statement': 'Official statements',
  'negotiation-record': 'Negotiation records',
  'institutional-document': 'Institutional documents',
  'treaty-agreement': 'Treaties and agreements',
  'national-law-policy': 'National law and policy',
  'case-dispute-award': 'Cases, disputes, and awards',
  'research-report': 'Research reports',
  'academic-article': 'Academic articles',
  'book-chapter': 'Books and chapters',
};

function groupedChinaRecords(linkedRecords) {
  const grouped = [];
  const seen = new Set();

  for (const recordType of chinaRecordTypeOrder) {
    const recordsForType = linkedRecords.filter((record) => record.recordType === recordType);
    if (recordsForType.length === 0) continue;

    grouped.push({
      recordType,
      label: chinaRecordTypeSectionLabels[recordType] ?? recordTypeLabel(recordType),
      records: recordsForType,
    });
    seen.add(recordType);
  }

  for (const record of linkedRecords) {
    if (seen.has(record.recordType)) continue;

    const existingGroup = grouped.find((group) => group.recordType === record.recordType);
    if (existingGroup) {
      existingGroup.records.push(record);
      continue;
    }

    grouped.push({
      recordType: record.recordType,
      label: recordTypeLabel(record.recordType),
      records: [record],
    });
  }

  return grouped;
}

function renderChinaRecordSections(linkedRecords) {
  const groups = groupedChinaRecords(linkedRecords);

  return groups
    .map(
      (group, index) => `
        <section class="record-category">
          <h3 class="record-category-heading">${escapeHtml(group.label)}</h3>
          <p class="record-category-count">${group.records.length} record${group.records.length === 1 ? '' : 's'} in this category.</p>
          <div class="record-list">
            ${group.records.map(renderRecordRow).join('')}
          </div>
        </section>
        ${index < groups.length - 1 ? '<hr class="record-category-divider">' : ''}
      `,
    )
    .join('');
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
  const attribution = attributionDisplay(record);

  return `
    <article class="record-row">
      <p class="eyebrow">
        ${escapeHtml(recordTypeLabel(record.recordType))}
        ${record.date || record.year ? ` | ${escapeHtml(formatDate(record.date ?? record.year))}` : ''}
      </p>
      <h3><a href="#/records/${escapeHtml(record.id)}">${escapeHtml(record.title)}</a></h3>
      ${attribution ? `<p class="record-attribution">${escapeHtml(attribution)}</p>` : ''}
      <p>${escapeHtml(record.summary)}</p>
      <p class="record-taxonomy">${renderRecordDimensionLinks(record.dimensions)}</p>
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
  const topicTimeline = timeline
    .filter((entry) => entry.topicId === topic.id)
    .sort((left, right) => left.date.localeCompare(right.date));
  const chinaLinkedRecords = topic.id === 'china'
    ? linkedRecords
    : linkedRecords.filter((record) => isChinaRelatedRecord(record));

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

    <section>
      <h2>Relevant dimensions</h2>
      <p>${renderDimensionLinks(topic.dimensionIds)}</p>
    </section>

    ${
      topicTimeline.length > 0
        ? `
          <section>
            <h2>Timeline</h2>
            <div class="button-row">
              <a class="button button-secondary" href="#/timeline?topic=${escapeHtml(topic.id)}">
                Open full timeline
              </a>
            </div>
            <ol class="timeline-list">
              ${topicTimeline.map(renderTimeline).join('')}
            </ol>
          </section>
        `
        : ''
    }

    ${
      topic.id !== 'china' && chinaLinkedRecords.length > 0
        ? `
          <section>
            <h2>China in this topic</h2>
            <p>${chinaLinkedRecords.length} China-linked record${chinaLinkedRecords.length === 1 ? '' : 's'} highlighted for this topic.</p>
            <div class="record-list">
              ${chinaLinkedRecords.slice(0, 8).map(renderRecordRow).join('')}
            </div>
          </section>
        `
        : ''
    }

    <section>
      <h2>Linked records</h2>
      <p>${
        topic.id === 'china'
          ? `${linkedRecords.length} records linked to this topic, grouped under the current category model.`
          : `${linkedRecords.length} records linked to this topic.`
      }</p>
      ${
        topic.id === 'china'
          ? renderChinaRecordSections(linkedRecords)
          : `
            <div class="record-list">
              ${linkedRecords.map(renderRecordRow).join('')}
            </div>
          `
      }
    </section>
  `;
}
