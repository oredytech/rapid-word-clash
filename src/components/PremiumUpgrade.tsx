import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Star, Zap, Shield } from 'lucide-react';

interface PremiumUpgradeProps {
  onUpgrade: (plan: '1month' | '1year' | 'lifetime') => void;
  onClose: () => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onUpgrade, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <CardTitle className="text-3xl font-bold">OTTAPE Premium</CardTitle>
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
          <CardDescription className="text-lg">
            Jouez sans publicité et débloquez des fonctionnalités exclusives !
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Avantages Premium */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Sans Publicité</h3>
              <p className="text-sm text-muted-foreground">Expérience de jeu pure</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Thèmes Exclusifs</h3>
              <p className="text-sm text-muted-foreground">Designs premium uniques</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Statistiques Avancées</h3>
              <p className="text-sm text-muted-foreground">Analyses détaillées</p>
            </div>
          </div>

          {/* Plans tarifaires */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Plan mensuel */}
            <Card className="relative border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Mensuel</CardTitle>
                <div className="text-3xl font-bold">2,99€</div>
                <CardDescription>/mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Sans publicité</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => onUpgrade('1month')} 
                  className="w-full"
                  variant="outline"
                >
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>

            {/* Plan annuel - Populaire */}
            <Card className="relative border-2 border-primary shadow-lg scale-105">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Le plus populaire
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Annuel</CardTitle>
                <div className="text-3xl font-bold">19,99€</div>
                <CardDescription>/année</CardDescription>
                <div className="text-sm text-green-600 font-medium">
                  Économisez 44% !
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Sans publicité</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Thèmes exclusifs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => onUpgrade('1year')} 
                  className="w-full"
                >
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>

            {/* Plan à vie */}
            <Card className="relative border-2 border-yellow-500">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black">
                Meilleure valeur
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">À vie</CardTitle>
                <div className="text-3xl font-bold">49,99€</div>
                <CardDescription>Paiement unique</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Sans publicité à vie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Tous les thèmes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Statistiques avancées</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Fonctionnalités futures</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => onUpgrade('lifetime')} 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Choisir ce plan
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose} variant="ghost">
              Continuer avec les publicités
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumUpgrade;