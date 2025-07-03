'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <PageHeader title="서비스 이용약관" />

      <main className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="prose">
          <p className="text-sm text-gray-500 mb-4">최종 업데이트: 2025년 7월 3일</p>
          
          <p className="mb-4">
            이름 추천기 웹사이트를 이용하기 전에 이 서비스 이용약관("약관", "서비스 이용약관")을 주의 깊게 읽어주세요.
            서비스에 대한 액세스 및 사용은 귀하의 이 약관 수락과 준수를 조건으로 합니다.
            이 약관은 서비스에 접근하거나 사용하는 모든 방문자, 사용자 및 기타 사람들에게 적용됩니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">1. 약관 수락</h2>
          <p className="mb-4">
            서비스에 접근하거나 사용함으로써 귀하는 이 약관에 구속되는 것에 동의합니다. 
            약관의 일부에 동의하지 않는 경우 서비스에 접근할 수 없습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. 서비스 설명</h2>
          <p className="mb-4">
            이름 추천기는 사용자가 업로드한 이미지를 기반으로 이름 추천을 제공하는 서비스입니다.
            추천은 인공지능을 사용하여 생성되며 오직 엔터테인먼트 및 참고용으로만 제공됩니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. 사용자 책임</h2>
          <p className="mb-4">저희 서비스를 사용할 때 다음에 동의합니다:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>필요할 때 정확한 정보 제공</li>
            <li>합법적인 목적으로만 서비스 사용</li>
            <li>지적 재산권을 침해하는 콘텐츠 업로드 금지</li>
            <li>동의 없이 다른 개인의 이미지 업로드 금지</li>
            <li>서비스를 이용해 다른 사람을 괴롭히거나 학대하거나 해치는 행위 금지</li>
            <li>서비스의 보안을 방해하거나 손상시키려는 시도 금지</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. 지적 재산권</h2>
          <p className="mb-4">
            서비스와 해당 원본 콘텐츠, 기능 및 기능은 이름 추천기와 그 라이센스 제공자의 독점 재산이며 앞으로도 그렇게 유지될 것입니다. 
            이 서비스는 저작권, 상표 및 기타 법률로 보호됩니다.
            당사의 상표와 상표 디자인은 사전 서면 동의 없이 다른 제품이나 서비스와 관련하여 사용될 수 없습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. 보증 면책</h2>
          <p className="mb-4">
            서비스는 명시적이든 묵시적이든 어떤 종류의 보증 없이 "있는 그대로" 및 "사용 가능한 대로" 제공됩니다.
            저희는 서비스를 통해 제공되는 이름 추천의 정확성, 완전성 또는 유용성을 보장하지 않습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. 책임 제한</h2>
          <p className="mb-4">
            이름 추천기나 그 이사, 직원, 파트너, 에이전트, 공급업체 또는 계열사는 어떠한 경우에도 
            서비스 접근이나 사용 또는 접근 불가로 인한 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 
            책임을 지지 않습니다. 여기에는 이익, 데이터, 사용, 신용 또는 기타 무형 손실이 포함됩니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. 제3자 링크</h2>
          <p className="mb-4">
            저희 서비스에는 이름 추천기가 소유하거나 관리하지 않는 제3자 웹사이트나 서비스에 대한 링크가 포함될 수 있습니다.
            저희는 모든 제3자 웹사이트 또는 서비스의 콘텐츠, 개인정보 보호정책 또는 관행에 대해 통제권이 없으며 책임을 지지 않습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. 약관 변경</h2>
          <p className="mb-4">
            저희는 언제든지 이 약관을 수정하거나 교체할 권리를 보유합니다. 변경사항을 주기적으로 검토하는 것은 귀하의 책임입니다.
            변경 사항 게시 후 지속적인 서비스 이용은 해당 변경 사항 수락을 의미합니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">9. 준거법</h2>
          <p className="mb-4">
            이 약관은 법률 충돌 규정과 관계없이 법률에 따라 관리되고 해석됩니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">10. 문의하기</h2>
          <p className="mb-4">
            이 약관에 대해 궁금한 점이 있으시면 다음으로 연락해 주세요:
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
