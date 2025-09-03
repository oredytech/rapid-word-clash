
import React from 'react';
import Game from '../components/Game';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🖥️</div>
          <h1 className="text-2xl font-bold text-foreground">
            Jeu non disponible sur mobile
          </h1>
          <p className="text-muted-foreground">
            Ce jeu de frappe rapide nécessite un clavier physique. 
            Veuillez utiliser un ordinateur de bureau ou un ordinateur portable pour jouer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Game />
    </div>
  );
};

export default Index;
