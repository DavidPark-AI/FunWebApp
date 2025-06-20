import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'rectangle' | 'leaderboard' | 'popup';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner({ adSlot, adFormat = 'rectangle' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  // Define ad dimensions based on format
  const getDimensions = () => {
    switch (adFormat) {
      case 'rectangle':
        return { width: '300px', height: '250px' };
      case 'leaderboard':
        return { width: '728px', height: '90px' };
      case 'popup':
        return { width: '250px', height: '250px' };
      default:
        return { width: '300px', height: '250px' };
    }
  };
  
  const { width, height } = getDimensions();

  useEffect(() => {
    // Only attempt to load ads when in production environment
    if (process.env.NODE_ENV === 'production') {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        }
      } catch (err) {
        console.error('Ad Error:', err);
      }
    }
  }, []);

  return (
    <div ref={adRef} className="ad-container">
      {process.env.NODE_ENV === 'production' ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width, height }}
          data-ad-client="ca-pub-YOUR_ADSENSE_ID" // Replace with your AdSense ID in production
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <div 
          style={{ 
            width, 
            height, 
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            border: '1px solid #ccc'
          }}
        >
          <p>Ad Placeholder ({width}x{height})</p>
        </div>
      )}
    </div>
  );
}
