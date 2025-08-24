
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
    </div>
  );
};

export default FallingWord;
