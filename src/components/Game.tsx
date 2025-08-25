
import React, { useState, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameOptions } from '../hooks/useGameOptions';
import FallingWord from './FallingWord';
import GameHUD from './GameHUD';
import TypingZone from './TypingZone';
import GameMenu from './GameMenu';
import Soldier from './Soldier';
import LevelUpCelebration from './LevelUpCelebration';
import { Pause, Play } from 'lucide-react';

const Game: React.FC = () => {
  const { options: gameOptions, updateOptions } = useGameOptions();
  const { gameState, stats, startGame, handleInput, togglePause } = useGameLogic(gameOptions);
  const [showLevelUpCelebration, setShowLevelUpCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);

  // Watch for level changes to trigger celebration
  useEffect(() => {
    if (gameState.level > celebrationLevel && gameState.isPlaying && gameOptions.particleEffects) {
      setCelebrationLevel(gameState.level);
      setShowLevelUpCelebration(true);
    }
  }, [gameState.level, gameState.isPlaying, celebrationLevel, gameOptions.particleEffects]);

  // Trouver le mot cible (celui en cours de frappe)
  const targetWord = gameState.words.find(word => word.isBeingTyped);

  // Afficher le menu si le jeu n'est pas lancé
  if (!gameState.isPlaying) {
    return (
      <GameMenu
        onStartGame={startGame}
        stats={stats}
        isGameOver={gameState.lives === 0}
        finalScore={gameState.score}
        gameOptions={gameOptions}
        onOptionsChange={updateOptions}
      />
    );
  }

  return (
    <div className="game-container min-h-screen relative overflow-hidden">
      {/* HUD */}
      <GameHUD gameState={gameState} stats={stats} />

      {/* Bouton pause en bas à droite */}
      <button
        onClick={togglePause}
        className="absolute bottom-8 right-8 z-20 btn-secondary"
      >
        {gameState.isPaused ? (
          <Play className="w-5 h-5" />
        ) : (
          <Pause className="w-5 h-5" />
        )}
      </button>

      {/* Mots qui tombent */}
      <div className="absolute inset-0">
        {gameState.words.map((word) => (
          <FallingWord 
            key={word.id} 
            word={word} 
            showTypedText={gameOptions.showTypedText}
          />
        ))}
      </div>

      {/* Soldat avec arme */}
      <Soldier 
        isGamePlaying={gameState.isPlaying && !gameState.isPaused}
        currentInput={gameState.currentInput}
        targetWord={targetWord ? {
          x: targetWord.x,
          y: targetWord.y,
          text: targetWord.text,
          typedText: targetWord.typedText
        } : null}
      />

      {/* Zone de frappe */}
      <TypingZone
        value={gameState.currentInput}
        onChange={handleInput}
        isGamePlaying={gameState.isPlaying && !gameState.isPaused}
        wordPreview={gameOptions.wordPreview ? targetWord?.text : undefined}
      />

      {/* Level up celebration */}
      {gameOptions.particleEffects && (
        <LevelUpCelebration
          level={gameState.level}
          isVisible={showLevelUpCelebration}
          onComplete={() => setShowLevelUpCelebration(false)}
        />
      )}

      {/* Overlay de pause */}
      {gameState.isPaused && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="game-card text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary neon-text">
              Pause
            </h2>
            <p className="text-muted-foreground mb-6">
              Appuyez sur le bouton pause pour continuer
            </p>
            <button onClick={togglePause} className="btn-primary">
              <Play className="w-5 h-5 mr-2" />
              Reprendre
            </button>
          </div>
        </div>
      )}

      {/* Effets visuels additionnels */}
      {gameOptions.particleEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Particules flottantes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-bounce" 
               style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-accent/30 rounded-full animate-bounce" 
               style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-secondary/20 rounded-full animate-bounce" 
               style={{ animationDelay: '2s', animationDuration: '5s' }} />
        </div>
      )}
    </div>
  );
};

export default Game;
