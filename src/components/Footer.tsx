import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 언어별 텍스트 정의
const translations = {
  en: {
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© {year} Name Recommender',
    poweredBy: 'Powered by OpenAI Technology'
  },
  ko: {
    contact: '문의하기',
    privacy: '개인정보처리방침',
    terms: '서비스 이용약관',
    copyright: '© {year} 이름 추천기',
    poweredBy: 'OpenAI 기술 제공'
  },
  ja: {
    contact: 'お問い合わせ',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
    copyright: '© {year} 名前レコメンダー',
    poweredBy: 'OpenAI技術搭載'
  }
};

export default function Footer() {
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
  
  // 선택된 언어의 번역 텍스트 가져오기
  const t = translations[currentLang as keyof typeof translations];
  const year = new Date().getFullYear();
  
  return (
    <footer className="max-w-4xl mx-auto mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
      <div className="mb-4 flex justify-center space-x-6">
        <Link href={`/${currentLang}/contact`} className="hover:text-primary-600 transition-colors">
          {t.contact}
        </Link>
        <Link href={`/${currentLang}/privacy`} className="hover:text-primary-600 transition-colors">
          {t.privacy}
        </Link>
        <Link href={`/${currentLang}/terms`} className="hover:text-primary-600 transition-colors">
          {t.terms}
        </Link>
      </div>
      <p>{t.copyright.replace('{year}', year.toString())}</p>
      <p className="mt-1">{t.poweredBy}</p>
    </footer>
  );
}
