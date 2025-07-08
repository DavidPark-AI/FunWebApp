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
  try {
    const count = localStorage.getItem('analysisCount');
    console.log('🔍 getAnalysisCount() - 가져온 분석 카운트:', count);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('❌ localStorage에서 카운트를 가져오는 중 오류:', error);
    return 0;
  }
}

// 분석 카운트를 저장하고 클라이언트에 통지하는 함수
export function incrementAnalysisCount(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const currentCount = getAnalysisCount();
    const newCount = currentCount + 1;
    
    console.log('⬆️ incrementAnalysisCount() - 현재 카운트:', currentCount, '->', newCount);
    
    // 로컬 스토리지 업데이트
    localStorage.setItem('analysisCount', newCount.toString());
    
    // 사용자 정의 이벤트 발생 (즉시)
    try {
      const updateEvent = new CustomEvent('analysisCountUpdated', { detail: { count: newCount } });
      console.log('🔔 이벤트 발생: analysisCountUpdated', { count: newCount });
      window.dispatchEvent(updateEvent);
      console.log('✅ 이벤트 발생 완료');
    } catch (error) {
      console.error('❌ 분석 카운트 이벤트 발생 중 오류:', error);
    }
  } catch (error) {
    console.error('❌ incrementAnalysisCount 함수 실행 중 오류:', error);
  }
}

export default function UserCounter({ language }: UserCounterProps) {
  const [userCount, setUserCount] = useState<number>(0);
  const content = translations[language] || translations.en;

  useEffect(() => {
    // 컴포넌트 마운트 시 초기값 설정
    const initialCount = getAnalysisCount();
    console.log('🚀 UserCounter - 초기 분석 카운트 로드:', initialCount);
    setUserCount(initialCount);
    
    // 실시간 업데이트를 위한 사용자 정의 이벤트 리스너 추가
    const handleAnalysisCountUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('👂 이벤트 수신: analysisCountUpdated', customEvent.detail);
      
      if (customEvent.detail && typeof customEvent.detail.count === 'number') {
        const newCount = customEvent.detail.count;
        console.log('🔄 카운터 업데이트 (이벤트로부터):', userCount, '->', newCount);
        setUserCount(newCount);
      } else {
        const newCount = getAnalysisCount();
        console.log('🔄 카운터 업데이트 (localStorage에서 가져옴):', userCount, '->', newCount);
        setUserCount(newCount);
      }
    };
    
    // 저장소에서 직접 읽기 (다른 탭에서 변경 시)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'analysisCount') {
        const newCount = getAnalysisCount();
        console.log('storage 이벤트: 카운터 업데이트', userCount, '->', newCount);
        setUserCount(newCount);
      }
    };
    
    // 두 이벤트 모두 등록 (현재 탭에서는 사용자 정의 이벤트, 다른 탭에서는 storage 이벤트)
    window.addEventListener('analysisCountUpdated', handleAnalysisCountUpdated);
    window.addEventListener('storage', handleStorageChange);
    
    // 카운트 강제 새로고침 타이머 (추가)
    const refreshTimer = setInterval(() => {
      const currentCount = getAnalysisCount();
      if (currentCount !== userCount) {
        console.log('타이머: 카운트 업데이트', userCount, '->', currentCount);
        setUserCount(currentCount);
      }
    }, 2000); // 2초마다 확인
    
    return () => {
      window.removeEventListener('analysisCountUpdated', handleAnalysisCountUpdated);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(refreshTimer);
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
