
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

  const renderWordWithHighlight = () => {
    if (!word.isBeingTyped || !word.typedText) {
      return word.text;
    }

    const typed = word.typedText;
    const remaining = word.text.slice(typed.length);
    
    return (
      <>
        <span className="text-accent">{typed}</span>
        <span className="text-primary">{remaining}</span>
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
      {renderWordWithHighlight()}
    </div>
  );
};

export default FallingWord;
