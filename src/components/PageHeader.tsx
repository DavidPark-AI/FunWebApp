'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const pathname = usePathname();
  
  // 현재 언어 확인 (URL 경로에서 추출)
  let currentLang = 'en';
  if (pathname) {
    if (pathname.startsWith('/ko')) {
      currentLang = 'ko';
    } else if (pathname.startsWith('/ja')) {
      currentLang = 'ja';
    }
  }
  
  // 언어별 홈 경로 및 버튼 텍스트
  const homePath = `/${currentLang}`;
  
  const translations = {
    en: 'Back to Home',
    ko: '홈으로 돌아가기',
    ja: 'ホームに戻る'
  };
  
  const buttonText = translations[currentLang as keyof typeof translations];
  
  return (
    <header className="max-w-4xl mx-auto text-center mb-8">
      <div className="flex justify-between items-center mb-4">
        <Link 
          href={homePath} 
          className="px-4 py-2 bg-pink-300 text-pink-900 rounded-md hover:bg-pink-400 transition-colors font-medium shadow-sm border border-pink-200"
        >
          {buttonText}
        </Link>
        
        <LanguageSwitcher />
      </div>
      <h1 className="inline-block text-4xl font-bold text-primary-600 bg-pink-100 px-6 py-3 rounded-lg shadow-sm border border-pink-200">{title}</h1>
    </header>
  );
}
