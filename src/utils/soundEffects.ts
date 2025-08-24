
class SoundEffectsManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private alertInterval: number | null = null;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    // Create audio contexts for different sound effects
    this.sounds.laser = this.createAudioElement([
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWAZBjiJ1fPTgC0BJnPD8OSQQA==',
    ]);

    this.sounds.alert = this.createAudioElement([
      'data:audio/wav;base64,UklGRs4DAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaoDAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWAZBjiJ1fPTgC0BJnPD8OSQQA==',
    ]);

    this.sounds.explosion = this.createAudioElement([
      'data:audio/wav;base64,UklGRs4DAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaoDAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWAZBjiJ1fPTgC0BJnPD8OSQQA==',
    ]);

    this.sounds.levelUp = this.createAudioElement([
      'data:audio/wav;base64,UklGRs4DAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaoDAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWAZBjiJ1fPTgC0BJnPD8OSQQA==',
    ]);

    this.sounds.celebration = this.createAudioElement([
      'data:audio/wav;base64,UklGRs4DAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaoDAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvWAZBjiJ1fPTgC0BJnPD8OSQQA==',
    ]);
  }

  private createAudioElement(sources: string[]): HTMLAudioElement {
    const audio = new Audio();
    audio.volume = 0.3;
    audio.preload = 'auto';
    
    // Use the first source (base64 data URL for now)
    audio.src = sources[0];
    
    return audio;
  }

  playLaser() {
    this.playSound('laser');
  }

  startAlert() {
    this.stopAlert(); // Stop any existing alert
    this.playSound('alert');
    
    // Repeat alert sound every 1 second
    this.alertInterval = window.setInterval(() => {
      this.playSound('alert');
    }, 1000);
  }

  stopAlert() {
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
      this.alertInterval = null;
    }
  }

  playExplosion() {
    this.playSound('explosion');
  }

  playLevelUp() {
    this.playSound('levelUp');
  }

  playCelebration() {
    this.playSound('celebration');
  }

  private playSound(soundKey: string) {
    const sound = this.sounds[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.log('Could not play sound:', error);
      });
    }
  }

  setVolume(volume: number) {
    Object.values(this.sounds).forEach(sound => {
      sound.volume = Math.max(0, Math.min(1, volume));
    });
  }
}

export const soundManager = new SoundEffectsManager();
