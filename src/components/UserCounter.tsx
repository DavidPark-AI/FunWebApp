'use client';

import { useState, useEffect } from 'react';

interface UserCounterProps {
  language: 'en' | 'ko' | 'ja';
}

const translations = {
  en: {
    userCount: 'People who have discovered their names so far:'
  },
  ko: {
    userCount: '지금까지 이름을 알아본 사람이'
  },
  ja: {
    userCount: 'これまでに名前を調べた人は'
  }
};

// 로컬 스토리지에서 분석 카운트를 가져오는 함수
function getAnalysisCount(): number {
  if (typeof window === 'undefined') return 0;
  const count = localStorage.getItem('analysisCount');
  return count ? parseInt(count, 10) : 0;
}

// 로컬 스토리지에 분석 카운트를 저장하는 함수
export function incrementAnalysisCount(): void {
  if (typeof window === 'undefined') return;
  const currentCount = getAnalysisCount();
  localStorage.setItem('analysisCount', (currentCount + 1).toString());
}

export default function UserCounter({ language }: UserCounterProps) {
  const [userCount, setUserCount] = useState<number>(0);
  const content = translations[language] || translations.en;

  useEffect(() => {
    // 실제 분석 카운트만 가져오기
    const analysisCount = getAnalysisCount();
    setUserCount(analysisCount);
    
    // 실시간 업데이트를 위한 storage 이벤트 리스너 추가
    const handleStorageChange = () => {
      setUserCount(getAnalysisCount());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="mt-8 mb-8 text-center">
      <div className="inline-block p-3 px-6 rounded-lg bg-pink-100 shadow-md border border-pink-200">
        <p className="text-sm font-medium text-gray-700">
          {content.userCount} <span className="font-bold text-primary-600">{userCount.toLocaleString()}</span>
          {language === 'ko' ? '명이예요.' : language === 'ja' ? '人です。' : ' people.'}
        </p>
      </div>
    </div>
  );
}
