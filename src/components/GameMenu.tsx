
import React from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';
import { GameStats } from '../types/game';
import GameOptions from './GameOptions';
import { GameOptions as GameOptionsType } from '../hooks/useGameOptions';

interface GameMenuProps {
  onStartGame: () => void;
  stats: GameStats;
  isGameOver?: boolean;
  finalScore?: number;
  gameOptions: GameOptionsType;
  onOptionsChange: (options: GameOptionsType) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ 
  onStartGame, 
  stats, 
  isGameOver = false, 
  finalScore = 0,
  gameOptions,
  onOptionsChange
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="game-card max-w-md w-full mx-4 text-center">
        {/* Titre */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/275a29eb-5c34-4919-8286-ced0f3b12454.png" 
              alt="OTTAPE Logo" 
              className="w-16 h-16"
            />
            <h1 className="text-4xl font-bold text-primary">
              OTTAPE
            </h1>
          </div>
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
            <p>⚡ <strong>Progression :</strong> 8 mots = niveau suivant</p>
            <p>❤️ <strong>Vies :</strong> {gameOptions.difficulty === 'facile' ? '4' : gameOptions.difficulty === 'difficile' ? '2' : '3'} chances</p>
            <p>⌨️ <strong>Difficulté :</strong> {gameOptions.difficulty}</p>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="space-y-4">
          <button
            onClick={onStartGame}
            className={isGameOver ? 'btn-accent w-full' : 'btn-primary w-full'}
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

          {/* Options */}
          <div className="flex justify-center">
            <GameOptions
              options={gameOptions}
              onOptionsChange={onOptionsChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-muted-foreground">
          Fièrement conçu par{' '}
          <a 
            href="https://oredytech.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-colors underline"
          >
            Oredy TECHNOLOGIES
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
