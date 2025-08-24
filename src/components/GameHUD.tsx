
import React from 'react';
import { GameState, GameStats } from '../types/game';
import { Heart, Zap, Trophy, Target } from 'lucide-react';

interface GameHUDProps {
  gameState: GameState;
  stats: GameStats;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState, stats }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
      {/* Stats gauche */}
      <div className="flex flex-col gap-3">
        <div className="hud-element">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="w-5 h-5" />
            <span className="text-sm">Score</span>
          </div>
          <div className="score-display">{gameState.score.toLocaleString()}</div>
        </div>
        
        <div className="hud-element">
          <div className="flex items-center gap-2 text-accent">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Niveau</span>
          </div>
          <div className="text-2xl font-bold text-accent">{gameState.level}</div>
        </div>
      </div>

      {/* Stats centre - Temps seulement */}
      <div className="flex flex-col gap-3 items-center">
        <div className="hud-element">
          <div className="text-sm text-muted-foreground">Temps</div>
          <div className="text-lg font-mono">
            {Math.floor(stats.timeElapsed / 60)}:{String(Math.floor(stats.timeElapsed % 60)).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Vies droite */}
      <div className="flex flex-col gap-3">
        <div className="hud-element">
          <div className="flex items-center gap-2 text-destructive">
            <Heart className="w-5 h-5" />
            <span className="text-sm">Vies</span>
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < gameState.lives 
                    ? 'text-destructive fill-current' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="hud-element">
          <div className="text-sm text-muted-foreground">Record</div>
          <div className="text-lg font-bold text-neon-orange">
            {stats.highScore.toLocaleString()}
          </div>
        </div>
      </div>

      {/* MPM en bas à droite */}
      <div className="absolute bottom-8 right-8">
        <div className="hud-element">
          <div className="flex items-center gap-2 text-secondary">
            <Target className="w-5 h-5" />
            <span className="text-sm">MPM</span>
          </div>
          <div className="text-xl font-bold text-secondary">{stats.wpm}</div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
