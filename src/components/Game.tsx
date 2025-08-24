
import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import FallingWord from './FallingWord';
import GameHUD from './GameHUD';
import TypingZone from './TypingZone';
import GameMenu from './GameMenu';
import { Pause, Play } from 'lucide-react';

const Game: React.FC = () => {
  const { gameState, stats, startGame, handleInput, togglePause } = useGameLogic();

  // Afficher le menu si le jeu n'est pas lancé
  if (!gameState.isPlaying) {
    return (
      <GameMenu
        onStartGame={startGame}
        stats={stats}
        isGameOver={gameState.lives === 0}
        finalScore={gameState.score}
      />
    );
  }

  return (
    <div className="game-container min-h-screen relative overflow-hidden">
      {/* HUD */}
      <GameHUD gameState={gameState} stats={stats} />

      {/* Bouton pause */}
      <button
        onClick={togglePause}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 btn-secondary"
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
          <FallingWord key={word.id} word={word} />
        ))}
      </div>

      {/* Zone de frappe */}
      <TypingZone
        value={gameState.currentInput}
        onChange={handleInput}
        isGamePlaying={gameState.isPlaying && !gameState.isPaused}
      />

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
      <div className="absolute inset-0 pointer-events-none">
        {/* Particules flottantes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-bounce" 
             style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-accent/30 rounded-full animate-bounce" 
             style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-secondary/20 rounded-full animate-bounce" 
             style={{ animationDelay: '2s', animationDuration: '5s' }} />
      </div>
    </div>
  );
};

export default Game;
