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
        return { width: '300px', height: '250px', bgWidth: '320px', bgHeight: '270px' };
      case 'leaderboard':
        return { width: '728px', height: '90px', bgWidth: '748px', bgHeight: '110px' };
      case 'popup':
        return { width: '250px', height: '250px', bgWidth: '270px', bgHeight: '270px' };
      default:
        return { width: '300px', height: '250px', bgWidth: '320px', bgHeight: '270px' };
    }
  };
  
  const { width, height, bgWidth, bgHeight } = getDimensions();

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
      <div style={{ fontSize: '12px', textAlign: 'center', color: '#888', marginBottom: '4px' }}>
        Advertisement
      </div>
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
            width: bgWidth, 
            height: bgHeight, 
            backgroundColor: '#e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            border: '1px solid #ccc',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width,
            height,
            border: '1px dashed #888',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <p>Ad Placeholder ({width}x{height})</p>
          </div>
        </div>
      )}
    </div>
  );
}
