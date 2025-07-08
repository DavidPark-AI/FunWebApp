'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SideMenuProps {
  language: 'en' | 'ko' | 'ja';
}

// Translations for different languages
const translations = {
  en: {
    menuTitle: 'Menu',
    about: 'About',
    faq: 'Frequently Asked Questions',
    privacy: 'Privacy',
    closeMenu: 'Close Menu',
    userCount: 'People who have discovered their names so far:',
    aboutContent: 'WhatIsYourName - Created by David Park',
    faqContent: [
      {
        question: 'How does this app work?',
        answer: 'This app analyzes your photo using AI and recommends names that match your appearance.'
      },
      {
        question: 'Is my photo stored?',
        answer: 'No, we do not store your photos on any server.'
      }
    ],
    privacyContent: 'This application sends user photos to an external LLM for analysis and never stores user photos on any server.'
  },
  ko: {
    menuTitle: '메뉴',
    about: '소개',
    faq: '자주 묻는 질문',
    privacy: '개인정보',
    closeMenu: '메뉴 닫기',
    userCount: '지금까지 이름을 알아본 사람이',
    aboutContent: 'WhatIsYourName - David Park가 제작',
    faqContent: [
      {
        question: '이 앱은 어떻게 작동하나요?',
        answer: '이 앱은 AI를 사용하여 사진을 분석하고 외모에 맞는 이름을 추천합니다.'
      },
      {
        question: '제 사진이 저장되나요?',
        answer: '아니요, 저희는 어떤 서버에도 사진을 저장하지 않습니다.'
      }
    ],
    privacyContent: '본 애플리케이션은 사용자의 사진을 외부 LLM으로 전송하여 분석결과를 받아오며, 별도의 서버에 사용자 사진을 절대로 저장하지 않습니다.'
  },
  ja: {
    menuTitle: 'メニュー',
    about: 'アプリ情報',
    faq: 'よくある質問',
    privacy: 'プライバシー',
    closeMenu: '閉じる',
    userCount: 'これまでに名前を調べた人は',
    aboutContent: 'WhatIsYourName - David Parkによる作成',
    faqContent: [
      {
        question: 'このアプリはどのように機能しますか？',
        answer: 'このアプリはAIを使用してあなたの写真を分析し、外見に合った名前を推薦します。'
      },
      {
        question: '私の写真は保存されますか？',
        answer: 'いいえ、私たちはいかなるサーバーにも写真を保存しません。'
      }
    ],
    privacyContent: 'このアプリケーションは、ユーザーの写真を外部LLMに送信して分析結果を取得し、いかなるサーバーにもユーザーの写真を保存することはありません。'
  }
};

export default function SideMenu({ language }: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
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

  // 이미 열린 섹션을 다시 클릭하면 닫히도록 토글 처리
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <>
      {/* 햄버거 메뉴 버튼 - 모바일에서는 왼쪽 상단, PC에서는 현재 위치 유지 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 md:left-[40%] md:-translate-x-1/2 z-40 p-2 rounded-md bg-pink-300 shadow-md hover:bg-pink-400 transition-colors border border-pink-200"
        aria-label="메뉴 열기"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="w-6 h-6 text-pink-900"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </button>



      {/* 사이드 메뉴 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* 사이드 메뉴 */}
            <motion.div 
              className="fixed top-0 left-0 h-full w-3/4 max-w-sm bg-yellow-50 z-50 shadow-xl overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* 메뉴 헤더 */}
              <div className="flex justify-between items-center p-4 border-b border-yellow-200">
                <h2 className="text-xl font-bold text-indigo-700">{content.menuTitle}</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-yellow-100"
                  aria-label={content.closeMenu}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-gray-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

              {/* 메뉴 콘텐츠 */}
              <div className="p-4">
                {/* 소개 섹션 */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleSection('about')}
                    className="w-full flex justify-between items-center p-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-indigo-700">{content.about}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${activeSection === 'about' ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeSection === 'about' && (
                    <div className="mt-2 p-3 bg-white rounded-md shadow-sm">
                      <p className="text-sm text-indigo-600">{content.aboutContent}</p>
                    </div>
                  )}
                </div>
                
                {/* 자주 묻는 질문 섹션 */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleSection('faq')}
                    className="w-full flex justify-between items-center p-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-indigo-700">{content.faq}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${activeSection === 'faq' ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeSection === 'faq' && (
                    <div className="mt-2 p-3 bg-white rounded-md shadow-sm space-y-3">
                      {content.faqContent.map((faq, index) => (
                        <div key={index}>
                          <p className="text-sm font-medium text-indigo-800">{faq.question}</p>
                          <p className="text-xs text-indigo-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 개인정보 섹션 */}
                <div>
                  <button
                    onClick={() => toggleSection('privacy')}
                    className="w-full flex justify-between items-center p-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-indigo-700">{content.privacy}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${activeSection === 'privacy' ? 'transform rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {activeSection === 'privacy' && (
                    <div className="mt-2 p-3 bg-white rounded-md shadow-sm">
                      <p className="text-xs text-indigo-600">{content.privacyContent}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
