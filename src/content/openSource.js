export const openSource = [
  {
    project: 'pandera',
    stars: '4.4K★',
    href: 'https://github.com/unionai-oss/pandera',
    blurb: 'statistical data-testing library for dataframes; 3 merged fixes to the pandas backend',
    prs: [
      {
        id: '#2404',
        href: 'https://github.com/unionai-oss/pandera/pull/2404',
        note: 'root-caused an NA-handling bug across all 11 masked nullable dtypes; aligned per-element coercion with pandas astype semantics, with 48 new tests and 100% patch coverage',
      },
      {
        id: '#2400',
        href: 'https://github.com/unionai-oss/pandera/pull/2400',
        note: 'column-parser ordering',
      },
      {
        id: '#2391',
        href: 'https://github.com/unionai-oss/pandera/pull/2391',
        note: 'categorical dtype-mismatch reporting',
      },
    ],
  },
  {
    project: 'scikit-learn',
    stars: '66K★',
    href: 'https://github.com/scikit-learn/scikit-learn',
    blurb: null,
    prs: [
      {
        id: '#34390',
        href: 'https://github.com/scikit-learn/scikit-learn/pull/34390',
        note: 'corrected an inverted threshold direction in the det_curve docstring',
      },
    ],
  },
];
