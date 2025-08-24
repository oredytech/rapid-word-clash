
import React from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';
import { GameStats } from '../types/game';

interface GameMenuProps {
  onStartGame: () => void;
  stats: GameStats;
  isGameOver?: boolean;
  finalScore?: number;
}

const GameMenu: React.FC<GameMenuProps> = ({ 
  onStartGame, 
  stats, 
  isGameOver = false, 
  finalScore = 0 
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="game-card max-w-md w-full mx-4 text-center">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-neon bg-clip-text text-transparent animate-pulse-neon">
            RAPID WORD CLASH
          </h1>
          <p className="text-muted-foreground">
            {isGameOver ? 'Partie terminée !' : 'Jeu de frappe rapide'}
          </p>
        </div>

        {/* Stats après game over */}
        {isGameOver && (
          <div className="mb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="hud-element">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="text-lg font-bold text-secondary">Score Final</div>
                <div className="text-2xl font-bold text-primary">{finalScore.toLocaleString()}</div>
              </div>
              
              <div className="hud-element">
                <Zap className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-lg font-bold text-accent">MPM</div>
                <div className="text-2xl font-bold text-primary">{stats.wpm}</div>
              </div>
            </div>
            
            <div className="hud-element">
              <div className="text-sm text-muted-foreground mb-1">Mots tapés</div>
              <div className="text-lg font-bold">{stats.totalWordsTyped}</div>
            </div>
          </div>
        )}

        {/* Record personnel */}
        {stats.highScore > 0 && (
          <div className="mb-6 p-4 bg-gradient-secondary rounded-lg">
            <div className="text-sm text-background/80 mb-1">Record Personnel</div>
            <div className="text-2xl font-bold text-background">{stats.highScore.toLocaleString()}</div>
          </div>
        )}

        {/* Instructions */}
        {!isGameOver && (
          <div className="mb-8 text-left space-y-2 text-sm text-muted-foreground">
            <p>🎯 <strong>Objectif :</strong> Tapez les mots avant qu'ils atteignent le bas</p>
            <p>⚡ <strong>Progression :</strong> 10 mots = niveau suivant</p>
            <p>❤️ <strong>Vies :</strong> 3 chances, ne ratez aucun mot !</p>
            <p>⌨️ <strong>Astuce :</strong> Commencez à taper dès que vous voyez le mot</p>
          </div>
        )}

        {/* Bouton d'action */}
        <button
          onClick={onStartGame}
          className={isGameOver ? 'btn-accent' : 'btn-primary'}
        >
          {isGameOver ? (
            <>
              <RotateCcw className="w-5 h-5 mr-2" />
              Rejouer
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Commencer
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-6 text-xs text-muted-foreground">
          Développé avec ❤️ • Tapez vite et bien !
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
