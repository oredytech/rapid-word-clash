
import React, { useEffect, useState } from 'react';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface LevelUpCelebrationProps {
  level: number;
  isVisible: boolean;
  onComplete: () => void;
}

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ 
  level, 
  isVisible, 
  onComplete 
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      
      // Hide celebration after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: [
                  'hsl(var(--primary))',
                  'hsl(var(--secondary))', 
                  'hsl(var(--accent))',
                  'hsl(var(--neon-pink))',
                  'hsl(var(--neon-green))'
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Level up message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="game-card text-center animate-level-celebration">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-accent neon-text mr-4" />
            <div>
              <h2 className="text-5xl font-bold text-primary neon-text mb-2">
                NIVEAU {level}
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-6 h-6 text-secondary animate-pulse" />
                <span className="text-xl text-secondary font-semibold">
                  FÉLICITATIONS !
                </span>
                <Star className="w-6 h-6 text-secondary animate-pulse" />
              </div>
            </div>
            <Sparkles className="w-16 h-16 text-secondary neon-text ml-4 animate-spin" />
          </div>
          
          <p className="text-lg text-muted-foreground">
            Continuez comme ça, soldat !
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelUpCelebration;
