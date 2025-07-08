'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import PhotoUploader from '@/components/PhotoUploader';
import NameLanguageSelector, { NameLanguage } from '@/components/NameLanguageSelector';
import ResultCard, { NameResult } from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SideMenu from '@/components/SideMenu';
import ExampleDisplay from '@/components/ExampleDisplay';
import { saveImageToLocalStorage, getImageFromLocalStorage, clearImageFromLocalStorage } from '@/lib/imageStorage';
import { saveImageAnalyzedState, getImageAnalyzedState, saveAnalysisResult, getAnalysisResult, clearAnalysisData } from '@/lib/analysisStorage';
import Footer from '@/components/Footer';
import UserCounter from '@/components/UserCounter';

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
  const [isImageAnalyzed, setIsImageAnalyzed] = useState<boolean>(false);
  const [currentImageId, setCurrentImageId] = useState<string>('');  // 이미지 고유 ID
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleFileUpload = useCallback((file: File) => {
    // 기존 데이터를 완전히 초기화
    setCurrentImageId(Date.now().toString()); // 새 이미지 ID 생성
    setResult(null);
    setError(null);
    setSelectedFile(file);
    setIsImageAnalyzed(false); // 업로드된 새 파일은 분석되지 않은 상태
    
    // 새 이미지 저장 전에 기존 저장된 데이터를 제거
    clearImageFromLocalStorage();
    
    // 새 이미지 저장
    saveImageToLocalStorage(file);
    // 새 이미지 업로드시 resetTrigger 증가 제거 - 이미지가 UI에 보여야 함
  }, []);

  // 컴포넌트 마운트 시 세션 스토리지에서 이미지와 분석 상태 로드
  useEffect(() => {
    const savedImage = getImageFromLocalStorage();
    const savedAnalyzed = getImageAnalyzedState();
    const savedResult = getAnalysisResult();
    
    console.log('페이지 로드 시 상태:', { 
      savedImage: !!savedImage, 
      savedAnalyzed,
      savedResult: !!savedResult 
    });
    
    if (savedImage) {
      setSelectedFile(savedImage);
      setIsImageAnalyzed(savedAnalyzed); // 저장된 분석 상태 적용
      
      // 저장된 분석 결과가 있다면 복원
      if (savedAnalyzed && savedResult) {
        const resultWithPreview = {
          ...savedResult,
          previewImageUrl: URL.createObjectURL(savedImage)
        };
        setResult(resultWithPreview);
      } else {
        setResult(null);
      }
    } else {
      // 이미지가 없으면 모든 상태 초기화
      setSelectedFile(null);
      setIsImageAnalyzed(false);
      setResult(null);
      setError(null);
      clearAnalysisData(); // 분석 데이터도 삭제
    }
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile || isImageAnalyzed) return;

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
      const resultWithPreview = {
        ...data,
        previewImageUrl: selectedFile ? URL.createObjectURL(selectedFile) : ''
      };
      
      setResult(resultWithPreview);
      
      // 이미지 분석 완료를 표시
      setIsImageAnalyzed(true);
      
      // 분석 상태와 결과를 저장 (새로고침 대비)
      saveImageAnalyzedState(true);
      saveAnalysisResult(data);
      
      console.log('분석 완료 및 상태 저장');
      
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || '문제가 발생했습니다');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setShowAd(false), 1000);
    }
  };

  const handleReset = () => {
    // 결과와 이미지 상태를 모두 초기화
    setResult(null);
    setError(null);
    setIsImageAnalyzed(false); // 분석 상태 초기화
    setSelectedFile(null); // 이미지도 초기화
    
    // 이미지와 분석 관련 저장 데이터 모두 제거
    clearImageFromLocalStorage();
    clearAnalysisData();
    
    // 이미지 컴포넌트 초기화 트리거 증가
    setResetTrigger(prev => prev + 1);
    
    console.log('분석 상태 및 이미지 초기화');
  };

  // Determine the app URL for sharing
  const appUrl = typeof window !== 'undefined' ? window.location.origin + '/ko' : 'https://name-recommender.app/ko';

  return (
    <div className="min-h-screen py-8 px-4 bg-pink-50">
      <div className="max-w-md mx-auto">
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
        {/* 햄버거 메뉴 컴포넌트 */}
        <SideMenu language="ko" />
        
        {/* Main content area */}
        <div className="w-full">
            {!result && !isAnalyzing && (
              <>
                <PhotoUploader 
                  onUpload={handleFileUpload}
                  uploadText={{
                    title: translations.uploadTitle,
                    instructions: translations.uploadInstructions,
                    button: translations.analyze,
                  }}
                  resetTrigger={resetTrigger}
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
                  
                  <div className="mt-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || isImageAnalyzed || isAnalyzing}
                      className={`px-6 py-3 ${!selectedFile || isImageAnalyzed || isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'} text-white rounded-lg transition-colors font-semibold`}
                    >
                      {!selectedFile ? '사진을 업로드해주세요' : 
                       isImageAnalyzed ? '분석 완료 (새 사진 업로드 필요)' : 
                       translations.analyze}
                    </button>
                  </div>
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
      </main>

      <UserCounter language="ko" />
      <Footer />
      </div>
    </div>
  );
}
