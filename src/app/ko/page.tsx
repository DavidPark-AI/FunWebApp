'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import PhotoUploader from '@/components/PhotoUploader';
import NameLanguageSelector, { NameLanguage } from '@/components/NameLanguageSelector';
import ResultCard, { NameResult } from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import InfoSidebar from '@/components/InfoSidebar';
import ExampleDisplay from '@/components/ExampleDisplay';
import { saveImageToLocalStorage, getImageFromLocalStorage, clearImageFromLocalStorage } from '@/lib/imageStorage';
import Footer from '@/components/Footer';

// Language content for Korean UI
const translations = {
  title: '나의 이름은?',
  subtitle: '🤔내 이름이 내 얼굴에 어울릴까?\n당신의 얼굴에 어울리는 이름은 사실...🫢',
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
    // 기존 데이터를 완전히 초기화
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setShowAd(false);
    
    // 새 이미지 저장 전에 기존 저장된 데이터를 제거
    clearImageFromLocalStorage();
    
    // 새 이미지 저장
    saveImageToLocalStorage(file);
  }, []);

  // 컴포넌트 마운트 시 로컬 스토리지에서 이미지 로드
  useEffect(() => {
    const savedImage = getImageFromLocalStorage();
    if (savedImage) {
      setSelectedFile(savedImage);
    }
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
      console.log('Client received response:', data);
      
      // 응답 객체에 이미지 URL 추가 (현재 선택된 이미지)
      setResult({
        ...data,
        previewImageUrl: selectedFile ? URL.createObjectURL(selectedFile) : ''
      });
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || '문제가 발생했습니다');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setShowAd(false), 1000);
    }
  };

  const handleReset = () => {
    // 결과만 초기화하고 이미지는 유지
    setResult(null);
    setError(null);
    
    // 이미지는 유지하면서 새 추천을 위해 준비
    // 이미지를 완전히 삭제하지는 않음 (clearImageFromLocalStorage 사용하지 않음)
  };

  // Determine the app URL for sharing
  const appUrl = typeof window !== 'undefined' ? window.location.origin + '/ko' : 'https://name-recommender.app/ko';

  return (
    <div className="min-h-screen py-8 px-4 bg-pink-50">
      <header className="max-w-4xl mx-auto text-center mb-4">
        <h1 className="inline-block text-4xl font-bold text-primary-600 mb-4 px-6 py-2 border-2 border-primary-600 rounded-lg shadow-md bg-white">{translations.title}</h1>
        <p className="text-lg text-gray-600 whitespace-pre-line">{translations.subtitle}</p>
        <LanguageSwitcher />
      </header>

      {/* Google Ad Banner placed right below the title */}
      <div className="max-w-4xl mx-auto mb-8">
        <AdBanner adSlot="header" adFormat="leaderboard" />
      </div>

      {/* Example Display Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <ExampleDisplay language="ko" />
      </div>

      <main className="max-w-4xl mx-auto">
        {/* Main content area with info sidebar */}
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

                <div className="mt-3 flex flex-col items-center">
                  <div className="mb-3">
                    <p className="mb-2 text-sm text-gray-600 text-center">
                      추천 받을 이름의 언어를 선택해주세요:
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNameLanguage('korean')}
                        className={`px-3 py-1 rounded text-sm ${nameLanguage === 'korean' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                      >
                        🇰🇷 한국어
                      </button>
                      <button
                        onClick={() => setNameLanguage('english')}
                        className={`px-3 py-1 rounded text-sm ${nameLanguage === 'english' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                      >
                        🇺🇸 영어
                      </button>
                      <button
                        onClick={() => setNameLanguage('japanese')}
                        className={`px-3 py-1 rounded text-sm ${nameLanguage === 'japanese' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                      >
                        🇯🇵 일본어
                      </button>
                    </div>
                  </div>
                  
                  {selectedFile && (
                    <button
                      onClick={handleAnalyze}
                      className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                    >
                      {translations.analyze}
                    </button>
                  )}
                </div>

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

          {/* Info sidebar (replacing side advertisement) */}
          <div className="md:w-64 flex-shrink-0">
            <InfoSidebar language="ko" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
