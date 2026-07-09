export const projects = [
  {
    id: 'ivry',
    name: 'ivry',
    tagline: 'prediction-market intelligence',
    badge: null,
    bullets: [
      'real-time pipeline normalizing fragmented Kalshi and Polymarket market data',
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
      'falsely-triggered speech spikes were systematically overpriced: +15.9pp hit-rate on a pre-registered sealed holdout',
    ],
    links: [{ label: 'github', href: 'https://github.com/sha-sta/speech-signal-pipeline' }],
  },
  {
    id: 'galatea',
    name: 'galatea',
    tagline: 'graph nets for water quality',
    badge: '1st place, Maryland · Stockholm Junior Water Prize',
    bullets: [
      'dual-model architecture (graph matrix factorization + GNN) imputing missing spatiotemporal data; 0.27 mg/L MAE predicting biochemical oxygen demand, 22.85% better than existing low-cost models',
      'a $385 sensor standing in for $20K+ commercial hardware',
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
      'in a gate-on/off eval, 11.6% (22/189) of asserted facts had ungrounded evidence and the deterministic gate caught every one; hybrid vector + full-text RAG serves source-cited Q&A',
    ],
    links: [{ label: 'github', href: 'https://github.com/sha-sta/market-brain' }],
  },
];
