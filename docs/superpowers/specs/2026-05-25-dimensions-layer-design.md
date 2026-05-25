# Dimensions Layer Design

## Purpose

Add a first-class analytical layer to the Great Powers and Rule-Making portal so the site can be used not only as a topic atlas, but also as a comparative research tool organized around the user's rule-making framework.

The new layer should expose five cross-cutting dimensions:

- objective-setting
- legitimacy-management
- agenda-setting
- coalition-consensus-building
- norm-entrepreneurship-drafting-power

This change should preserve the current topic-first structure while making the research design visible across navigation, filtering, and record detail pages.

## Approved Product Direction

The user approved the following design choices:

- Keep the site topic-first.
- Add Dimensions as a new co-equal section rather than replacing Topics.
- Allow records to carry multiple dimensions.
- Tag the whole existing corpus rather than a partial subset.
- Keep norm entrepreneurship and drafting power as one combined dimension.
- Use the co-equal dimensions layer approach rather than a light filter-only approach or a full information-architecture rewrite.

## Information Architecture

The top-level navigation should become:

- Topics
- Dimensions
- Database
- Actors
- Institutions
- Sources and Method

The current dedicated Digital Trade Pilot nav item does not need to change for the first rollout of Dimensions. Navigation cleanup can be considered later if the top bar becomes crowded.

Dimensions becomes a parallel browsing layer, not a replacement for Topics.

The site layers should be interpreted as follows:

- Topics: substantive shelves such as theory, WTO reform, digital trade, cyber/data, finance, investment, and AI.
- Dimensions: analytical lenses used to compare rule-making behavior across topics and powers.
- Actors: state or regional profiles.
- Institutions: rule-making venues and organizational sites.
- Database: combined search and filtering interface across all layers.

## Dimensions Section

The new Dimensions section should contain an index page and five detail pages.

Dimension ids and titles:

- `objective-setting` -> Objective-Setting
- `legitimacy-management` -> Legitimacy Management
- `agenda-setting` -> Agenda-Setting
- `coalition-consensus-building` -> Coalition and Consensus-Building
- `norm-entrepreneurship-drafting-power` -> Norm Entrepreneurship and Drafting Power

Each dimension detail page should mirror the current topic-page pattern:

- title and framing summary
- short list of research questions
- button to open the database pre-filtered to that dimension
- linked records list

## Data Model

Add a dedicated `dimensions` field to every record.

The record model should distinguish:

- `topics`: subject-matter shelf
- `dimensions`: analytical lens
- `tags`: freeform descriptive and search terms

`dimensions` should be a closed vocabulary rather than an open keyword field. It should be validated in tests the same way topic ids are validated.

The purpose of a separate `dimensions` field is to avoid overloading `tags`, which already mix:

- institutions
- instruments
- issue labels
- legal concepts
- historical references
- informal analytical hints

The new field becomes the authoritative source for dimension browsing, counting, rendering, and filtering.

## Classification Rules

Every record in the corpus must have at least one dimension.

Records may carry more than one dimension when analytically justified. This is the default expectation rather than an exception, because many records are relevant to more than one rule-making function.

Dimension assignment should follow analytical usefulness rather than title keywords alone.

Existing dimension-like terms in `tags` may remain in place for search continuity, but they should not be treated as the canonical dimension classification once the new field exists.

Working definitions:

- `objective-setting`: strategic goals, mandate formation, institutional purpose, priority definition, and attempts to define what rule-making is for.
- `legitimacy-management`: participation, transparency, inclusiveness, fairness, authority, acceptance, procedural credibility, and justification of institutional authority.
- `agenda-setting`: convening, sequencing, venue choice, issue framing, negotiation launch, chairmanship, and control over the structure of negotiation.
- `coalition-consensus-building`: joint positions, brokerage, compromise management, group formation, coalition maintenance, and consensus construction.
- `norm-entrepreneurship-drafting-power`: model texts, template clauses, drafting leadership, standard-setting language, textual innovation, and technical rule-writing capacity.

## Page Behavior

### Home page

Add a compact Research Pathways panel with links to:

- browse by topic
- browse by dimension
- browse by actor

This should be a small editorial addition, not a homepage redesign.

### Topics pages

Topic detail pages should gain a Relevant dimensions block near the top. This block should surface the most relevant dimensions for the topic and link to their detail pages.

This block should be curated at the topic level rather than inferred from record counts during the first rollout.

### Dimensions pages

Dimension detail pages should use the same visual grammar as topic pages so the section feels native to the portal rather than bolted on later.

### Database

The database filter form should add a Dimension selector.

Users should be able to combine:

- topic + dimension
- actor + dimension
- institution + dimension
- dimension + record type

This is the main functional gain of the new layer because it enables structured comparison across the corpus.

### Record detail pages

Record detail pages should display Dimensions in metadata alongside Topics, Actors, and Institutions, with links into the new dimension routes.

## Topic-Level Curation

The topic dataset should gain a lightweight field for relevant dimensions so topic pages can show a clear analytical bridge instead of leaving users to infer the relationship.

This field should remain curated and small. It is not meant to duplicate every dimension appearing in linked records.

## Rendering and Routing

Add:

- a dimensions data file
- a dimensions index renderer
- a dimension detail renderer
- routes for `#/dimensions` and `#/dimensions/:id`

The route structure should follow the same pattern already used for topics, actors, and institutions.

## Testing and Validation

The following invariants should be enforced:

- dimension ids are stable and unique
- every dimension referenced by a record resolves to a declared dimension
- every record has at least one dimension
- every dimension has at least one linked record
- the database renderer exposes a dimension filter control
- the record-detail renderer shows dimension output
- the dimensions index and detail renderers smoke-test successfully

Search and filtering tests should also confirm that dimension filtering returns only records carrying the selected dimension.

## Rollout Sequence

Implementation should proceed in this order:

1. Add the dimensions dataset and route layer.
2. Extend the record schema with a validated `dimensions` field.
3. Classify the whole corpus record by record.
4. Expose dimensions in the database filter and record pages.
5. Add topic-level relevant-dimensions curation.
6. Tighten tests so the layer cannot silently regress.

## Non-Goals

This change should not:

- replace topics as the main browsing layer
- infer dimensions automatically from freeform tags
- redesign the entire homepage
- create actor-to-dimension scorecards yet
- introduce quantitative rankings of great-power performance
- delay content expansion behind a large structural rewrite

## Success Criteria

The dimensions layer is successful when:

- a user can browse the portal by dimension without leaving the current site structure
- the database can combine substantive and analytical filters cleanly
- record pages visibly surface analytical classification
- topic pages make the research framework legible
- the whole corpus is dimension-tagged with defensible classifications
- the comparative China/US/Europe/UK project becomes easier to execute from the portal itself
