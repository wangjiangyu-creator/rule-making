# Britain and Imperial Rule-Making Design

## Purpose

Add a historically grounded Britain shelf to the portal so the site can support comparative rule-making analysis across major powers, not only contemporary U.S., EU, and Chinese practice.

The shelf should focus mainly on the eighteenth and nineteenth centuries, with selective early twentieth-century carryover where that historical continuity is analytically useful. The point is not to build a general British history page. The point is to build a mixed historical corpus that helps evaluate how Britain performed across the portal's five rule-making dimensions.

## Approved Product Direction

The user approved the following direction:

- prioritize Britain as the next comparative great-power expansion
- emphasize the period of British global dominance, especially the eighteenth and nineteenth centuries
- build a mixed shelf across trade and empire, money and finance, and international legal doctrine and institutions
- create a dedicated historical topic shelf rather than leaving the material only on the `united-kingdom` actor page

## Core Approach

Add a new topic shelf:

- `britain-imperial-rulemaking`

This shelf will function as the main historical entry point for British rule-making materials. Records on the shelf should also propagate into the existing comparative structure where appropriate, especially:

- `great-powers`
- `theories-rulemaking`
- `monetary-financial-regulation`
- `international-investment`

The existing `united-kingdom` actor page should remain in place, but its framing should be broadened so it clearly spans imperial Britain, postwar Britain, and the contemporary United Kingdom.

## Why a Dedicated Topic Is Better Than Actor-Only Placement

Keeping the material only on the `united-kingdom` actor page would make the historical corpus too diffuse.

The Britain material cuts across:

- imperial commercial order
- monetary and financial governance
- public international legal doctrine
- comparative hegemonic-order theory

That breadth would make the historical records hard to discover if they lived only as actor-linked entries. A dedicated topic solves that retrieval problem while still allowing the actor page and dimension pages to surface the same records.

This approach also avoids creating a second actor such as `british-empire`, which would complicate the site more than necessary and create avoidable classification arguments.

## Topic Definition

### Topic id

- `britain-imperial-rulemaking`

### Title

- `Britain and Imperial Rule-Making`

### Short title

- `Britain and Empire`

### Summary

Suggested direction:

`Historical study of how Britain shaped international economic and legal rules through empire, trade, finance, naval and market power, legal doctrine, and institutional practice.`

### Research questions

The topic should include research questions along these lines:

- How did Britain set objectives and define the terms of international commercial and legal order during the period of imperial dominance?
- Through which instruments did Britain turn imperial, naval, financial, and legal power into durable international rules?
- Which elements of British rule-making survived into later monetary, commercial, and institutional orders?

### Dimensions

The shelf should foreground these dimensions:

- `objective-setting`
- `agenda-setting`
- `coalition-consensus-building`
- `norm-entrepreneurship-drafting-power`

`legitimacy-management` should also appear where particular materials justify it, especially in relation to public-law doctrine, arbitration, treaty legitimation, and imperial governance claims.

## Content Model

This should be a mixed historical research shelf rather than a list of canonical books.

The shelf should combine:

- primary legal and policy materials
- institutional and treaty materials
- cases and arbitral materials where they illuminate rule-making practice
- books, chapters, and journal articles that explain British hegemonic or imperial rule-making

The first batch should include materials across four content bands.

### 1. Imperial trade and commercial order

Likely material types:

- statutes or official instruments affecting trade governance
- charter or company materials where they bear directly on rule-making
- treaty or policy texts tied to imperial commercial ordering
- scholarship on free trade, imperial preference, or commercial hegemonic order

### 2. Money, finance, and monetary order

Likely material types:

- gold-standard or monetary-order texts
- Bank of England or financial-governance materials
- crisis-management and lender-of-last-resort classics
- scholarship on sterling, monetary hierarchy, and imperial financial order

### 3. International legal doctrine and institutional practice

Likely material types:

- law-of-nations texts and publicists
- neutrality, jurisdiction, or maritime materials
- arbitral or mixed-claims materials
- scholarship on how British jurists and institutions shaped public international law

### 4. Historical interpretation and comparative theory

Likely material types:

- books and articles on British hegemony and order-building
- work connecting British dominance to later U.S.-led or liberal order literatures
- studies that help compare Britain to later great powers across the five dimensions

## Record-Type Rules

The Britain shelf should have a real mixed-source profile from the start.

The first meaningful batch should include at least:

- scholarship records
- institutional or policy records
- treaty, legal, or doctrinal primary materials

The shelf should not ship as a theory-only page or a primary-text-only page.

## Linking Rules

Every Britain-shelf record should be evaluated for propagation beyond the home topic.

Expected cross-links:

- `great-powers` for most items
- `theories-rulemaking` for hegemonic-order, public-law, legitimacy, and rule-creation literatures
- `monetary-financial-regulation` for gold standard, sterling, central banking, and financial-governance records
- `international-investment` where imperial commercial law, concessions, dispute practice, or property-protection materials genuinely fit

Additional propagation should be conservative and analytical, not decorative.

The shelf should also use the existing actor and dimension layers:

- records with clear British relevance should link to `united-kingdom`
- dimensions should be assigned record by record using the current portal model

## Actor-Page Refinement

The `united-kingdom` actor page should remain the single actor page for Britain.

However, its summary should be broadened so the page clearly spans:

- imperial Britain
- postwar Britain
- the contemporary United Kingdom

This keeps the actor model stable while allowing the page to surface historical records coherently.

## Page Behavior

The new shelf should behave like a full topic page, not a side note.

Required behavior:

- `Topics` index shows a new card for `Britain and Imperial Rule-Making`
- topic detail page includes:
  - framing summary
  - research questions
  - relevant dimensions
  - topic timeline where available
  - linked records
- the `united-kingdom` actor page should surface the new historical records naturally through the existing actor-linked record flow
- dimension pages should surface Britain records alongside U.S., EU, and Chinese materials when tags overlap

## Timeline Behavior

The shelf should gain a historical timeline block, but it does not need exhaustive chronology in the first pass.

The initial timeline should focus on major rule-making milestones, not general British history.

Typical candidates could include:

- major imperial-commercial or trade-order turning points
- monetary-order milestones
- institutional or doctrinal landmarks
- arbitration or treaty milestones that illuminate British rule-making practice

The standard `#/timeline?topic=britain-imperial-rulemaking` route should work once the topic receives timeline-linked records.

## Recommended First Batch Size

The first substantive batch should be large enough to make the shelf immediately usable.

Recommended target:

- approximately `18-25` records

That range is large enough to create:

- mixed material types
- coverage across all three approved substantive layers
- enough internal density for comparison with existing topic shelves

## Testing and Validation

Implementation should add tests that lock in the shelf as a real research corpus.

The tests should cover:

- the new topic resolves correctly
- the new topic renders on the Topics index
- the topic detail page renders linked records and, where present, timeline material
- the shelf has a meaningful minimum count
- the shelf has mixed record types
- records propagate to the `united-kingdom` actor page
- relevant cross-topic propagation works where expected

## Non-Goals

This change should not:

- create a separate `British Empire` actor
- redesign the site architecture again
- turn the shelf into a general imperial-history archive
- require exhaustive chronological coverage before shipping
- replace existing `great-powers` or `theories-rulemaking` shelves

## Success Criteria

The design is successful when:

- the portal has a coherent historical Britain shelf that users can browse directly
- Britain becomes meaningfully comparable with the U.S., EU, and China across the rule-making dimensions
- the shelf contains a mixed corpus across trade, finance, and legal doctrine
- the `united-kingdom` actor page becomes historically usable rather than mostly contemporary
- the new topic improves retrieval and analysis without complicating the actor model
