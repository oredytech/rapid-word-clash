
import React, { useEffect, useState } from 'react';
import { Shield, Zap } from 'lucide-react';

interface SoldierProps {
  isGamePlaying: boolean;
  currentInput: string;
  targetWord?: { x: number; y: number; text: string; typedText: string } | null;
}

const Soldier: React.FC<SoldierProps> = ({ isGamePlaying, currentInput, targetWord }) => {
  const [isShooting, setIsShooting] = useState(false);
  const [laserBeams, setLaserBeams] = useState<Array<{ id: string; targetX: number; targetY: number }>>([]);

  useEffect(() => {
    if (currentInput && targetWord) {
      setIsShooting(true);
      
      // Créer un rayon laser vers le mot cible
      const newLaser = {
        id: Math.random().toString(36).substr(2, 9),
        targetX: targetWord.x,
        targetY: targetWord.y
      };
      
      setLaserBeams(prev => [...prev, newLaser]);
      
      // Supprimer le laser après l'animation
      setTimeout(() => {
        setLaserBeams(prev => prev.filter(laser => laser.id !== newLaser.id));
        setIsShooting(false);
      }, 200);
    }
  }, [currentInput, targetWord]);

  if (!isGamePlaying) {
    return null;
  }

  return (
    <>
      {/* Soldat */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
        <div className={`soldier-container transition-all duration-200 ${isShooting ? 'scale-110' : 'scale-100'}`}>
          <div className="relative">
            {/* Corps du soldat */}
            <div className="soldier-body bg-gradient-to-b from-primary to-secondary rounded-lg p-4 neon-border">
              <Shield className="w-12 h-12 text-background" />
            </div>
            
            {/* Arme */}
            <div className={`absolute -top-2 -right-2 transition-all duration-100 ${isShooting ? 'animate-pulse' : ''}`}>
              <div className="weapon bg-accent rounded-full p-2 neon-border">
                <Zap className={`w-6 h-6 text-background ${isShooting ? 'animate-bounce' : ''}`} />
              </div>
            </div>
            
            {/* Effet de tir */}
            {isShooting && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="shooting-effect w-2 h-8 bg-accent rounded-full animate-pulse-neon"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rayons laser */}
      {laserBeams.map(laser => (
        <div
          key={laser.id}
          className="absolute z-5 pointer-events-none"
          style={{
            left: '50%',
            bottom: '140px',
            transform: 'translateX(-50%)',
          }}
        >
          <svg
            className="absolute"
            width={Math.abs(laser.targetX - window.innerWidth / 2) + 50}
            height={Math.abs(laser.targetY - (window.innerHeight - 140)) + 50}
            style={{
              left: laser.targetX > window.innerWidth / 2 ? 0 : -(Math.abs(laser.targetX - window.innerWidth / 2) + 50),
              top: -(Math.abs(laser.targetY - (window.innerHeight - 140)) + 50),
            }}
          >
            <line
              x1={laser.targetX > window.innerWidth / 2 ? 0 : Math.abs(laser.targetX - window.innerWidth / 2) + 50}
              y1={Math.abs(laser.targetY - (window.innerHeight - 140)) + 50}
              x2={laser.targetX > window.innerWidth / 2 ? Math.abs(laser.targetX - window.innerWidth / 2) + 50 : 0}
              y2={0}
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              className="animate-pulse laser-beam"
              style={{
                filter: 'drop-shadow(0 0 10px hsl(var(--accent)))',
                animation: 'laser-shoot 0.2s ease-out forwards'
              }}
            />
          </svg>
        </div>
      ))}
    </>
  );
};

export default Soldier;
