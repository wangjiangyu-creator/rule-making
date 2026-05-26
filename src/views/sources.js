import { dimensions } from '../data/dimensions.js';
import { languageStatuses, sourceAuthorities } from '../data/schema.js';
import { authorityLabel, humanizeId } from '../lib/format.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderSourcesMethod() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Sources and method</p>
      <h1>Sources and Method</h1>
      <p class="lede">
        The portal prioritizes official and authoritative source material, with language
        status labels kept visible so users can judge whether a record is original,
        translated, bilingual, or summarized.
      </p>
    </section>

    <section>
      <h2>Source hierarchy</h2>
      <ol>
        <li>Official international organization, government, regulator, court, tribunal, and treaty-depository sources.</li>
        <li>Primary legal instruments, negotiation records, institutional reports, and official policy statements.</li>
        <li>Academic publishers, think tanks, and professional commentary used to contextualize official materials.</li>
      </ol>
    </section>

    <section>
      <h2>Authority labels</h2>
      <ul>
        ${sourceAuthorities
          .map((authority) => `<li>${escapeHtml(authorityLabel(authority))}</li>`)
          .join('')}
      </ul>
    </section>

    <section>
      <h2>Language status policy</h2>
      <p>
        Records retain a language-status label instead of implying that every source has
        the same evidentiary weight. Official originals and official bilingual texts are
        preferred for legal propositions. Unofficial translations and site summaries are
        useful for orientation but should be checked against the controlling source.
      </p>
      <ul>
        ${languageStatuses.map((status) => `<li>${escapeHtml(humanizeId(status))}</li>`).join('')}
      </ul>
    </section>

    <section>
      <h2>Analytical dimensions</h2>
      <p>
        The portal classifies records not only by topic and actor, but also by the
        rule-making function they illuminate. These analytical dimensions allow
        comparison across China, the United States, Europe, Britain, and middle powers.
      </p>
      <ul>
        ${dimensions
          .map(
            (dimension) =>
              `<li><strong>${escapeHtml(dimension.title)}.</strong> ${escapeHtml(dimension.summary)}</li>`,
          )
          .join('')}
      </ul>
    </section>
  `;
}
