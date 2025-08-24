
import React, { useEffect, useState } from 'react';

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
      
      // Hide confetti after 2 seconds and complete
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
        onComplete();
      }, 2000);
      
      return () => {
        clearTimeout(confettiTimer);
      };
    } else {
      setShowConfetti(false);
    }
  }, [isVisible, onComplete]);

  if (!isVisible && !showConfetti) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Confetti particles only */}
      {showConfetti && (
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
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
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LevelUpCelebration;
