'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-pink-50">
      <PageHeader title="利用規約" />

      <main className="max-w-2xl mx-auto bg-yellow-50 p-8 rounded-lg shadow-md border border-yellow-100">
        <div className="prose">
          <p className="text-sm text-gray-500 mb-4">最終更新日: 2025年7月3日</p>
          
          <p className="mb-4">
            名前レコメンダーウェブサイトをご利用になる前に、この利用規約（「規約」、「利用規約」）をよくお読みください。
            サービスへのアクセスおよび使用は、お客様がこれらの規約を受け入れ、遵守することを条件とします。
            この規約は、サービスにアクセスまたは使用するすべての訪問者、ユーザー、その他の人々に適用されます。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">1. 規約の同意</h2>
          <p className="mb-4">
            サービスにアクセスまたは使用することにより、あなたはこれらの規約に拘束されることに同意します。
            規約の一部に同意しない場合は、サービスにアクセスできません。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. サービスの説明</h2>
          <p className="mb-4">
            名前レコメンダーは、ユーザーがアップロードした画像に基づいて名前の推薦を提供するサービスです。
            推薦は人工知能を使用して生成され、エンターテイメントおよび参考のみを目的としています。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. ユーザーの責任</h2>
          <p className="mb-4">当サービスをご利用の際は、以下に同意していただきます：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>必要に応じて正確な情報を提供すること</li>
            <li>合法的な目的のみにサービスを使用すること</li>
            <li>知的財産権を侵害するコンテンツをアップロードしないこと</li>
            <li>同意なしに他の個人の画像をアップロードしないこと</li>
            <li>サービスを使用して他人を嫌がらせ、虐待、または危害を加えないこと</li>
            <li>サービスのセキュリティを妨害したり、損なったりしようとしないこと</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. 知的財産権</h2>
          <p className="mb-4">
            サービスとその元のコンテンツ、特徴、機能は名前レコメンダーとそのライセンサーの独占的な財産であり、今後もそうであり続けます。
            このサービスは、著作権、商標、その他の法律によって保護されています。
            当社の商標および商標デザインは、事前の書面による同意なしに、いかなる製品またはサービスと関連して使用することはできません。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. 保証の免責</h2>
          <p className="mb-4">
            サービスは、明示的または黙示的を問わず、いかなる種類の保証もなく「現状のまま」および「利用可能な限り」提供されます。
            私たちは、当サービスを通じて提供される名前推薦の正確性、完全性、または有用性を保証しません。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. 責任の制限</h2>
          <p className="mb-4">
            名前レコメンダー、その取締役、従業員、パートナー、代理人、サプライヤー、または関連会社は、いかなる場合においても、
            サービスへのアクセスや使用、またはアクセスできないことに起因する間接的、付随的、特別、結果的、または懲罰的損害について責任を負いません。
            これには、利益、データ、使用、信用、その他の無形の損失が含まれます。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. 第三者リンク</h2>
          <p className="mb-4">
            当サービスには、名前レコメンダーが所有または管理していない第三者のウェブサイトやサービスへのリンクが含まれている場合があります。
            私たちは、第三者のウェブサイトやサービスのコンテンツ、プライバシーポリシー、または実践について管理しておらず、責任を負いません。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. 規約の変更</h2>
          <p className="mb-4">
            私たちは、いつでもこれらの規約を変更または置き換える権利を留保します。変更を定期的に確認することはあなたの責任です。
            変更が投稿された後も継続してサービスを使用することは、その変更を受け入れたことを意味します。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">9. 準拠法</h2>
          <p className="mb-4">
            これらの規約は、法律の抵触に関する規定にかかわらず、法律に基づいて管理され、解釈されます。
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">10. お問い合わせ</h2>
          <p className="mb-4">
            これらの規約について質問がある場合は、以下までご連絡ください：
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
