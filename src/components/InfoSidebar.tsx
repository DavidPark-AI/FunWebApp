import React from 'react';
import Image from 'next/image';

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
    examples: 'Examples',
    examplesTitle: 'See how it works',
    examplesContent: 'Upload a clear photo of your face, and our AI will analyze your features and suggest a name that suits you based on your appearance.',
    sampleResults: [
      {
        name: 'Daniel',
        pronunciation: 'DAN-yəl',
        reason: 'A friendly name that matches your warm smile and approachable features.'
      },
      {
        name: '민준 (Min-jun)',
        pronunciation: 'Min-joon',
        reason: 'Reflects your thoughtful expression and confident demeanor.'
      }
    ],
    howTo: 'How to use:',
    steps: [
      'Upload a clear photo showing your face',
      'Select your preferred name language',
      'Click "Analyze Photo" to get your result'
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
    examples: '사용 예시',
    examplesTitle: '작동 방식 보기',
    examplesContent: '얼굴이 잘 보이는 사진을 업로드하면, AI가 당신의 특징을 분석하여 외모에 어울리는 이름을 추천합니다.',
    sampleResults: [
      {
        name: '준서',
        pronunciation: 'Joon-seo',
        reason: '따뜻한 미소와 친근한 인상에 어울리는 신뢰감 있는 이름입니다.'
      },
      {
        name: 'Alex',
        pronunciation: '알렉스',
        reason: '지적이고 자신감 있는 모습에 어울리는 국제적인 이름입니다.'
      }
    ],
    howTo: '사용 방법:',
    steps: [
      '얼굴이 잘 보이는 사진을 업로드하세요',
      '원하는 이름 언어를 선택하세요',
      '"사진 분석하기" 버튼을 클릭하여 결과를 확인하세요'
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
    examples: '使用例',
    examplesTitle: '使い方を見る',
    examplesContent: '顔がはっきり見える写真をアップロードすると、AIがあなたの特徴を分析し、外見に合った名前を提案します。',
    sampleResults: [
      {
        name: '健太 (Kenta)',
        pronunciation: 'ケンタ',
        reason: '明るい表情と親しみやすい印象に合う、活発な印象の名前です。'
      },
      {
        name: 'Emma',
        pronunciation: 'エマ',
        reason: '知的で優しい雰囲気を反映した国際的な名前です。'
      }
    ],
    howTo: '使い方:',
    steps: [
      '顔がはっきり見える写真をアップロードしてください',
      '希望する名前の言語を選択してください',
      '「写真を分析する」ボタンをクリックして結果を確認してください'
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
