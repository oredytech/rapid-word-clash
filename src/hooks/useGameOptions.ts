
import { useState, useEffect } from 'react';

export interface GameOptions {
  soundVolume: number;
  soundEnabled: boolean;
  difficulty: 'facile' | 'normal' | 'difficile';
  showTypedText: boolean;
  particleEffects: boolean;
  wordPreview: boolean;
}

const DEFAULT_OPTIONS: GameOptions = {
  soundVolume: 70,
  soundEnabled: true,
  difficulty: 'normal',
  showTypedText: true,
  particleEffects: true,
  wordPreview: false,
};

export const useGameOptions = () => {
  const [options, setOptions] = useState<GameOptions>(DEFAULT_OPTIONS);

  // Charger les options depuis localStorage
  useEffect(() => {
    const savedOptions = localStorage.getItem('typing-game-options');
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions);
        setOptions({ ...DEFAULT_OPTIONS, ...parsed });
      } catch (error) {
        console.log('Erreur lors du chargement des options:', error);
      }
    }
  }, []);

  // Sauvegarder les options dans localStorage
  const updateOptions = (newOptions: GameOptions) => {
    setOptions(newOptions);
    localStorage.setItem('typing-game-options', JSON.stringify(newOptions));
  };

  // Obtenir les modificateurs de difficulté
  const getDifficultyModifiers = () => {
    switch (options.difficulty) {
      case 'facile':
        return {
          speedMultiplier: 0.7,
          spawnRateMultiplier: 1.3,
          livesBonus: 1,
        };
      case 'difficile':
        return {
          speedMultiplier: 1.4,
          spawnRateMultiplier: 0.7,
          livesBonus: -1,
        };
      default: // normal
        return {
          speedMultiplier: 1.0,
          spawnRateMultiplier: 1.0,
          livesBonus: 0,
        };
    }
  };

  return {
    options,
    updateOptions,
    getDifficultyModifiers,
  };
};
