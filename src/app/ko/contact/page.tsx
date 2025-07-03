'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <PageHeader title="문의하기" />

      <main className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="prose">
          <p className="mb-4">
            이름 추천기 앱에 관심을 가져주셔서 감사합니다. 질문, 우려사항 또는 피드백이 있으시면 
            언제든지 연락해 주세요:
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">이메일 연락처</h2>
          <p className="mb-2">
            일반 문의, 도움 요청 또는 피드백:
            <br />
            <a href="mailto:sm82.park@gmail.com" className="text-primary-600 hover:underline">
              sm82.park@gmail.com
            </a>
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">응답 시간</h2>
          <p>
            모든 문의에 2-3 영업일 이내에 응답하기 위해 노력하고 있습니다. 
            그러나 바쁜 기간에는 응답이 조금 더 오래 걸릴 수 있습니다. 
            이해해 주셔서 감사합니다.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
