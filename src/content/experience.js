export const experience = [
  {
    id: 'iris',
    company: 'iris finance',
    role: 'software engineer intern',
    when: 'dec 2025 to present',
    link: 'https://www.irisfinance.co',
    bullets: [
      'built the AI knowledge base behind Fin, Iris’s customer- and employee-facing assistant: an evidence-grounded entity graph (Postgres/pgvector, S3, Claude) serving source-cited Q&A over REST and Slack',
      'vector ETL with semantic embeddings + anomaly detection, killing manual preprocessing for 150+ enterprise clients',
      'SKU attribute-enrichment across a 178-org multi-tenant backend, zero schema migrations',
    ],
  },
  {
    id: 'hazyeyes',
    company: 'hazyeyes',
    role: 'founding engineer',
    when: 'mar to jun 2026',
    link: null,
    bullets: [
      'ML pipeline detecting alcohol impairment from OKN eye-tracking (CatBoost, Optuna, MLflow); landed an enterprise pilot with an Australian logistics company',
      'diffusion-generated synthetic eye data → 0.95 AUC on unseen real subjects under nested-holdout validation',
    ],
  },
  {
    id: 'fumble',
    company: 'fumble',
    role: 'co-founder & founding engineer',
    when: 'jun to nov 2025',
    link: null,
    bullets: [
      'real-time event-driven platform for 2,000+ active users, built on Next.js, Socket.IO, and Redis pub/sub',
      'set engineering standards for a 10-person team; landed a B2B pilot and $45K in Azure credits',
    ],
  },
  {
    id: 'nist',
    company: 'NIST',
    role: 'data science intern',
    when: 'jun 2023 to aug 2024',
    link: 'https://www.nist.gov',
    bullets: [
      'automated the analysis of nanoscale X-ray scattering data end-to-end',
      'co-authored a peer-reviewed paper in Soft Matter (Royal Society of Chemistry); invited oral presenter at the ACS national conference',
    ],
  },
];
