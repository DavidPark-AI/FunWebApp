import React from 'react';

interface InfoSidebarProps {
  language: 'en' | 'ko' | 'ja';
}

// Translations for different languages
const translations = {
  en: {
    about: 'About',
    aboutContent: 'WhatIsYourName - Created by David Park',
    faq: 'FAQ',
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
    privacy: 'Privacy',
    privacyContent: 'This application sends user photos to an external LLM for analysis and never stores user photos on any server.'
  },
  ko: {
    about: '소개',
    aboutContent: 'WhatIsYourName - David Park가 제작',
    faq: '자주 묻는 질문',
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
    privacy: '개인정보',
    privacyContent: '본 애플리케이션은 사용자의 사진을 외부 LLM으로 전송하여 분석결과를 받아오며, 별도의 서버에 사용자 사진을 절대로 저장하지 않습니다.'
  },
  ja: {
    about: 'アプリ情報',
    aboutContent: 'WhatIsYourName - David Parkによる作成',
    faq: 'よくある質問',
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
    privacy: 'プライバシー',
    privacyContent: 'このアプリケーションは、ユーザーの写真を外部LLMに送信して分析結果を取得し、いかなるサーバーにもユーザーの写真を保存することはありません。'
  }
};

export default function InfoSidebar({ language }: InfoSidebarProps) {
  const content = translations[language] || translations.en;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      {/* About Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary-600 mb-2">{content.about}</h3>
        <p className="text-sm text-gray-700">{content.aboutContent}</p>
      </div>
      
      {/* FAQ Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary-600 mb-2">{content.faq}</h3>
        <div className="space-y-3">
          {content.faqContent.map((faq, index) => (
            <div key={index}>
              <p className="text-sm font-medium text-gray-800">{faq.question}</p>
              <p className="text-xs text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Privacy Section */}
      <div>
        <h3 className="text-lg font-semibold text-primary-600 mb-2">{content.privacy}</h3>
        <p className="text-xs text-gray-600">{content.privacyContent}</p>
      </div>
    </div>
  );
}
