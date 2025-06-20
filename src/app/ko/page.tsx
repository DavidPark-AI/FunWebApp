'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import PhotoUploader from '@/components/PhotoUploader';
import NameLanguageSelector, { NameLanguage } from '@/components/NameLanguageSelector';
import ResultCard, { NameResult } from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// Language content for Korean UI
const translations = {
  title: '이름 추천기',
  subtitle: '사진을 기반으로 이름을 추천해 드립니다',
  uploadTitle: '사진 업로드',
  uploadInstructions: '사진을 끌어다 놓거나 클릭하여 업로드하세요 (최대 5MB)',
  languageSelect: '이름 언어 선택',
  korean: '한국어',
  english: '영어',
  japanese: '일본어',
  analyze: '사진 분석',
  analyzing: '분석 중...',
  results: {
    title: '추천 이름',
    pronunciation: '발음',
    reason: '추천 이유',
    saveImage: '이미지로 저장',
    share: '결과 공유',
    tryAgain: '다른 사진 시도',
    shareApp: '친구들에게 이 앱 공유하기'
  },
  error: {
    title: '오류가 발생했습니다',
    message: '사진을 분석하는 동안 오류가 발생했습니다. 다시 시도해 주세요.',
    button: '다시 시도'
  }
};

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nameLanguage, setNameLanguage] = useState<NameLanguage>('korean');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [result, setResult] = useState<NameResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setShowAd(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('nameLanguage', nameLanguage);
      formData.append('uiLanguage', 'ko');

      // Short timeout to show the ad before processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch('/api/get-name-recommendation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이미지 분석에 실패했습니다');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || '문제가 발생했습니다');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setShowAd(false), 1000);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  // Determine the app URL for sharing
  const appUrl = typeof window !== 'undefined' ? window.location.origin + '/ko' : 'https://name-recommender.app/ko';

  return (
    <div className="min-h-screen py-8 px-4">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-600 mb-2">{translations.title}</h1>
        <p className="text-lg text-gray-600">{translations.subtitle}</p>
        <LanguageSwitcher />
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Main content area with side ad */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {!result && !isAnalyzing && (
              <>
                <PhotoUploader
                  onUpload={handleFileUpload}
                  uploadText={{
                    title: translations.uploadTitle,
                    instructions: translations.uploadInstructions,
                    button: translations.analyze,
                  }}
                  maxSizeInBytes={5 * 1024 * 1024} // 5MB
                />

                {selectedFile && (
                  <>
                    <NameLanguageSelector
                      selectedLanguage={nameLanguage}
                      onChange={setNameLanguage}
                      labels={{
                        title: translations.languageSelect,
                        korean: translations.korean,
                        english: translations.english,
                        japanese: translations.japanese,
                      }}
                    />

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleAnalyze}
                        className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                      >
                        {translations.analyze}
                      </button>
                    </div>
                  </>
                )}

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-center">
                    <h3 className="font-semibold">{translations.error.title}</h3>
                    <p>{error || translations.error.message}</p>
                    <button
                      onClick={handleReset}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      {translations.error.button}
                    </button>
                  </div>
                )}
              </>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin-slow">
                  <svg className="w-16 h-16 text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <p className="mt-4 text-lg font-medium text-gray-700">{translations.analyzing}</p>
                
                {showAd && (
                  <div className="mt-8">
                    <AdBanner adSlot="analyzing_popup" adFormat="popup" />
                  </div>
                )}
              </div>
            )}

            {result && (
              <ResultCard
                result={result}
                onTryAgain={handleReset}
                appUrl={appUrl}
                labels={translations.results}
              />
            )}
          </div>

          {/* Side advertisement */}
          <div className="md:w-64 flex-shrink-0">
            <AdBanner adSlot="sidebar" adFormat="rectangle" />
          </div>
        </div>
        
        {/* Bottom advertisement */}
        <div className="mt-12">
          <AdBanner adSlot="footer" adFormat="leaderboard" />
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} 이름 추천기</p>
        <p className="mt-1">OpenAI 기술 제공</p>
      </footer>
    </div>
  );
}
