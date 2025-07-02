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
    // Always attempt to load ads for Google verification purposes
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error('Ad Error:', err);
    }
  }, []);

  return (
    <div ref={adRef} className="ad-container">
      <div style={{ fontSize: '12px', textAlign: 'center', color: '#888', marginBottom: '4px' }}>
        Advertisement
      </div>
      {/* Always show AdSense code for Google to verify */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width, height }}
        data-ad-client="ca-pub-3228294204750660" // Correct AdSense ID
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
