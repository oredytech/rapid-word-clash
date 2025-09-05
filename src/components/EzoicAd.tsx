import React, { useEffect, useRef } from 'react';

interface EzoicAdProps {
  placeholderId: number;
  className?: string;
}

export const EzoicAd: React.FC<EzoicAdProps> = ({ placeholderId, className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const hasShownAd = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ezstandalone && !hasShownAd.current) {
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];
      window.ezstandalone.cmd.push(() => {
        try {
          window.ezstandalone.showAds(placeholderId);
          hasShownAd.current = true;
        } catch (error) {
          console.warn('Ezoic ad failed to load:', error);
        }
      });
    }

    // Cleanup function to destroy the ad when component unmounts
    return () => {
      if (typeof window !== 'undefined' && window.ezstandalone && hasShownAd.current) {
        window.ezstandalone.cmd.push(() => {
          try {
            window.ezstandalone.destroyPlaceholders(placeholderId);
          } catch (error) {
            console.warn('Failed to destroy Ezoic ad:', error);
          }
        });
      }
    };
  }, [placeholderId]);

  return (
    <div 
      ref={adRef}
      id={`ezoic-pub-ad-placeholder-${placeholderId}`}
      className={className}
    />
  );
};

// Helper function to show all ads
export const showAllEzoicAds = () => {
  if (typeof window !== 'undefined' && window.ezstandalone) {
    window.ezstandalone.cmd.push(() => {
      try {
        window.ezstandalone.showAds();
      } catch (error) {
        console.warn('Failed to show all Ezoic ads:', error);
      }
    });
  }
};

// Helper function to destroy all ads
export const destroyAllEzoicAds = () => {
  if (typeof window !== 'undefined' && window.ezstandalone) {
    window.ezstandalone.cmd.push(() => {
      try {
        window.ezstandalone.destroyAll();
      } catch (error) {
        console.warn('Failed to destroy all Ezoic ads:', error);
      }
    });
  }
};

// Type declaration for window.ezstandalone
declare global {
  interface Window {
    ezstandalone: {
      cmd: Array<() => void>;
      showAds: (placeholderId?: number) => void;
      destroyPlaceholders: (...placeholderIds: number[]) => void;
      destroyAll: () => void;
    };
  }
}