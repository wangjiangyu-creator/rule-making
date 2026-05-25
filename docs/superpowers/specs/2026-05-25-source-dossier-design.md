# Source Dossier Design

## Purpose

Upgrade record pages so they do more than identify a source. The portal should help a researcher see, at a glance, which link is the controlling or primary text, which link is an official English or original-language version, which link is a PDF or repository page, and which links are only contextual or secondary.

This change should make record pages more useful for real research without disrupting the current topic-, dimension-, actor-, institution-, database-, and timeline-based structure of the site.

## Approved Product Direction

The user approved the following design choices:

- Prioritize richer source and document handling before other record-page upgrades.
- Implement three improvements in sequence:
  - clearer source hierarchy and labels
  - better document-level links and variants such as original, English, PDF, and official page
  - short source notes explaining what each link actually contains
- Use a structured upgrade of the existing `sourceLinks` model rather than a separate parallel source system.

## Core Approach

Adopt a compatibility-first structured source model.

This means:

- retain the existing `sourceLinks` field as the canonical place for outward-facing source references
- allow `sourceLinks` entries to become richer structured objects
- keep legacy `{ label, url }` entries valid during the transition
- normalize both legacy and enriched entries at render time so the site can improve immediately without requiring a full corpus rewrite first

This approach was chosen because it can support all three approved priorities cleanly while keeping the data model stable enough for a growing research portal.

## Source Link Model

Each `sourceLinks` entry may contain:

- `label`: user-facing link name
- `url`: destination URL
- `linkType`: controlled descriptor for what kind of resource the link is
- `authority`: optional per-link override when a record mixes official and secondary links
- `languageStatus`: optional per-link override when a record mixes original and English variants
- `note`: short line describing what the user will actually find there
- `sortHint`: optional manual override for unusual display-order cases

Legacy support:

- old entries with only `label` and `url` remain valid
- missing new fields should be filled by normalization using record-level defaults where appropriate
- records should not be forced to adopt the richer structure all at once

## Controlled Link Types

The initial `linkType` vocabulary should be closed and small:

- `official-page`
- `full-text`
- `pdf`
- `html-text`
- `metadata`
- `summary`
- `press-release`
- `working-paper`
- `commentary`

This vocabulary is not meant to describe every possible publishing nuance. It is meant to support reliable ordering, compact labels, and intelligible page behavior.

## Source Hierarchy Rules

Record pages should order source links by research usefulness and authority rather than by the sequence in which links happen to appear in the source data.

Default display priority:

1. official controlling text or primary text
2. official parallel language version of the same text
3. official repository page or official document landing page
4. official summary, explainer, or press release
5. secondary metadata or contextual links

Additional rules:

- if a record has an official full text, it must appear before secondary links
- if a record has both original and English versions, they should appear together in the primary section
- if a record only has a landing page, the page must not imply that the landing page is itself the controlling text
- if a secondary source is more convenient but less authoritative, the official source still appears first
- `sortHint` may override the default order only for unusual records where the standard logic is analytically misleading

## Record Page Behavior

Replace the current flat `Sources` list with a `Source dossier` section.

The record-page order should remain broadly stable:

- Summary
- Metadata
- Source dossier
- Citation

The new `Source dossier` should group links into three visible blocks:

- `Controlling or primary text`
- `Official versions and document pages`
- `Secondary or contextual links`

Each source row should show:

- the main link label
- compact badges for source type, authority, and language status when available
- a short note explaining whether the link is, for example, the treaty text, Chinese original, official English version, repository page, PDF, metadata page, or contextual commentary

This section should improve research use without turning the page into a bibliographic dump.

## Rendering Rules

Normalization should convert each raw source entry into a renderer-ready object.

The normalization layer should:

- preserve the current URL-sanitization rules
- inherit missing `authority` from record-level `sourceAuthority`
- inherit missing `languageStatus` from record-level `languageStatus`
- infer a safe default grouping when no `linkType` is provided
- keep legacy links visible even if they cannot yet receive all badges

Renderer behavior should be conservative:

- invalid or unsafe URLs remain visible as plain text and must not become clickable
- empty groups should be omitted
- notes should be short and single-purpose, not mini-abstracts
- badges should be compact and editorial, not decorative

## Enrichment Priorities

The first enrichment pass should focus on records where source variants matter most:

- treaties and agreement texts
- WTO and other institutional documents
- Chinese laws and policy documents with original and English variants
- EU and US laws, regulations, and policy documents with both text and explanatory pages
- major institutional reports where the site should distinguish between repository page, PDF, and summary page

Lower-priority items for the first pass:

- academic articles with only one stable metadata or DOI page
- books and chapters without meaningful public full-text variants
- commentary records that do not offer multiple authoritative versions

## Rollout Strategy

Implementation should proceed in three passes:

1. add a normalization layer and backward-compatible source model support
2. upgrade the record-detail renderer to a `Source dossier` layout with grouping, badges, and notes
3. enrich high-value records first, starting with official legal and institutional materials

This sequence improves the site immediately while keeping the corpus editable in place over time.

## Testing and Validation

The following behavior should be locked with tests:

- legacy `{ label, url }` source links still render
- enriched links render grouped into the correct source-dossier sections
- official or controlling texts sort ahead of contextual links
- per-link `languageStatus` and `authority` overrides render correctly
- short `note` text appears when provided
- invalid URLs remain non-clickable and visibly flagged

Visual verification should also cover a few representative records in Chrome:

- one treaty or agreement text
- one WTO or institutional document
- one Chinese legal text with original and English variants
- one academic or report record with only lighter metadata links

## Non-Goals

This change should not:

- redesign the whole record page around long annotations
- require a full manual rewrite of all source entries before shipping
- create a separate citation-management system
- infer detailed source notes automatically from link labels
- replace the broader content-expansion work still needed across the corpus

## Success Criteria

The source-dossier upgrade is successful when:

- a user can immediately identify the controlling or primary text on a record page
- official original and English variants are visibly distinguished
- document-page, PDF, and summary links are clearly separated from each other
- short source notes reduce ambiguity about what a link contains
- legacy records still render safely during the transition
- the portal becomes more useful as a serious research tool at the level of individual records, not only at the level of topic browsing
