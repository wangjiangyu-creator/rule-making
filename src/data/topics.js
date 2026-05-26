export const topics = [
  {
    id: 'theories-rulemaking',
    title: 'Theories of International Rule-Making',
    shortTitle: 'Theories',
    summary:
      'Conceptual approaches to rule-making authority, institutional design, legalization, power, legitimacy, and regime complexity.',
    pilot: false,
    questions: [
      'How do international law and international relations explain rule creation?',
      'When do great powers create, reshape, or bypass international rules?',
      'How do legitimacy, consent, coercion, and expertise interact in rule-making?',
    ],
    dimensionIds: [
      'objective-setting',
      'legitimacy-management',
      'agenda-setting',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'great-powers',
    title: 'Great Powers and Rule-Making',
    shortTitle: 'Great Powers',
    summary:
      'Comparative study of how leading powers use institutions, markets, domestic law, diplomacy, and standards to shape international economic rules.',
    pilot: false,
    questions: [
      'Which tools do great powers use to project regulatory preferences internationally?',
      'How do hegemonic, multipolar, and contested settings change rule-making strategies?',
    ],
    dimensionIds: [
      'objective-setting',
      'agenda-setting',
      'coalition-consensus-building',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'britain-imperial-rulemaking',
    title: 'Britain and Imperial Rule-Making',
    shortTitle: 'Britain and Empire',
    summary:
      'Historical study of how Britain shaped international economic and legal rules through empire, trade, finance, naval and market power, legal doctrine, and institutional practice.',
    pilot: false,
    questions: [
      'How did Britain set objectives and define the terms of international commercial and legal order during the period of imperial dominance?',
      'Through which instruments did Britain turn imperial, naval, financial, and legal power into durable international rules?',
      'Which elements of British rule-making survived into later monetary, commercial, and institutional orders?',
    ],
    dimensionIds: [
      'objective-setting',
      'agenda-setting',
      'coalition-consensus-building',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'united-states',
    title: 'United States and International Rule-Making',
    shortTitle: 'United States',
    summary:
      'US rule-making through trade agreements, financial regulation, sanctions, standards, development finance, and institutional leadership.',
    pilot: false,
    questions: [
      'How has the United States combined market power, legal design, and institutional leadership?',
      'When does US domestic law operate as a source of international rule pressure?',
    ],
    dimensionIds: [
      'objective-setting',
      'agenda-setting',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'european-union',
    title: 'European Powers, the European Union, and International Rule-Making',
    shortTitle: 'Europe and EU',
    summary:
      'European and EU rule-making through market access, regulatory power, treaty practice, institutional diplomacy, and external governance.',
    pilot: false,
    questions: [
      'How does the EU convert internal regulation into external rule-making influence?',
      'How do European powers use institutional and legal expertise in global rule formation?',
    ],
    dimensionIds: [
      'legitimacy-management',
      'agenda-setting',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'china',
    title: 'China and International Rule-Making',
    shortTitle: 'China',
    summary:
      "China's participation in, adaptation to, and shaping of rules in trade, investment, finance, digital governance, development, and standards.",
    pilot: false,
    questions: [
      'Where does China seek reform within existing institutions, and where does it build alternatives?',
      'How do Chinese domestic regulatory choices affect international rule-making?',
    ],
    subtopics: [
      {
        id: 'china-ifda-leadership',
        title: 'China and IFDA',
        summary:
          'China-backed agenda-setting, coalition diplomacy, drafting practice, implementation advocacy, and scholarship around the WTO Investment Facilitation for Development Agreement.',
        recordIds: [
          'china-possible-elements-investment-facilitation-2017',
          'friends-ifd-informal-dialogue-proposal-2017',
          'ifd-joint-ministerial-statement-mc11-2017',
          'ifd-joint-ministerial-statement-shanghai-2019',
          'ifd-joint-statement-mc12-work-plan-2021',
          'china-turkey-businesspersons-investment-facilitation-2021',
          'ifd-text-substantially-concluded-china-mission-2022',
          'mofcom-ifd-agreement-benefits-china-2023',
          'state-council-china-key-role-ifd-text-2023',
          'china-wto-public-forum-ifd-session-2023',
          'wang-wentao-mc13-ifd-ministerial-statement-2024',
          'ifd-mc13-annex4-request-2024',
          'china-general-council-ifd-annex4-statement-2025',
          'ifd-mc14-implementation-launch-mofcom-2026',
          'foreign-investment-guide-china-ifd-2024',
          'han-china-approach-investment-facilitation-2025',
          'calvert-political-economy-ifda-brazil-india-china-2025',
          'polanco-ifda-actors-focused-approach-2025',
          'zou-plurilateral-pathways-china-investment-practice-2026',
        ],
      },
      {
        id: 'china-digital-trade-rulemaking',
        title: 'China and Digital Trade Rule-making',
        summary:
          'China participation in WTO e-commerce, DEPA accession, regional digital-economy agreements, and implementation of negotiated digital trade rules.',
        recordIds: [
          'wto-joint-statement-electronic-commerce-2019',
          'wto-agreement-electronic-commerce-2024',
          'china-wto-ecommerce-negotiations-contribution-2023',
          'china-cosponsors-wto-ecommerce-annex4-request-2025',
          'china-welcomes-wto-ecommerce-interim-arrangements-2026',
          'china-beijing-wto-ecommerce-agreement-pilot-2025',
          'wto-national-workshop-digital-trade-china-2024',
          'china-depa-application-2021',
          'china-depa-accession-working-group-2022',
          'china-depa-detroit-ministerial-2023',
          'china-depa-fifth-chief-negotiators-meeting-2024',
          'china-depa-accession-ministerial-2024',
          'rcep-electronic-commerce-chapter-2020',
          'asean-china-digital-ecosystem-joint-statement-2024',
          'acfta-3-upgrade-protocol-2025',
          'gao-digital-or-trade-china-us-2018',
          'zhang-china-digital-trade-evolution-2024',
        ],
      },
      {
        id: 'china-international-financial-system-reform',
        title: 'China and International Financial System Reform',
        summary:
          'China participation in reforming the international monetary system, IMF governance, regional reserve arrangements, development-finance institutions, and international financial regulatory standards.',
        recordIds: [
          'zhou-reform-international-monetary-system-2009',
          'basel-committee-expansion-china-2009',
          'cmim-agreement-2010',
          'brics-contingent-reserve-arrangement-2014',
          'brics-new-development-bank-agreement-2014',
          'imf-quota-governance-reforms-effective-2016',
          'pbc-rmb-sdr-inclusion-2016',
          'aiib-articles-of-agreement-2015',
          'fsb-peer-review-china-2015',
          'amro-agreement-2016',
          'g20-hangzhou-communique-2016',
          'imfc-statement-pan-gongsheng-2024',
          'imfc-statement-pan-gongsheng-2026',
          'bri-debt-sustainability-framework-participating-countries-2019',
          'bri-debt-sustainability-framework-market-access-countries-2023',
          'aiib-corporate-strategy-2021-2030',
          'ndb-general-strategy-2022-2026',
          'brics-kazan-declaration-2024',
          'wu-remaking-bretton-woods-aiib-2018',
          'zeng-chinese-views-global-economic-governance-2019',
        ],
      },
    ],
    dimensionIds: [
      'objective-setting',
      'agenda-setting',
      'coalition-consensus-building',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'middle-small-powers',
    title: 'Middle and Small Powers',
    shortTitle: 'Middle and Small Powers',
    summary:
      'Coalition-building, norm entrepreneurship, forum selection, and technical leadership by middle and small powers.',
    pilot: false,
    questions: [
      'How do smaller states shape rules despite limited market or military power?',
      'Which issue areas reward coalition-building and technical expertise?',
    ],
    dimensionIds: [
      'agenda-setting',
      'coalition-consensus-building',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'wto-reform',
    title: 'WTO Institutional Reform and Negotiations',
    shortTitle: 'WTO Reform',
    summary:
      'Rule-making in WTO reform, negotiation architecture, dispute settlement, plurilateral initiatives, and development debates.',
    pilot: false,
    questions: [
      'How is WTO rule-making changing after the single-undertaking model?',
      'What are the legal and political implications of plurilateral negotiation tracks?',
    ],
    dimensionIds: [
      'legitimacy-management',
      'agenda-setting',
      'coalition-consensus-building',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'digital-trade-ecommerce',
    title: 'Digital Trade and E-Commerce',
    shortTitle: 'Digital Trade',
    summary:
      'A topic covering WTO e-commerce work, digital trade chapters, data flows, localization, paperless trade, platform rules, source code, and digital economy agreements.',
    pilot: false,
    questions: [
      'How do digital trade rules allocate regulatory space and market-access commitments?',
      'How do US, EU, Chinese, and middle-power approaches differ?',
      'Which institutions are becoming central venues for digital economic rule-making?',
    ],
    dimensionIds: [
      'legitimacy-management',
      'agenda-setting',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'cyber-data-governance',
    title: 'Cyber Governance and Global Data Governance',
    shortTitle: 'Cyber and Data',
    summary:
      'Cybersecurity, data governance, cross-border data regulation, privacy, security exceptions, and institutional fragmentation.',
    pilot: false,
    questions: [
      'How are data and cyber rules split across trade, security, human rights, and technical institutions?',
      'How do national security claims affect global economic rule-making?',
    ],
    dimensionIds: [
      'objective-setting',
      'legitimacy-management',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'monetary-financial-regulation',
    title: 'International Monetary System and Financial Regulation',
    shortTitle: 'Money and Finance',
    summary:
      'Rule-making in monetary governance, financial stability, banking regulation, payment systems, sovereign debt, and development finance.',
    pilot: false,
    questions: [
      'How do monetary and financial rules reflect institutional expertise and power asymmetries?',
      'How do crises reshape rule-making authority?',
    ],
    dimensionIds: [
      'objective-setting',
      'legitimacy-management',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'international-investment',
    title: 'International Investment',
    shortTitle: 'Investment',
    summary:
      'Investment treaties, dispute settlement reform, screening regimes, facilitation, sustainable investment, and state regulatory space.',
    pilot: false,
    questions: [
      'How are investment rules being rebalanced between protection, facilitation, and regulation?',
      'Which actors shape ISDS reform and investment facilitation?',
    ],
    subtopics: [
      {
        id: 'investment-facilitation-for-development',
        title: 'Investment Facilitation for Development (IFDA)',
        summary:
          'WTO investment-facilitation rule-making from early dialogue and draft text to Annex 4 incorporation debates, implementation planning, and China-linked diplomacy.',
        recordIds: [
          'wto-investment-facilitation-development-agreement-2024',
          'china-possible-elements-investment-facilitation-2017',
          'friends-ifd-informal-dialogue-proposal-2017',
          'ifd-joint-ministerial-statement-mc11-2017',
          'ifd-joint-ministerial-statement-shanghai-2019',
          'ifd-joint-statement-mc12-work-plan-2021',
          'china-turkey-businesspersons-investment-facilitation-2021',
          'ifd-mc13-annex4-request-2024',
          'ifd-mc14-implementation-launch-mofcom-2026',
          'foreign-investment-guide-china-ifd-2024',
          'han-china-approach-investment-facilitation-2025',
          'calvert-political-economy-ifda-brazil-india-china-2025',
          'polanco-ifda-actors-focused-approach-2025',
          'zou-plurilateral-pathways-china-investment-practice-2026',
          'unctad-investment-facilitation-iias-trends-policy-options-2023',
          'unctad-facilitating-investment-sdgs-2022',
          'world-bank-global-investment-competitiveness-report-2019-2020',
        ],
      },
    ],
    dimensionIds: [
      'legitimacy-management',
      'agenda-setting',
      'norm-entrepreneurship-drafting-power',
    ],
  },
  {
    id: 'ai-governance',
    title: 'Global AI Governance',
    shortTitle: 'AI Governance',
    summary:
      'AI standards, safety governance, model regulation, compute controls, risk management, and institutional competition over AI rules.',
    pilot: false,
    questions: [
      'Which institutions are competing to define global AI governance rules?',
      'How do trade, security, standards, and human-rights frameworks interact?',
    ],
    dimensionIds: [
      'objective-setting',
      'legitimacy-management',
      'coalition-consensus-building',
      'norm-entrepreneurship-drafting-power',
    ],
  },
];
