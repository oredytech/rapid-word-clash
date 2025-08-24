
import React, { useEffect, useRef } from 'react';
import { Keyboard } from 'lucide-react';

interface TypingZoneProps {
  value: string;
  onChange: (value: string) => void;
  isGamePlaying: boolean;
}

const TypingZone: React.FC<TypingZoneProps> = ({ value, onChange, isGamePlaying }) => {
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
      <div className={`typing-zone ${value ? 'focused' : ''}`}>
        <div className="flex items-center gap-3 mb-3">
          <Keyboard className="w-6 h-6 text-primary" />
          <span className="text-sm text-muted-foreground">Tapez le mot ici</span>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-center text-2xl font-mono tracking-wider text-primary placeholder-muted-foreground"
          placeholder="..."
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
        
        {value && (
          <div className="mt-2 text-xs text-accent animate-pulse-neon">
            Continuez à taper...
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingZone;
