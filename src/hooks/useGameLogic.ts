import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Word, GameStats } from '../types/game';
import { getRandomWord } from '../data/words';

const INITIAL_GAME_STATE: GameState = {
  isPlaying: false,
  isPaused: false,
  score: 0,
  level: 1,
  lives: 3,
  words: [],
  currentInput: '',
  wordsTyped: 0,
  gameSpeed: 1,
  spawnRate: 6000,
};

const INITIAL_STATS: GameStats = {
  totalWordsTyped: 0,
  accuracy: 100,
  wpm: 0,
  timeElapsed: 0,
  highScore: 0,
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  
  const gameLoopRef = useRef<number>();
  const spawnTimerRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Charger le high score depuis localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('typing-game-high-score');
    if (savedHighScore) {
      setStats(prev => ({ ...prev, highScore: parseInt(savedHighScore, 10) }));
    }
  }, []);

  // Sauvegarder le high score
  const saveHighScore = useCallback((score: number) => {
    if (score > stats.highScore) {
      localStorage.setItem('typing-game-high-score', score.toString());
      setStats(prev => ({ ...prev, highScore: score }));
    }
  }, [stats.highScore]);

  // Générer un nouveau mot
  const spawnWord = useCallback(() => {
    const word: Word = {
      id: Math.random().toString(36).substr(2, 9),
      text: getRandomWord(gameState.level),
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: -50,
      speed: 30 + (gameState.level * 8),
      isBeingTyped: false,
      typedText: '',
    };

    setGameState(prev => ({
      ...prev,
      words: [...prev.words, word]
    }));
  }, [gameState.level]);

  // Démarrer le jeu
  const startGame = useCallback(() => {
    console.log('Démarrage du jeu...');
    setGameState(prev => ({
      ...INITIAL_GAME_STATE,
      isPlaying: true,
      level: 1,
      lives: 3,
    }));
    setStats(prev => ({ ...INITIAL_STATS, highScore: prev.highScore }));
    setGameStartTime(Date.now());
    lastSpawnRef.current = Date.now();
    lastFrameTimeRef.current = performance.now();
  }, []);

  // Arrêter le jeu
  const endGame = useCallback(() => {
    console.log('Fin du jeu - Score final:', gameState.score);
    setGameState(prev => ({ ...prev, isPlaying: false }));
    saveHighScore(gameState.score);
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
    }
  }, [gameState.score, saveHighScore]);

  // Gérer la saisie utilisateur avec élimination progressive
  const handleInput = useCallback((input: string) => {
    console.log('Saisie utilisateur:', input);
    setGameState(prev => {
      let newState = { ...prev, currentInput: input };
      
      if (input.length === 0) {
        // Réinitialiser tous les mots si l'input est vide
        newState.words = prev.words.map(word => ({
          ...word,
          isBeingTyped: false,
          typedText: ''
        }));
        return newState;
      }

      // Chercher un mot qui commence par l'input actuel
      const matchingWord = prev.words.find(word => 
        word.text.toLowerCase().startsWith(input.toLowerCase())
      );

      if (matchingWord) {
        console.log('Mot en cours de frappe:', matchingWord.text, 'Input:', input);
        
        // Marquer ce mot comme étant tapé et mettre à jour le texte tapé
        newState.words = prev.words.map(word =>
          word.id === matchingWord.id
            ? { ...word, isBeingTyped: true, typedText: input }
            : { ...word, isBeingTyped: false, typedText: '' }
        );

        // Si le mot est complètement tapé, l'éliminer
        if (input.toLowerCase() === matchingWord.text.toLowerCase()) {
          console.log('Mot complètement éliminé:', matchingWord.text);
          newState.words = newState.words.filter(word => word.id !== matchingWord.id);
          newState.score = prev.score + (matchingWord.text.length * 10);
          newState.wordsTyped = prev.wordsTyped + 1;
          newState.currentInput = '';

          // Vérifier passage au niveau suivant
          if (newState.wordsTyped % 10 === 0) {
            newState.level = prev.level + 1;
            newState.spawnRate = Math.max(500, prev.spawnRate - 200);
            console.log('Niveau suivant:', newState.level);
          }
        }
      } else {
        // Aucun mot ne correspond, réinitialiser tous les mots
        newState.words = prev.words.map(word => ({
          ...word,
          isBeingTyped: false,
          typedText: ''
        }));
      }

      return newState;
    });
  }, []);

  // Boucle de jeu principale (utilise un delta temps basé sur rAF)
  const gameLoop = useCallback((time: number) => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const deltaSec = lastFrameTimeRef.current ? (time - lastFrameTimeRef.current) / 1000 : 0;
    lastFrameTimeRef.current = time;

    setGameState(prev => {
      // Déplacement basé sur la vitesse en px/s et le delta temps
      let newWords = prev.words.map(word => ({
        ...word,
        y: word.y + (word.speed * deltaSec)
      }));

      // Supprimer les mots qui ont atteint le bas et enlever une vie
      const wordsAtBottom = newWords.filter(word => word.y > window.innerHeight);
      if (wordsAtBottom.length > 0) {
        console.log('Mot(s) raté(s):', wordsAtBottom.map(w => w.text));
        newWords = newWords.filter(word => word.y <= window.innerHeight);
        
        const newLives = prev.lives - wordsAtBottom.length;
        if (newLives <= 0) {
          console.log('Plus de vies - Game Over');
          return { ...prev, lives: 0, words: [] };
        }
        
        return { ...prev, words: newWords, lives: newLives };
      }

      return { ...prev, words: newWords };
    });

    // Spawner de nouveaux mots (basé sur l'horloge epoch)
    const now = Date.now();
    if (now - lastSpawnRef.current > gameState.spawnRate) {
      spawnWord();
      lastSpawnRef.current = now;
    }

    // Mettre à jour les statistiques
    const timeElapsed = (now - gameStartTime) / 1000;
    const wpm = timeElapsed > 0 ? (gameState.wordsTyped / timeElapsed) * 60 : 0;
    
    setStats(prev => ({
      ...prev,
      timeElapsed,
      wpm: Math.round(wpm),
      totalWordsTyped: gameState.wordsTyped
    }));

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.isPaused, gameState.spawnRate, gameState.wordsTyped, gameStartTime, spawnWord]);

  // Démarrer/arrêter la boucle de jeu
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      lastFrameTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    // Game Over si plus de vies
    if (gameState.isPlaying && gameState.lives <= 0) {
      endGame();
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.lives, gameLoop, endGame]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  return {
    gameState,
    stats,
    startGame,
    endGame,
    handleInput,
    togglePause,
  };
};
