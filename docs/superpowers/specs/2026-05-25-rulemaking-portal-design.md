# Great Powers and Rule-Making Portal Design

## Purpose

Build an English-first research portal and database on great powers and rule-making in the international economic system. The first release should be publishable as a public research site while using structured data from the start so the database can grow topic by topic.

The initial build will use a hybrid staged approach: a professional public portal with a modest seeded database, and a deeper pilot section on digital trade and e-commerce.

## Center of Gravity

The site will use a Topic Atlas + Database architecture.

- Topic pages are the main public entry point.
- A searchable database holds structured source records behind the pages.
- Actor and institution pages provide secondary ways to browse rule-making strategies and venues.
- Digital trade and e-commerce is the deep pilot for the first release.

This structure avoids a loose bibliography while also avoiding a database-only launch that would be hard for readers to navigate.

## Language Policy

The site is English-first.

- Interface text, topic pages, summaries, and metadata are in English.
- The data model supports Chinese and other-language titles, source notes, and original-language links.
- Each record must identify its language status: official original, official English, official bilingual pair, official summary, unofficial translation, English-only, Chinese-only, or site-created summary.
- Unofficial translations must never be presented as authoritative.

## Top-Level Site Structure

The first release will include these primary sections:

- Home
- Topics
- Digital Trade Pilot
- Database
- Actors
- Institutions
- Sources and Method

The homepage should function as a research portal immediately. It should show the project title, compact scope statement, search entry, featured digital trade pilot, latest records, and shortcuts into topics, actors, institutions, and the database.

## Topic Taxonomy

The broad atlas will include:

- Theories of international rule-making
- Great powers and rule-making
- United States and international rule-making
- European powers, the European Union, and international rule-making
- China and international rule-making
- Middle and small powers
- WTO institutional reform and negotiations
- Digital trade and e-commerce
- Cyber governance and global data governance
- International monetary system and financial regulation
- International investment
- Global AI governance

Each non-pilot topic gets a concise framing page plus starter records. The digital trade and e-commerce topic gets a richer treatment.

## Digital Trade and E-Commerce Pilot

The pilot should include:

- WTO e-commerce work, negotiation documents, ministerial materials, and joint statement initiative materials.
- Digital trade and e-commerce rules in major regional and bilateral agreements.
- Cross-border data flows, data localization, privacy, cybersecurity, and related governance rules.
- Platform regulation, source code, algorithms, electronic authentication, paperless trade, and consumer protection.
- Positions of the United States, European Union, China, and selected middle powers.
- Key institutional reports, think-tank reports, academic articles, books, and chapters.
- A focused timeline of major digital-trade rule-making events.

The pilot should demonstrate the full portal model: topic narrative, records, actor positions, institution links, timeline, and bibliography.

## Record Types

The database will use stable record types:

- Treaty or international agreement
- Institutional document
- Negotiation record
- National law or policy
- Case, dispute, or arbitral award
- Official statement
- Research report or think-tank paper
- Academic article
- Book or chapter
- Topic page
- Actor profile
- Institution profile
- Timeline entry

The implementation should keep these types distinct rather than mixing all materials into one article list.

## Core Record Fields

Every source record should support:

- Stable `id`
- `title`
- `alternateTitle`
- `recordType`
- `date` or `year`
- `actors`
- `jurisdictions`
- `institutions`
- `topics`
- `summary`
- `sourceAuthority`
- `languageStatus`
- `sourceLinks`
- `citation`
- `relatedRecordIds`
- `tags`

Research-library expansion fields should include:

- `zoteroKey`
- `driveFileId`
- `bibtexKey`
- `localNotes`

These fields should be optional in the first release but present in the model so Google Drive and Zotero materials can be linked later.

## Source Strategy

The first release will use a public authoritative seed corpus. Google Drive and Zotero are expansion paths, not prerequisites for launch.

Source priority:

- Official international materials from WTO, OECD, G20, UNCITRAL, UNCTAD, IMF, World Bank, WIPO, APEC, and related bodies.
- Government and regulator materials from USTR, EU institutions, China MOFCOM, CAC, MIIT, PBOC, and selected middle-power authorities.
- Treaty and agreement texts, including WTO materials, regional trade agreements, digital economy agreements, investment treaties, and institutional reform documents.
- Cases and disputes, including WTO disputes, investment arbitration, and domestic judicial cases with international rule-making impact.
- Literature, including institutional reports, think-tank papers, academic articles, books, and chapters.

For official legal and institutional materials, the site may include careful excerpts and visible source links. For scholarship and reports, the default is metadata, citation, summary, and external link unless open-access rights or permission clearly allow fuller treatment.

## Interface Behavior

The site should feel like a research database, not a marketing site.

Required behavior:

- Search across titles, summaries, actors, institutions, topics, source labels, and years.
- Filters by record type, topic, actor, jurisdiction, institution, source authority, language status, and date.
- Topic pages show curated explanations first, then linked database records.
- Record detail pages show metadata, source links, related topics, actors, institutions, and citation fields.
- Actor pages compare rule-making strategies, legal tools, institutional behavior, and major initiatives.
- Institution pages collect rule-making venues, documents, negotiation tracks, and related topics.
- The timeline page highlights major rule-making moments, especially for the digital trade pilot.

The visual style should be restrained, scholarly, and dense enough for repeated research use.

## Data Flow

Content should be stored as structured local data files. Rendering code should generate:

- Topic pages
- Record lists
- Record detail pages
- Actor pages
- Institution pages
- Timeline views
- Search and filter indexes

The source data should remain portable enough to support later import from Google Drive, Zotero, BibTeX, or CSV.

## Build and Publication Assumptions

The first implementation should be a static site unless a later requirement demands authentication, user accounts, or server-side editorial workflows.

The site should be easy to publish on GitHub Pages. Public verification should include:

- Local build success.
- Search and filtering checks.
- No broken internal routes.
- No obvious encoding corruption.
- Public site returns the new HTML/assets after deployment.

## Non-Goals for First Release

The first release will not attempt:

- Full coverage of every topic.
- Automated scraping.
- User accounts or private notes.
- Full-text hosting of copyrighted scholarship.
- A complete Google Drive or Zotero sync workflow.
- Exhaustive citation management.

The first release should establish the architecture and seed the database enough to make the portal credible and expandable.

## Success Criteria

The first release is successful when:

- The public site opens directly as a research portal.
- All major topics are represented.
- Digital trade and e-commerce has visibly deeper coverage than other topics.
- The database can be searched and filtered.
- Records expose source authority and language status clearly.
- Actor and institution views provide meaningful alternate navigation.
- The structure supports later expansion from Google Drive, Zotero, public sources, and manual curation.
