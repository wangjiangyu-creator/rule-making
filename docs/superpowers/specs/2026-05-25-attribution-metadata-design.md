# Attribution Metadata Design

## Purpose

Upgrade the portal so records can show clear author and publisher information wherever that attribution is identifiable and analytically useful. This should improve scanning, retrieval, and bibliographic orientation across scholarship, institutional reports, and official materials without turning the site into a citation manager.

The change should support both fast browsing in list views and more precise bibliographic structure on record detail pages.

## Approved Product Direction

The user approved the following design choices:

- Prioritize author and publisher metadata as the next record-density upgrade.
- Use explicit structured fields rather than inferring attribution from `citation`.
- Apply attribution to all materials with an identifiable author, including institutional authors where appropriate.
- Show attribution both on full record pages and in record lists across the portal.

## Core Approach

Adopt a structured attribution model that treats personal and institutional authors through the same field shape.

This means:

- add explicit `authors` and `publisher` fields to records
- render attribution only when it is reliably identifiable
- keep attribution separate from `citation`, `sourceLinks`, and `summary`
- allow gradual enrichment of the corpus without requiring every record to be updated at once

This approach was chosen because it preserves structured reuse for future filtering, comparison, and export while avoiding brittle parsing from mixed citation styles.

## Data Model

Add these fields to records:

- `authors`: optional array of author objects
- `publisher`: optional string
- `publicationTitle`: optional string reserved for later use when journal titles, series names, or edited volumes need separate display

Author object shape:

- `name`: display name
- `kind`: `person` or `institution`

Examples:

- academic article
  - `authors: [{ name: 'Richard H. Steinberg', kind: 'person' }]`
  - `publisher: 'Cambridge University Press'`
- institutional report
  - `authors: [{ name: 'United Nations High-Level Advisory Body on Artificial Intelligence', kind: 'institution' }]`
  - `publisher: 'United Nations'`
- official legal text
  - `authors: [{ name: 'National People's Congress', kind: 'institution' }]`
  - `publisher: "National People's Congress of the People's Republic of China"`

## Attribution Rules

Attribution should be added only when it is reasonably identifiable from the source itself or from standard bibliographic information.

Rules:

- do not invent personal authors for treaties, resolutions, or generic multilateral instruments that do not truly have one
- institutional issuers may be treated as authors when they clearly function as the identifiable authoring body
- if authors are unclear but publisher is still useful, publisher may be shown alone
- if neither author nor publisher is reliable, omit attribution rather than guessing

This keeps the portal bibliographically useful without falsely increasing certainty.

## Display Behavior

Attribution should render in two layers.

### List views

Show a compact muted attribution line directly under the title on:

- Topics
- Dimensions
- Database
- Actors
- Institutions
- any other record-list view where cards or rows represent records

Default format:

- `Author | Publisher`

Examples:

- `Richard H. Steinberg | Cambridge University Press`
- `United Nations High-Level Advisory Body on Artificial Intelligence | United Nations`
- `National People's Congress | National People's Congress of the People's Republic of China`

Fallback rules:

- if only authors are known, show authors alone
- if only publisher is known, show publisher alone only when it adds real retrieval value
- if neither is reliable, omit the line

### Record detail pages

Place the compact attribution line near the top of the record page:

- below the title or alternate title
- above the summary

Also add separate metadata rows when present:

- `Authors`
- `Publisher`

This gives fast visual orientation near the top and more precise structured information in the metadata block.

## Formatting Rules

The attribution line should stay compact and editorial.

Rules:

- do not duplicate the full citation
- do not restate record type, year, or source authority in the attribution line
- support multiple authors by joining names naturally, for example `A, B, and C | Publisher`
- render institutional and personal authors through the same visual treatment
- keep the style consistent across list views and record pages

## Rollout Strategy

Implementation should proceed in three passes:

1. add helper functions and renderer support so attribution appears when fields exist
2. expose attribution lines in list views and record detail pages, plus metadata rows on detail pages
3. enrich high-value records first

First enrichment pass priorities:

- academic articles
- books and chapters
- think-tank and institutional reports
- official materials with clearly identifiable issuing bodies

Lower-priority items:

- treaty texts without meaningful author attribution
- generic multilateral instruments where author identification would be artificial
- records whose citation exists but whose authorship cannot be stated confidently

## Testing and Validation

The following behavior should be locked with tests:

- records with `authors` render an attribution line in list views
- records with `authors` or `publisher` render attribution on detail pages
- metadata rows for `Authors` and `Publisher` appear only when data exists
- multiple authors join correctly
- institutional authors render correctly
- records without attribution remain clean and do not show empty placeholders

Visual verification should cover:

- one academic article
- one book or chapter
- one institutional report
- one official legal or policy text with institutional authorship

## Non-Goals

This change should not:

- redesign the site around full bibliographic citations
- require citation parsing from legacy text
- force every existing record to be fully attributed before shipping
- introduce a full bibliography or export system yet
- replace later work on related-record comparison or deeper content expansion

## Success Criteria

The attribution upgrade is successful when:

- scholarship records are easier to scan because author and publisher are visible immediately
- institutional and official materials gain clearer issuing-author orientation where appropriate
- list views and detail pages stay consistent
- records without reliable attribution are omitted cleanly rather than guessed at
- the portal becomes more useful for repeated research use, not only for one-off browsing
