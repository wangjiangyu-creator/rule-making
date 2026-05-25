export const institutions = [
  {
    id: 'wto',
    name: 'World Trade Organization',
    shortName: 'WTO',
    type: 'international-organization',
    summary:
      'Central forum for multilateral trade rules, dispute settlement, ministerial decisions, and negotiation tracks including e-commerce.',
    topicIds: ['wto-reform', 'digital-trade-ecommerce', 'international-investment'],
  },
  {
    id: 'oecd',
    name: 'Organisation for Economic Co-operation and Development',
    shortName: 'OECD',
    type: 'international-organization',
    summary:
      'Produces policy standards, analytical reports, and soft-law instruments on digital economy, tax, AI, investment, and governance.',
    topicIds: [
      'digital-trade-ecommerce',
      'cyber-data-governance',
      'ai-governance',
      'international-investment',
    ],
  },
  {
    id: 'g20',
    name: 'Group of Twenty',
    shortName: 'G20',
    type: 'forum',
    summary:
      'High-level forum where major economies coordinate financial, digital economy, development, and trade-governance agendas.',
    topicIds: ['monetary-financial-regulation', 'digital-trade-ecommerce', 'ai-governance'],
  },
  {
    id: 'uncitral',
    name: 'United Nations Commission on International Trade Law',
    shortName: 'UNCITRAL',
    type: 'international-organization',
    summary:
      'Develops model laws, conventions, and legal standards relevant to electronic commerce, paperless trade, and investment dispute settlement reform.',
    topicIds: ['digital-trade-ecommerce', 'international-investment'],
  },
  {
    id: 'imf',
    name: 'International Monetary Fund',
    shortName: 'IMF',
    type: 'international-organization',
    summary:
      'Shapes monetary, financial stability, surveillance, capital-flow, and debt-governance rules and policy frameworks.',
    topicIds: ['monetary-financial-regulation'],
  },
  {
    id: 'world-bank',
    name: 'World Bank Group',
    shortName: 'World Bank',
    type: 'international-organization',
    summary:
      'Influences development finance, investment climate, digital development, and regulatory-capacity agendas.',
    topicIds: ['international-investment', 'digital-trade-ecommerce', 'monetary-financial-regulation'],
  },
  {
    id: 'asean',
    name: 'Association of Southeast Asian Nations',
    shortName: 'ASEAN',
    type: 'regional-organization',
    summary:
      'Provides a regional platform for trade, investment, digital economy, and connectivity rule-making in Southeast Asia and wider Asian agreements.',
    topicIds: ['middle-small-powers', 'digital-trade-ecommerce', 'international-investment'],
  },
  {
    id: 'un',
    name: 'United Nations',
    shortName: 'UN',
    type: 'international-organization',
    summary:
      'Sets broad multilateral agendas through General Assembly resolutions, specialized bodies, treaty processes, and technical institutions.',
    topicIds: ['ai-governance', 'cyber-data-governance', 'international-investment'],
  },
  {
    id: 'unesco',
    name: 'United Nations Educational, Scientific and Cultural Organization',
    shortName: 'UNESCO',
    type: 'international-organization',
    summary:
      'Develops global normative instruments and implementation tools on ethics, education, culture, science, and emerging technologies, including AI governance.',
    topicIds: ['ai-governance'],
  },
  {
    id: 'g7',
    name: 'Group of Seven',
    shortName: 'G7',
    type: 'forum',
    summary:
      'Coordinates major advanced-economy positions on economic security, digital governance, AI, finance, and standards.',
    topicIds: ['great-powers', 'ai-governance', 'digital-trade-ecommerce', 'monetary-financial-regulation'],
  },
  {
    id: 'fsb',
    name: 'Financial Stability Board',
    shortName: 'FSB',
    type: 'standard-setting-body',
    summary:
      'Coordinates international financial stability standards and policy recommendations for banking, markets, payment systems, and crypto-assets.',
    topicIds: ['monetary-financial-regulation', 'cyber-data-governance'],
  },
  {
    id: 'basel-committee',
    name: 'Basel Committee on Banking Supervision',
    shortName: 'BCBS',
    type: 'standard-setting-body',
    summary:
      'Develops global prudential banking standards that shape national financial regulation through soft-law implementation.',
    topicIds: ['monetary-financial-regulation'],
  },
  {
    id: 'cjeu',
    name: 'Court of Justice of the European Union',
    shortName: 'CJEU',
    type: 'court',
    summary:
      'Interprets EU law in ways that shape cross-border data transfer, platform governance, market access, and external regulatory effects.',
    topicIds: ['european-union', 'cyber-data-governance', 'digital-trade-ecommerce'],
  },
  {
    id: 'council-of-europe',
    name: 'Council of Europe',
    shortName: 'CoE',
    type: 'regional-organization',
    summary:
      'Develops treaty-based and soft-law instruments on human rights, data protection, cybercrime, and artificial intelligence governance.',
    topicIds: ['cyber-data-governance', 'ai-governance', 'european-union'],
  },
  {
    id: 'apec',
    name: 'Asia-Pacific Economic Cooperation',
    shortName: 'APEC',
    type: 'forum',
    summary:
      'Provides an Asia-Pacific forum for voluntary privacy, data transfer, digital economy, and trade facilitation frameworks.',
    topicIds: ['middle-small-powers', 'digital-trade-ecommerce', 'cyber-data-governance'],
  },
  {
    id: 'icsid',
    name: 'International Centre for Settlement of Investment Disputes',
    shortName: 'ICSID',
    type: 'international-organization',
    summary:
      'Administers investor-state dispute settlement under the ICSID Convention and related arbitration, mediation, and fact-finding rules.',
    topicIds: ['international-investment'],
  },
  {
    id: 'unctad',
    name: 'United Nations Conference on Trade and Development',
    shortName: 'UNCTAD',
    type: 'international-organization',
    summary:
      'Produces investment policy research, development-oriented trade analysis, digital economy reports, and international investment agreement data.',
    topicIds: ['international-investment', 'digital-trade-ecommerce', 'wto-reform'],
  },
  {
    id: 'iosco',
    name: 'International Organization of Securities Commissions',
    shortName: 'IOSCO',
    type: 'standard-setting-body',
    summary:
      'Develops international securities regulation principles and works with CPMI on financial market infrastructure standards.',
    topicIds: ['monetary-financial-regulation'],
  },
  {
    id: 'cpmi',
    name: 'Committee on Payments and Market Infrastructures',
    shortName: 'CPMI',
    type: 'standard-setting-body',
    summary:
      'Develops payment, clearing, settlement, and financial market infrastructure standards through the Bank for International Settlements.',
    topicIds: ['monetary-financial-regulation'],
  },
  {
    id: 'nist',
    name: 'National Institute of Standards and Technology',
    shortName: 'NIST',
    type: 'regulator',
    summary:
      'Develops technical standards and risk-management frameworks with international influence, including cybersecurity and artificial intelligence guidance.',
    topicIds: ['united-states', 'ai-governance', 'cyber-data-governance'],
  },
  {
    id: 'ustr',
    name: 'Office of the United States Trade Representative',
    shortName: 'USTR',
    type: 'government-agency',
    summary:
      'Leads US trade negotiation and trade policy implementation, including digital trade chapters, WTO policy, and foreign trade barrier reporting.',
    topicIds: ['united-states', 'digital-trade-ecommerce', 'wto-reform'],
  },
  {
    id: 'us-state-department',
    name: 'United States Department of State',
    shortName: 'State Department',
    type: 'government-agency',
    summary:
      'Conducts US diplomacy on cyberspace, digital policy, data governance, technology standards, and international institutional coordination.',
    topicIds: ['united-states', 'cyber-data-governance', 'ai-governance'],
  },
];
