
import React from 'react';
import { Settings, Volume2, VolumeX, Zap, Target, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface GameOptions {
  soundVolume: number;
  soundEnabled: boolean;
  difficulty: 'facile' | 'normal' | 'difficile';
  showTypedText: boolean;
  particleEffects: boolean;
  wordPreview: boolean;
}

interface GameOptionsProps {
  options: GameOptions;
  onOptionsChange: (options: GameOptions) => void;
}

const GameOptions: React.FC<GameOptionsProps> = ({ options, onOptionsChange }) => {
  const updateOption = <K extends keyof GameOptions>(key: K, value: GameOptions[K]) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn-secondary">
          <Settings className="w-5 h-5 mr-2" />
          Options
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Settings className="w-5 h-5" />
            Options du Jeu
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              {options.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Audio
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Sons activés</span>
              <Switch
                checked={options.soundEnabled}
                onCheckedChange={(checked) => updateOption('soundEnabled', checked)}
              />
            </div>
            
            {options.soundEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Volume</span>
                  <span className="text-xs text-muted-foreground">{options.soundVolume}%</span>
                </div>
                <Slider
                  value={[options.soundVolume]}
                  onValueChange={(value) => updateOption('soundVolume', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Gameplay Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Gameplay
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm">Difficulté</label>
              <Select
                value={options.difficulty}
                onValueChange={(value: 'facile' | 'normal' | 'difficile') => updateOption('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Facile
                    </div>
                  </SelectItem>
                  <SelectItem value="normal">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Normal
                    </div>
                  </SelectItem>
                  <SelectItem value="difficile">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Difficile
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Affichage
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Afficher le texte tapé</span>
              <Switch
                checked={options.showTypedText}
                onCheckedChange={(checked) => updateOption('showTypedText', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Effets de particules</span>
              <Switch
                checked={options.particleEffects}
                onCheckedChange={(checked) => updateOption('particleEffects', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Aperçu des mots</span>
              <Switch
                checked={options.wordPreview}
                onCheckedChange={(checked) => updateOption('wordPreview', checked)}
              />
            </div>
          </div>

          {/* Difficulty Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Facile :</strong> Vitesse réduite, plus de temps</p>
              <p><strong>Normal :</strong> Vitesse standard</p>
              <p><strong>Difficile :</strong> Vitesse augmentée, spawn rapide</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameOptions;
