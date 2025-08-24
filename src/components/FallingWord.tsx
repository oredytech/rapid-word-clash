
import React from 'react';
import { Word } from '../types/game';

interface FallingWordProps {
  word: Word;
}

const FallingWord: React.FC<FallingWordProps> = ({ word }) => {
  const getWordClass = () => {
    let baseClass = 'falling-word absolute select-none transition-colors duration-200';
    
    if (word.isBeingTyped) {
      baseClass += ' typing';
    }
    
    return baseClass;
  };

  const renderWordWithElimination = () => {
    if (!word.isBeingTyped || !word.typedText) {
      return (
        <span className="text-primary neon-text">
          {word.text}
        </span>
      );
    }

    const typed = word.typedText;
    const remaining = word.text.slice(typed.length);
    
    return (
      <>
        {/* Lettres éliminées avec effet d'explosion */}
        <span className="eliminated-letters text-destructive animate-pulse" 
              style={{ 
                textShadow: '0 0 10px hsl(var(--destructive)), 0 0 20px hsl(var(--destructive))',
                animation: 'eliminated-letter 0.3s ease-out forwards'
              }}>
          {typed}
        </span>
        {/* Lettres restantes */}
        <span className="text-accent neon-text animate-pulse-neon">
          {remaining}
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
    </div>
  );
};

export default FallingWord;
