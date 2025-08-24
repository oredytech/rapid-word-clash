
export const WORD_LISTS = {
  easy: [
    'chat', 'code', 'jeu', 'type', 'web', 'app', 'dev', 'bug', 'fix', 'run',
    'test', 'loop', 'data', 'file', 'save', 'load', 'menu', 'play', 'stop', 'go',
    'fast', 'slow', 'new', 'old', 'big', 'tiny', 'fun', 'cool', 'hot', 'ice'
  ],
  medium: [
    'fonction', 'variable', 'boucle', 'condition', 'tableau', 'objet', 'classe',
    'methode', 'propriete', 'evenement', 'callback', 'promise', 'async', 'await',
    'component', 'interface', 'typescript', 'javascript', 'react', 'framework',
    'library', 'package', 'module', 'import', 'export', 'default', 'const', 'let'
  ],
  hard: [
    'asynchrone', 'synchronisation', 'architecture', 'algorithmique', 'optimisation',
    'performance', 'refactorisation', 'encapsulation', 'polymorphisme', 'abstraction',
    'inheritance', 'composition', 'delegation', 'authentication', 'authorization',
    'middleware', 'interceptor', 'decorator', 'observable', 'subscription'
  ],
  expert: [
    'microservices', 'containerisation', 'orchestration', 'kubernetes', 'deployment',
    'infrastructure', 'scalability', 'availability', 'consistency', 'partitioning',
    'replication', 'sharding', 'caching', 'optimization', 'preprocessing',
    'postprocessing', 'serialization', 'deserialization', 'transformation'
  ]
};

export const getDifficultyWords = (level: number): string[] => {
  if (level <= 2) return WORD_LISTS.easy;
  if (level <= 5) return WORD_LISTS.medium;
  if (level <= 8) return WORD_LISTS.hard;
  return WORD_LISTS.expert;
};

export const getRandomWord = (level: number): string => {
  const words = getDifficultyWords(level);
  return words[Math.floor(Math.random() * words.length)];
};
