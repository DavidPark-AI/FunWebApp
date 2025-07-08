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

export default function UserCounter({ language }: UserCounterProps) {
  const [userCount, setUserCount] = useState<number>(0);
  const content = translations[language] || translations.en;

  useEffect(() => {
    // 로컬 스토리지에서 사용자 카운트 불러오기
    const storedCount = localStorage.getItem('appUserCount');
    const count = storedCount ? parseInt(storedCount, 10) : 0;
    
    // 현재 사용자를 카운트에 추가하고 저장
    const newCount = count + 1;
    localStorage.setItem('appUserCount', newCount.toString());
    
    // 초기 카운트 설정 (실제로는 API에서 가져와야 함)
    setUserCount(Math.max(3968379, newCount)); // 최소 초기값 + 증가된 카운트
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
