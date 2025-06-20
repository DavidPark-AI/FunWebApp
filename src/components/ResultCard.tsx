import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  FacebookShareButton, FacebookIcon, 
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
  LineShareButton, LineIcon
} from 'react-share';

export interface NameResult {
  name: string;
  pronunciation?: string;
  reason: string;
  previewImageUrl: string;
}

interface ResultCardProps {
  result: NameResult;
  onTryAgain: () => void;
  appUrl: string;
  labels: {
    title: string;
    pronunciation: string;
    reason: string;
    saveImage: string;
    share: string;
    tryAgain: string;
    shareApp: string;
  };
}

export default function ResultCard({ result, onTryAgain, appUrl, labels }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `name-recommendation-${result.name}.png`;
      link.click();
    } catch (err) {
      console.error('Error saving image:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <div ref={cardRef} className="bg-white rounded-lg shadow-lg p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700"></div>
        
        {/* Preview image */}
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100">
            <img 
              src={result.previewImageUrl} 
              alt="Your photo" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-center mb-1">{labels.title}</h3>
        <div className="text-3xl font-bold text-center text-primary-600 mb-4">{result.name}</div>
        
        {result.pronunciation && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">{labels.pronunciation}</h4>
            <p className="italic">{result.pronunciation}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500">{labels.reason}</h4>
          <p className="text-gray-700">{result.reason}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center mt-4 gap-2">
        <button 
          onClick={handleSaveImage}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {labels.saveImage}
        </button>
        
        <button 
          onClick={onTryAgain}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {labels.tryAgain}
        </button>
      </div>
      
      <div className="mt-4">
        <h4 className="text-center text-sm font-medium text-gray-500 mb-2">{labels.share}</h4>
        <div className="flex justify-center space-x-2">
          <FacebookShareButton url={appUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={appUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={appUrl}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LineShareButton url={appUrl}>
            <LineIcon size={32} round />
          </LineShareButton>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-center text-sm font-medium text-gray-500 mb-2">{labels.shareApp}</h4>
        <div className="flex justify-center space-x-2">
          <FacebookShareButton url={appUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={appUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={appUrl}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LineShareButton url={appUrl}>
            <LineIcon size={32} round />
          </LineShareButton>
        </div>
      </div>
    </div>
  );
}
