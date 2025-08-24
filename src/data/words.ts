
export const WORD_LISTS = {
  easy: [
    // Mots français courts
    'chat', 'chien', 'eau', 'feu', 'air', 'sol', 'mer', 'lune', 'oui', 'non',
    'beau', 'bon', 'mal', 'bien', 'jour', 'nuit', 'main', 'pied', 'œil', 'nez',
    'vie', 'mort', 'jeu', 'joie', 'peur', 'ami', 'roi', 'fils', 'mère', 'père',
    // Nombres et chiffres
    '1', '2', '3', '10', '20', '100',
    'un', 'deux', 'trois', 'dix', 'cent',
    // Mots développement courts
    'app', 'web', 'css', 'html', 'js', 'php', 'sql', 'git', 'api', 'url'
  ],
  medium: [
    // Mots français moyens
    'maison', 'école', 'travail', 'famille', 'voyage', 'musique', 'nature', 'temps',
    'histoire', 'science', 'culture', 'société', 'liberté', 'respect', 'amitié',
    'bonheur', 'tristesse', 'colère', 'surprise', 'cuisine', 'santé', 'sport',
    'lecture', 'écriture', 'peinture', 'danse', 'théâtre', 'cinéma', 'photo',
    // Nombres plus complexes
    '2024', '1000', '500', '250', '1.5', '3.14',
    'mille', 'million', 'milliard', 'première', 'seconde', 'troisième',
    // Développement moyen
    'function', 'variable', 'array', 'object', 'string', 'number', 'boolean',
    'component', 'props', 'state', 'hooks', 'router', 'server', 'client'
  ],
  hard: [
    // Mots français complexes
    'développement', 'technologie', 'intelligence', 'communication', 'transformation',
    'organisation', 'administration', 'réglementation', 'démocratisation', 'globalisation',
    'individualisation', 'personnalisation', 'professionnalisation', 'spécialisation',
    'caractéristique', 'responsabilité', 'disponibilité', 'compatibilité',
    // Expressions et mots composés
    'c\'est-à-dire', 'quelque chose', 'n\'importe quoi', 'tout à fait', 'bien sûr',
    'Marie-Claire', 'Jean-Pierre', 'Île-de-France', 'États-Unis', 'Royaume-Uni',
    // Développement avancé
    'asynchronous', 'synchronization', 'authentication', 'authorization', 'middleware',
    'polymorphism', 'encapsulation', 'inheritance', 'abstraction', 'composition'
  ],
  expert: [
    // Phrases courtes
    'Bonjour le monde !', 'Comment ça va ?', 'Très bien merci.', 'À bientôt !',
    'Je suis développeur.', 'Quel âge avez-vous ?', 'Il fait beau aujourd\'hui.',
    'Où habitez-vous ?', 'Que faites-vous ?', 'C\'est formidable !',
    // Expressions techniques
    'console.log()', 'npm install', 'git commit -m', 'docker run', 'sudo apt update',
    'SELECT * FROM', 'INSERT INTO', 'UPDATE SET', 'DELETE FROM', 'CREATE TABLE',
    // Mots très complexes
    'anticonstitutionnellement', 'hippopotomonstrosesquippedaliophobie',
    'pneumonoultramicroscopicsilicovolcanoconiose', 'floccinaucinihilipilification',
    'supercalifragilisticexpialidocious', 'pseudopseudohypoparathyroidism'
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
