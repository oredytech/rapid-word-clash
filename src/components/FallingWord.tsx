import React, { useState, useEffect } from 'react';
import { Word } from '../types/game';

interface FallingWordProps {
  word: Word;
  showTypedText?: boolean;
}

const FallingWord: React.FC<FallingWordProps> = ({ word, showTypedText = true }) => {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    // Check if word was just completed (when typedText equals text)
    if (word.isBeingTyped && word.typedText && 
        word.typedText.toLowerCase() === word.text.toLowerCase()) {
      setIsExploding(true);
      
      // Reset explosion state after animation
      setTimeout(() => {
        setIsExploding(false);
      }, 300);
    }
  }, [word.typedText, word.text, word.isBeingTyped]);

  const getWordClass = () => {
    let baseClass = 'falling-word absolute select-none transition-colors duration-200';
    
    if (isExploding) {
      baseClass += ' exploding';
    } else if (word.isBeingTyped) {
      baseClass += ' typing';
    }
    
    return baseClass;
  };

  const renderWordWithElimination = () => {
    if (!word.isBeingTyped || !word.typedText || !showTypedText) {
      return (
        <span className="text-primary neon-text">
          {word.text}
        </span>
      );
    }

    const typedLength = word.typedText.length;
    const remaining = word.text.slice(typedLength);
    
    return (
      <>
        {/* Partie restante du mot */}
        <span className="text-accent neon-text animate-pulse">
          {remaining}
        </span>
        {/* Effet visuel pour montrer l'élimination */}
        <span className="absolute inset-0 pointer-events-none">
          <span className="text-destructive opacity-50 animate-ping" 
                style={{ 
                  textShadow: '0 0 10px hsl(var(--destructive))',
                }}>
            {word.text.slice(0, typedLength)}
          </span>
        </span>
      </>
    );
  };

  return (
    <div
      className={getWordClass()}
      style={{
        left: `${word.x}px`,
        top: `${word.y}px`,
        transform: `translateX(-50%)`,
      }}
    >
      {renderWordWithElimination()}
      
      {/* Explosion effects */}
      {isExploding && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Explosion particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-20px)`,
                animation: `explosion-particle 0.3s ease-out forwards`,
                animationDelay: `${i * 0.02}s`
              }}
            />
          ))}
          
          {/* Flash effect */}
          <div className="absolute inset-0 bg-accent rounded-lg animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
};

export default FallingWord;
