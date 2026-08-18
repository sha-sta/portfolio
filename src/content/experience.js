export const experience = [
  {
    id: 'iris',
    company: 'iris finance',
    role: 'software engineer intern',
    when: 'may 2026 to present',
    link: 'https://www.irisfinance.co',
    bullets: [
      'built an evaluation system for Fin, Iris’s production AI analyst; drove held-out accuracy from 60% to 80% and cut failed tool calls 30%',
      'built the product-data resolution service for 150+ enterprise clients: LLM proposer, deterministic verification layer (NestJS, PostgreSQL, Redis)',
    ],
  },
  {
    id: 'mira',
    company: 'mira',
    role: 'co-founder',
    when: 'mar 2026 to present',
    link: 'https://www.trymira.app',
    bullets: [
      'iPhone app detecting impairment (alcohol, fatigue) from eye movements; live TestFlight program with 1k+ recording sessions',
      'accepted to the Antler Founder Residency (NYC, ~3% acceptance)',
    ],
  },
  {
    id: 'nist',
    company: 'NIST',
    role: 'research intern',
    when: 'jun 2023 to aug 2024',
    link: 'https://www.nist.gov',
    bullets: [
      'built the analysis pipeline linking a band of nanoscale molecular motion to ballistic-impact toughness',
      {
        text: 'co-authored a peer-reviewed paper in Soft Matter; presented at the ACS national conference',
        link: { label: 'doi', href: 'https://doi.org/10.1039/d6sm00313c' },
      },
    ],
  },
];
