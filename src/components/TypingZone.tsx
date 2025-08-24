
import React, { useEffect, useRef } from 'react';
import { Keyboard } from 'lucide-react';

interface TypingZoneProps {
  value: string;
  onChange: (value: string) => void;
  isGamePlaying: boolean;
}

const TypingZone: React.FC<TypingZoneProps> = ({
  value,
  onChange,
  isGamePlaying
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGamePlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGamePlaying]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGamePlaying && inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGamePlaying]);

  if (!isGamePlaying) {
    return null;
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-96 z-20">
      <div className="game-card bg-card/90 backdrop-blur-sm border border-primary/30">
        <div className="flex items-center space-x-3">
          <Keyboard className="w-5 h-5 text-primary" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent text-primary text-lg font-mono outline-none placeholder-muted-foreground"
            placeholder="Tapez pour éliminer les mots..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TypingZone;
