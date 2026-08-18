export const projects = [
  {
    id: 'ivry',
    name: 'ivry',
    tagline: 'prediction-market intelligence',
    badge: null,
    bullets: [
      'real-time pipeline normalizing fragmented Kalshi, Polymarket, and Manifold market data',
      'entity resolution across markets (HDBSCAN + LLM verification); caching layer cut latency 95%',
    ],
    links: [{ label: 'github', href: 'https://github.com/sumeirsoni/Ivry' }],
  },
  {
    id: 'speech-signals',
    name: 'speech signals',
    tagline: 'broadcast speech, traded',
    badge: null,
    bullets: [
      'live broadcast audio → streaming Whisper ASR → spike detection → automated Kalshi execution',
      'found ~18¢/contract of mispricing around on-air mentions; traded it live on Kalshi',
    ],
    links: [{ label: 'github', href: 'https://github.com/sha-sta/speech-signal-pipeline' }],
  },
  {
    id: 'galatea',
    name: 'galatea',
    tagline: 'graph nets for water quality',
    badge: '1st place, Maryland · Stockholm Junior Water Prize',
    bullets: [
      'dual-model architecture (graph matrix factorization + GNN) imputing missing spatiotemporal water-quality data',
      'replaced $20K+ commercial hardware with a $385 sensor suite at near-industry accuracy',
    ],
    links: [{ label: 'github', href: 'https://github.com/sha-sta/GALATEA' }],
  },
  {
    id: 'marketbrain',
    name: 'marketbrain',
    tagline: 'a knowledge graph that refuses to hallucinate',
    badge: null,
    bullets: [
      'self-updating financial knowledge graph from news and SEC filings; a verbatim-evidence gate + ticker/CIK hard-key resolution block fabricated entities',
      'the gate caught every ungrounded fact in evaluation; hybrid vector + full-text RAG serves source-cited Q&A',
    ],
    links: [{ label: 'github', href: 'https://github.com/sha-sta/market-brain' }],
  },
];
