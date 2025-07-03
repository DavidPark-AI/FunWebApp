'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <PageHeader title="お問い合わせ" />

      <main className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="prose">
          <p className="mb-4">
            名前レコメンダーアプリに関心をお持ちいただき、ありがとうございます。ご質問、ご懸念、またはフィードバックがございましたら、
            お気軽にご連絡ください：
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">メールでのお問い合わせ</h2>
          <p className="mb-2">
            一般的なお問い合わせ、サポート、またはフィードバック：
            <br />
            <a href="mailto:sm82.park@gmail.com" className="text-primary-600 hover:underline">
              sm82.park@gmail.com
            </a>
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">返信時間</h2>
          <p>
            すべてのお問い合わせに2〜3営業日以内に返信するよう努めております。
            ただし、混雑している時期には、返信にもう少し時間がかかる場合があります。
            ご理解とご協力をお願いいたします。
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
