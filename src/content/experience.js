export const experience = [
  {
    id: 'iris',
    company: 'iris finance',
    role: 'software engineer intern',
    when: 'may 2026 to present',
    link: 'https://www.irisfinance.co',
    bullets: [
      'built an evaluation system for Iris’s production AI analyst (92 customer questions, every numeric answer verified against live source data) and used it to drive accuracy on held-out customer questions from 60% to 80%',
      'cut failed tool calls 30%; shipped a plan-first answer mode raising accuracy on the hardest question class (explaining why a metric changed) from 52% to 80%',
      'built the service resolving inconsistent product data across sales channels for 150+ enterprise clients: an LLM proposer maps vendor labels onto one canonical attribute set, a deterministic layer verifies every mapping before it lands (NestJS, PostgreSQL, BullMQ on Redis)',
    ],
  },
  {
    id: 'mira',
    company: 'mira',
    role: 'co-founder',
    when: 'mar 2026 to present',
    link: 'https://www.trymira.app',
    bullets: [
      'shipped an iPhone app detecting impairment (alcohol, fatigue) from eye movements captured with the front depth camera; live TestFlight program with a corpus of 1k+ recording sessions',
      'calibrated eye-tracking channel recovering 96-103% of true rotation amplitude on held-out runs, where Apple’s ARKit gaze recovers 24% from the same camera feed; sub-pixel precision resolving 0.3° rotations, about 50µm of iris movement',
      'distilled a SAM 2 pipeline into a from-scratch 258k-parameter iris-ellipse regressor (residual CNN, soft-argmax head) trained with real-eyelash occlusion composites: 150x smaller than its teacher, 10x quieter (8.3px to 0.8px) on held-out runs',
      'accepted to the Antler Founder Residency (NYC, ~3% acceptance)',
    ],
  },
  {
    id: 'fumble',
    company: 'fumble',
    role: 'co-founder & founding engineer',
    when: 'jun to nov 2025',
    link: null,
    bullets: [
      'real-time platform serving 2,000+ active users on Next.js, Socket.IO, and Redis',
      'set engineering standards for a 10-person team; landed a B2B pilot',
    ],
  },
  {
    id: 'nist',
    company: 'NIST',
    role: 'research intern',
    when: 'jun 2023 to aug 2024',
    link: 'https://www.nist.gov',
    bullets: [
      'built the preprocessing and regression pipeline for X-ray scattering data used to link a band of nanoscale molecular motion to polymer ballistic-impact toughness',
      {
        text: 'co-authored the resulting peer-reviewed paper in Soft Matter (Royal Society of Chemistry, 2026), a NIST and Army Research Lab collaboration; invited oral presenter at the ACS national conference',
        link: { label: 'doi', href: 'https://doi.org/10.1039/d6sm00313c' },
      },
    ],
  },
];
