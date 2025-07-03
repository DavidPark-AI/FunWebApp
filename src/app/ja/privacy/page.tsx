'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-pink-50">
      <PageHeader title="プライバシーポリシー" />

      <main className="max-w-2xl mx-auto bg-yellow-50 p-8 rounded-lg shadow-md border border-yellow-100">
        <div className="prose">
          <p className="text-sm text-gray-500 mb-4">最終更新日: 2025年7月3日</p>
          
          <p className="mb-4">
            名前レコメンダーへようこそ。私たちはあなたの個人情報を尊重し、保護することに尽力しています。
            このプライバシーポリシーは、当ウェブサイトをご利用いただく際に、あなたの個人情報をどのように取り扱うかについてお知らせし、
            あなたのプライバシーの権利と法律による保護について説明するものです。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">1. 収集するデータ</h2>
          <p className="mb-4">
            <strong>個人データ:</strong> 当サービスをご利用いただく際に、以下のデータを収集することがあります：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>名前推薦のためにアップロードした画像</li>
            <li>お問い合わせフォームを通じて提供された情報</li>
            <li>IPアドレス、ブラウザのタイプとバージョン、タイムゾーン設定、ブラウザプラグインのタイプとバージョン、オペレーティングシステムとプラットフォームなどの技術データ</li>
            <li>ウェブサイトの使用方法に関する使用データ</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. データの使用方法</h2>
          <p className="mb-2">あなたの個人データは、以下の目的で使用されます：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>名前推薦サービスの提供と改善</li>
            <li>お問い合わせへの対応</li>
            <li>ウェブサイトの維持と改善</li>
            <li>ユーザーエクスペリエンス向上のための使用パターンの分析</li>
            <li>関連広告の表示</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. 第三者サービスと広告</h2>
          <p className="mb-4">
            当ウェブサイトでは、広告表示のためにGoogle AdSenseを使用しています。Googleは、あなたの閲覧履歴に基づいてパーソナライズされた広告を提供するためにクッキーを使用します。
            Googleの広告クッキーの使用により、Googleとそのパートナーはあなたのサイト訪問や他のインターネットサイトの訪問に基づいて広告を提供することができます。
          </p>
          <p className="mb-4">
            <strong>第三者クッキー:</strong> 当社独自のクッキーに加えて、サービス使用統計を報告し、サービスを通じて広告を提供するために、様々な第三者クッキーを使用することがあります。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. 広告に関する選択肢</h2>
          <p className="mb-4">
            <a href="https://www.google.com/settings/ads" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Google広告設定</a>にアクセスして、パーソナライズド広告をオプトアウトすることができます。
            また、<a href="https://www.aboutads.info" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>を訪問して、一部（すべてではありません）の第三者ベンダーのパーソナライズド広告のためのクッキー使用をオプトアウトすることもできます。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. データの保存とセキュリティ</h2>
          <p className="mb-4">
            アップロードされた画像は名前推薦のために処理され、当社のサーバーに永続的に保存されることはありません。
            私たちは、あなたの個人情報を不正アクセス、改ざん、開示、または破壊から保護するために適切なセキュリティ対策を実施しています。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. あなたの権利</h2>
          <p className="mb-4">
            お住まいの地域によっては、個人データに関して以下の権利を持つ場合があります：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>情報へのアクセス、更新、または削除する権利</li>
            <li>訂正する権利</li>
            <li>処理に異議を唱える権利</li>
            <li>データポータビリティの権利</li>
            <li>同意を撤回する権利</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. プライバシーポリシーの変更</h2>
          <p className="mb-4">
            当社は、随時プライバシーポリシーを更新することがあります。変更がある場合は、このページに新しいプライバシーポリシーを掲載してお知らせします。
            変更がないか定期的にこのプライバシーポリシーを確認することをお勧めします。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. お問い合わせ</h2>
          <p className="mb-4">
            このプライバシーポリシーについて質問がある場合は、以下までご連絡ください：
            <br />
            <a href="mailto:sm82.park@gmail.com" className="text-primary-600 hover:underline">
              sm82.park@gmail.com
            </a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
