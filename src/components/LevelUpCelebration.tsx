
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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setShowConfetti(true);
      
      // Hide celebration after exactly 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setIsAnimating(false);
        onComplete();
      }, 3000);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowConfetti(false);
      setIsAnimating(false);
    }
  }, [isVisible, onComplete]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
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
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      )}

      {/* Level up message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`game-card text-center transition-all duration-300 ${
          isAnimating ? 'animate-level-celebration scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}>
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-16 h-16 text-accent neon-text mr-4 animate-pulse" />
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
            Vitesse augmentée ! Plus de mots arrivent !
          </p>
          
          {/* Progress indicator */}
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-3000 ease-out"
              style={{ width: `${(3000 - (Date.now() % 3000)) / 30}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpCelebration;
