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
import Footer from '@/components/Footer';
import UserCounter from '@/components/UserCounter';

// Language content for Japanese UI
const translations = {
  title: '私の名前は？',
  subtitle: '🤔私の名前は私の顔に合ってる？\nあなたの顔に本当に合う名前は実は...🫢',
  uploadTitle: '写真をアップロード',
  uploadInstructions: '写真をドラッグ＆ドロップするか、クリックしてアップロードしてください（最大5MB）',
  languageSelect: '名前の言語を選択',
  korean: '韓国語',
  english: '英語',
  japanese: '日本語',
  analyze: '写真を分析',
  analyzing: '分析中...',
  results: {
    title: 'おすすめの名前',
    pronunciation: '発音',
    reason: 'おすすめの理由',
    saveImage: '画像として保存',
    share: '結果をシェア',
    tryAgain: '別の写真を試す',
    shareApp: 'このアプリを友達と共有'
  },
  error: {
    title: 'エラーが発生しました',
    message: '写真の分析中にエラーが発生しました。もう一度お試しください。',
    button: '再試行'
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
    // 前のデータを初期化
    setSelectedFile(file);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setShowAd(false);
    
    // 新しい画像を保存する前に、既存の画像を削除
    clearImageFromLocalStorage();
    
    // 新しい画像を保存
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
      formData.append('uiLanguage', 'ja');

      // Short timeout to show the ad before processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch('/api/get-name-recommendation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '画像の分析に失敗しました');
      }

      const data = await response.json();
      console.log('Client received response:', data);
      
      // 結果オブジェクトに選択された画像を追加します
      setResult({
        ...data,
        previewImageUrl: selectedFile ? URL.createObjectURL(selectedFile) : ''
      });
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || '問題が発生しました');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setShowAd(false), 1000);
    }
  };

  const handleReset = () => {
    // 結果だけをリセットし、画像は保持
    setResult(null);
    setError(null);
    
    // 新しい推薦のために画像を保持
    // 画像を完全に削除しない (clearImageFromLocalStorage を使用しない)
  };

  // Determine the app URL for sharing
  const appUrl = typeof window !== 'undefined' ? window.location.origin + '/ja' : 'https://name-recommender.app/ja';

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
        <ExampleDisplay language="ja" />
      </div>

      <main className="max-w-4xl mx-auto">
        {/* ハンバーガーメニューコンポーネント */}
        <SideMenu language="ja" />
        
        {/* メインコンテンツエリア */}
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
                  maxSizeInBytes={5 * 1024 * 1024} // 5MB
                />

                <div className="mt-3 flex flex-col items-center">
                  <div className="mb-3">
                    <p className="mb-2 text-sm text-gray-600 text-center">
                      {translations.languageSelect}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNameLanguage('korean')}
                        className={`px-3 py-1 rounded text-sm ${nameLanguage === 'korean' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                      >
                        🇰🇷 {translations.korean}
                      </button>
                      <button
                        onClick={() => setNameLanguage('english')}
                        className={`px-3 py-1 rounded text-sm ${nameLanguage === 'english' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                      >
                        🇺🇸 {translations.english}
                      </button>
                      <button
                        onClick={() => setNameLanguage('japanese')}
                        className={`px-3 py-1 rounded text-sm ${nameLanguage === 'japanese' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} font-medium transition-colors`}
                      >
                        🇯🇵 {translations.japanese}
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
      </main>

      <UserCounter language="ja" />
      <Footer />
      </div>
    </div>
  );
}
