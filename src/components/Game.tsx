
import React, { useState, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameOptions } from '../hooks/useGameOptions';
import { usePremium } from '../hooks/usePremium';
import FallingWord from './FallingWord';
import GameHUD from './GameHUD';
import TypingZone from './TypingZone';
import GameMenu from './GameMenu';
import Soldier from './Soldier';
import LevelUpCelebration from './LevelUpCelebration';
import AdBanner from './AdBanner';
import PremiumUpgrade from './PremiumUpgrade';
import { Pause, Play, Crown } from 'lucide-react';

const Game: React.FC = () => {
  const { options: gameOptions, updateOptions } = useGameOptions();
  const { gameState, stats, startGame, handleInput, togglePause } = useGameLogic(gameOptions);
  const { isPremium, activatePremium } = usePremium();
  const [showLevelUpCelebration, setShowLevelUpCelebration] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [gameCount, setGameCount] = useState(0);
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false);

  // Watch for level changes to trigger celebration
  useEffect(() => {
    if (gameState.level > celebrationLevel && gameState.isPlaying && gameOptions.particleEffects) {
      setCelebrationLevel(gameState.level);
      setShowLevelUpCelebration(true);
    }
  }, [gameState.level, gameState.isPlaying, celebrationLevel, gameOptions.particleEffects]);

  // Mark that user has started playing
  useEffect(() => {
    if (gameState.isPlaying && !hasPlayedBefore) {
      setHasPlayedBefore(true);
    }
  }, [gameState.isPlaying, hasPlayedBefore]);

  // Show premium popup occasionally for non-premium users ONLY after they've played
  useEffect(() => {
    if (!isPremium && !gameState.isPlaying && gameState.lives === 0 && hasPlayedBefore) {
      // Increment game count when game ends
      const newGameCount = gameCount + 1;
      setGameCount(newGameCount);
      
      // Show premium popup every 3rd game or randomly (20% chance)
      if (newGameCount % 3 === 0 || Math.random() < 0.2) {
        setTimeout(() => {
          setShowPremiumUpgrade(true);
        }, 2000); // Show after 2 seconds
      }
    }
  }, [gameState.isPlaying, gameState.lives, isPremium, gameCount, hasPlayedBefore]);

  // Trouver le mot cible (celui en cours de frappe)
  const targetWord = gameState.words.find(word => word.isBeingTyped);

  // Afficher le menu si le jeu n'est pas lancé
  if (!gameState.isPlaying) {
    return (
      <GameMenu
        onStartGame={startGame}
        stats={stats}
        isGameOver={gameState.lives === 0}
        finalScore={gameState.score}
        gameOptions={gameOptions}
        onOptionsChange={updateOptions}
      />
    );
  }

  const handlePremiumUpgrade = (plan: '1month' | '1year' | 'lifetime') => {
    activatePremium(plan);
    setShowPremiumUpgrade(false);
    // Simuler le paiement - en production, intégrer un vrai système de paiement
    alert(`Premium ${plan} activé ! Les publicités sont maintenant désactivées.`);
  };

  return (
    <div className="game-container min-h-screen relative overflow-hidden">
      {/* Publicité en haut si pas premium */}
      {!isPremium && (
        <div className="relative z-10 bg-background/95 border-b">
          <AdBanner 
            adSlot="1234567890" 
            className="max-w-screen-xl mx-auto" 
            style={{ minHeight: '90px' }}
          />
        </div>
      )}

      {/* HUD */}
      <GameHUD gameState={gameState} stats={stats} />

      {/* Boutons en bas à droite */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-2">
        {/* Bouton Premium si pas premium */}
        {!isPremium && (
          <button
            onClick={() => setShowPremiumUpgrade(true)}
            className="btn-premium bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 shadow-lg"
          >
            <Crown className="w-4 h-4 mr-1" />
            Premium
          </button>
        )}
        
        {/* Bouton pause */}
        <button
          onClick={togglePause}
          className="btn-secondary"
        >
          {gameState.isPaused ? (
            <Play className="w-5 h-5" />
          ) : (
            <Pause className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mots qui tombent */}
      <div className="absolute inset-0">
        {gameState.words.map((word) => (
          <FallingWord 
            key={word.id} 
            word={word} 
            showTypedText={gameOptions.showTypedText}
          />
        ))}
      </div>

      {/* Soldat avec arme */}
      <Soldier 
        isGamePlaying={gameState.isPlaying && !gameState.isPaused}
        currentInput={gameState.currentInput}
        targetWord={targetWord ? {
          x: targetWord.x,
          y: targetWord.y,
          text: targetWord.text,
          typedText: targetWord.typedText
        } : null}
      />

      {/* Zone de frappe */}
      <TypingZone
        value={gameState.currentInput}
        onChange={handleInput}
        isGamePlaying={gameState.isPlaying && !gameState.isPaused}
        wordPreview={gameOptions.wordPreview ? targetWord?.text : undefined}
      />

      {/* Level up celebration */}
      {gameOptions.particleEffects && (
        <LevelUpCelebration
          level={gameState.level}
          isVisible={showLevelUpCelebration}
          onComplete={() => setShowLevelUpCelebration(false)}
        />
      )}

      {/* Overlay de pause */}
      {gameState.isPaused && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="game-card text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary neon-text">
              Pause
            </h2>
            <p className="text-muted-foreground mb-6">
              Appuyez sur le bouton pause pour continuer
            </p>
            <button onClick={togglePause} className="btn-primary">
              <Play className="w-5 h-5 mr-2" />
              Reprendre
            </button>
          </div>
        </div>
      )}

      {/* Effets visuels additionnels */}
      {gameOptions.particleEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Particules flottantes améliorées */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-${i % 3 + 1} h-${i % 3 + 1} bg-gradient-to-br from-primary/30 to-accent/20 rounded-full animate-bounce`}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            />
          ))}
          {/* Lignes d'énergie */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent animate-pulse" />
          {/* Grille de fond futuriste */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="border border-primary/20 animate-pulse" 
                     style={{ animationDelay: `${(i * 0.1) % 3}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Publicité en bas si pas premium */}
      {!isPremium && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 border-t">
          <AdBanner 
            adSlot="0987654321" 
            className="max-w-screen-xl mx-auto" 
            style={{ minHeight: '90px' }}
          />
        </div>
      )}

      {/* Modal Premium Upgrade */}
      {showPremiumUpgrade && (
        <PremiumUpgrade 
          onUpgrade={handlePremiumUpgrade}
          onClose={() => setShowPremiumUpgrade(false)}
        />
      )}
    </div>
  );
};

export default Game;
