import { useState, useEffect } from 'react';

export interface PremiumStatus {
  isPremium: boolean;
  expiresAt?: Date;
}

export const usePremium = () => {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ isPremium: false });

  useEffect(() => {
    const savedStatus = localStorage.getItem('ottape-premium');
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus);
        const expiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : null;
        
        if (expiresAt && expiresAt > new Date()) {
          setPremiumStatus({ isPremium: true, expiresAt });
        } else {
          // Premium expiré, nettoyer
          localStorage.removeItem('ottape-premium');
          setPremiumStatus({ isPremium: false });
        }
      } catch (error) {
        console.log('Erreur lors du chargement du statut premium:', error);
        setPremiumStatus({ isPremium: false });
      }
    }
  }, []);

  const activatePremium = (duration: '1month' | '1year' | 'lifetime') => {
    let expiresAt: Date | undefined;
    
    switch (duration) {
      case '1month':
        expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        break;
      case '1year':
        expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        break;
      case 'lifetime':
        // Pas d'expiration pour lifetime
        expiresAt = undefined;
        break;
    }

    const newStatus = { isPremium: true, expiresAt };
    setPremiumStatus(newStatus);
    localStorage.setItem('ottape-premium', JSON.stringify(newStatus));
  };

  const deactivatePremium = () => {
    setPremiumStatus({ isPremium: false });
    localStorage.removeItem('ottape-premium');
  };

  return {
    premiumStatus,
    activatePremium,
    deactivatePremium,
    isPremium: premiumStatus.isPremium,
  };
};