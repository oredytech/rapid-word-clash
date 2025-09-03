import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Word, GameStats } from '../types/game';
import { getRandomWord } from '../data/words';
import { soundManager } from '../utils/soundEffects';
import { GameOptions } from './useGameOptions';

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
  spawnRate: 3000,
};

const INITIAL_STATS: GameStats = {
  totalWordsTyped: 0,
  accuracy: 100,
  wpm: 0,
  timeElapsed: 0,
  highScore: 0,
};

export const useGameLogic = (gameOptions: GameOptions) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [wordsAtBottom, setWordsAtBottom] = useState<Set<string>>(new Set());
  
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

  // Appliquer le volume des sons selon les options
  useEffect(() => {
    if (gameOptions.soundEnabled) {
      soundManager.setVolume(gameOptions.soundVolume / 100);
    } else {
      soundManager.setVolume(0);
    }
  }, [gameOptions.soundVolume, gameOptions.soundEnabled]);

  // Sauvegarder le high score
  const saveHighScore = useCallback((score: number) => {
    if (score > stats.highScore) {
      localStorage.setItem('typing-game-high-score', score.toString());
      setStats(prev => ({ ...prev, highScore: score }));
    }
  }, [stats.highScore]);

  // Calculer les paramètres selon le niveau et les options
  const getGameParameters = useCallback((level: number) => {
    const baseSpeed = 30;
    const speedIncrement = 15;
    const baseSpawnRate = 3000;
    const spawnRateDecrease = 200;
    const minSpawnRate = 800;
    
    // Appliquer les modificateurs de difficulté
    const difficultyModifiers = {
      facile: { speedMultiplier: 0.7, spawnRateMultiplier: 1.3 },
      normal: { speedMultiplier: 1.0, spawnRateMultiplier: 1.0 },
      difficile: { speedMultiplier: 1.4, spawnRateMultiplier: 0.7 }
    }[gameOptions.difficulty];
    
    return {
      wordSpeed: (baseSpeed + (level - 1) * speedIncrement) * difficultyModifiers.speedMultiplier,
      spawnRate: Math.max(
        minSpawnRate, 
        (baseSpawnRate - (level - 1) * spawnRateDecrease) * difficultyModifiers.spawnRateMultiplier
      )
    };
  }, [gameOptions.difficulty]);

  // Générer un nouveau mot
  const spawnWord = useCallback(() => {
    const { wordSpeed } = getGameParameters(gameState.level);
    
    const word: Word = {
      id: Math.random().toString(36).substr(2, 9),
      text: getRandomWord(gameState.level),
      x: Math.random() * (window.innerWidth - 200) + 100,
      y: -50,
      speed: wordSpeed,
      isBeingTyped: false,
      typedText: '',
    };

    setGameState(prev => ({
      ...prev,
      words: [...prev.words, word]
    }));
  }, [gameState.level, getGameParameters]);

  // Démarrer le jeu
  const startGame = useCallback(() => {
    console.log('Démarrage du jeu...');
    const { spawnRate } = getGameParameters(1);
    
    // Calculer les vies selon la difficulté
    const baseLives = 3;
    const livesBonus = {
      facile: 1,
      normal: 0,
      difficile: -1
    }[gameOptions.difficulty];
    
    setGameState(prev => ({
      ...INITIAL_GAME_STATE,
      isPlaying: true,
      level: 1,
      lives: baseLives + livesBonus,
      spawnRate,
    }));
    setStats(prev => ({ ...INITIAL_STATS, highScore: prev.highScore }));
    setGameStartTime(Date.now());
    lastSpawnRef.current = Date.now();
    lastFrameTimeRef.current = performance.now();
  }, [getGameParameters, gameOptions.difficulty]);

  // Arrêter le jeu
  const endGame = useCallback(() => {
    console.log('Fin du jeu - Score final:', gameState.score);
    setGameState(prev => ({ ...prev, isPlaying: false }));
    saveHighScore(gameState.score);
    
    // Stop all sound effects
    if (gameOptions.soundEnabled) {
      soundManager.stopAlert();
    }
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
    }
  }, [gameState.score, saveHighScore, gameOptions.soundEnabled]);

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
        
        // Play laser sound when typing (respect sound options)
        if (gameOptions.soundEnabled) {
          soundManager.playLaser();
        }
        
        // Marquer ce mot comme étant tapé et mettre à jour le texte tapé
        newState.words = prev.words.map(word =>
          word.id === matchingWord.id
            ? { ...word, isBeingTyped: true, typedText: input }
            : { ...word, isBeingTyped: false, typedText: '' }
        );

        // Si le mot est complètement tapé, l'éliminer
        if (input.toLowerCase() === matchingWord.text.toLowerCase()) {
          console.log('Mot complètement éliminé:', matchingWord.text);
          
          // Play explosion sound and visual effect (respect sound options)
          if (gameOptions.soundEnabled) {
            soundManager.playExplosion();
          }
          
          newState.words = newState.words.filter(word => word.id !== matchingWord.id);
          newState.score = prev.score + (matchingWord.text.length * 10);
          newState.wordsTyped = prev.wordsTyped + 1;
          newState.currentInput = '';

          // Vérifier passage au niveau suivant (tous les 8 mots)
          if (newState.wordsTyped % 8 === 0) {
            const newLevel = prev.level + 1;
            const { spawnRate } = getGameParameters(newLevel);
            
            newState.level = newLevel;
            newState.spawnRate = spawnRate;
            console.log(`Niveau suivant: ${newLevel}, Vitesse: ${getGameParameters(newLevel).wordSpeed}, Spawn rate: ${spawnRate}ms`);
            
            // Play level up sounds and effects (respect sound options)
            if (gameOptions.soundEnabled) {
              soundManager.playLevelUp();
              setTimeout(() => {
                soundManager.playCelebration();
              }, 500);
            }
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
  }, [getGameParameters, gameOptions.soundEnabled]);

  // Boucle de jeu principale (utilise un delta temps basé sur rAF)
  const gameLoop = useCallback((time: number) => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const deltaSec = lastFrameTimeRef.current ? (time - lastFrameTimeRef.current) / 1000 : 1/60; // Fallback à 60fps
    lastFrameTimeRef.current = time;
    
    // S'assurer qu'on a un delta temps minimum pour éviter les mots bloqués
    const safeDeltaSec = Math.max(deltaSec, 1/120); // Minimum 120fps equivalent

    setGameState(prev => {
      // Déplacement basé sur la vitesse en px/s et le delta temps
      let newWords = prev.words.map(word => ({
        ...word,
        y: word.y + (word.speed * safeDeltaSec)
      }));

      // Check for words reaching the bottom and handle alert sounds
      const currentWordsAtBottom = new Set<string>();
      const bottomThreshold = window.innerHeight - 100;
      
      newWords.forEach(word => {
        if (word.y > bottomThreshold) {
          currentWordsAtBottom.add(word.id);
        }
      });

      // Start alert for new words at bottom (respect sound options)
      if (gameOptions.soundEnabled) {
        currentWordsAtBottom.forEach(wordId => {
          if (!wordsAtBottom.has(wordId)) {
            soundManager.startAlert();
          }
        });

        // Stop alert if no more words at bottom
        if (currentWordsAtBottom.size === 0 && wordsAtBottom.size > 0) {
          soundManager.stopAlert();
        }
      }

      setWordsAtBottom(currentWordsAtBottom);

      // Supprimer les mots qui ont atteint le bas et enlever une vie
      const wordsToRemove = newWords.filter(word => word.y > window.innerHeight);
      if (wordsToRemove.length > 0) {
        console.log('Mot(s) raté(s):', wordsToRemove.map(w => w.text));
        newWords = newWords.filter(word => word.y <= window.innerHeight);
        
        // Stop alert for removed words
        if (gameOptions.soundEnabled) {
          soundManager.stopAlert();
        }
        
        const newLives = prev.lives - wordsToRemove.length;
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
  }, [gameState.isPlaying, gameState.isPaused, gameState.spawnRate, gameState.wordsTyped, gameStartTime, spawnWord, wordsAtBottom, gameOptions.soundEnabled]);

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
