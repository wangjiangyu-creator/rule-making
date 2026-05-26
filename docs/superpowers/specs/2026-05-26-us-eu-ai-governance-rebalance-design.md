# US, EU, and AI Governance Rebalance Design

## Purpose

Continue the balance-first expansion of the Great Powers and Rule-Making portal by strengthening the still-thin United States, European Union, and AI governance shelves.

The prior China expansion materially deepened the China shelf. The next useful pass should bring the US and EU actor shelves closer to comparable research usefulness while also making the AI governance topic more current and literature-rich.

## Approved Direction

The user approved continuing from the current repo state and going ahead with the next content slice. The approved slice is a focused rebalance of the weakest post-China shelves, using the current data model and tests rather than changing the portal architecture.

## Current Gap

At the start of this pass, the relevant topic counts are:

- `united-states`: 22
- `european-union`: 22
- `ai-governance`: 24

The imbalance is substantive as well as numerical:

- The US shelf needs more standards, export-control, investment-screening, and current AI strategy materials.
- The EU shelf needs more economic-security, standards, industrial-policy, and external-market-rule materials.
- The AI governance shelf needs more current summit, standard-setting, and scholarly materials beyond the existing official baseline.

## Scope

Add one new records module with approximately 16 records:

- 5 United States-focused records
- 5 European Union-focused records
- 6 AI governance records, including overlap with US and EU where analytically justified

The batch should include only records with stable public metadata and source links. Official records should use official government, intergovernmental, or standards-body pages. Scholarship should use publisher, DOI, SSRN, or institutional repository metadata and remain summary-only.

## Target Records

United States:

- `us-ai-action-plan-2025`
- `us-executive-order-14179-ai-leadership-2025`
- `us-national-standards-strategy-cet-2023`
- `us-outbound-investment-final-rule-2024`
- `us-bis-advanced-computing-export-controls-2022`

European Union:

- `eu-economic-security-strategy-2023`
- `eu-anti-coercion-instrument-2023`
- `eu-carbon-border-adjustment-mechanism-2023`
- `eu-critical-raw-materials-act-2024`
- `eu-standardisation-strategy-2022`

AI governance and scholarship:

- `iso-iec-42001-ai-management-system-2023`
- `international-ai-safety-report-2025`
- `international-network-ai-safety-institutes-2024`
- `paris-ai-action-summit-statement-2025`
- `smuha-race-ai-regulation-2021`
- `veale-borgesius-demystifying-eu-ai-act-2021`

## Data Model

Keep the existing schema unchanged. Add records through a dedicated batch file, aggregate it in `src/data/records.js`, and add dimension mappings in `src/data/record-dimensions.js`.

No new route, filter, or rendering behavior is required. Existing topic, actor, institution, database, and record-detail views should surface the records automatically.

## Validation

Tests should enforce:

- every planned id exists
- the US topic reaches at least 27 records
- the EU topic reaches at least 27 records
- the AI governance topic reaches at least 31 records
- the new batch includes official government, official international organization, standards-body, and academic-publisher sources
- render smoke tests show propagation to US actor, EU topic, AI topic, NIST, and UNESCO pages

## Out of Scope

- No redesign of topic pages.
- No new schema fields.
- No bulk Zotero import.
- No scholarship full-text reproduction.
