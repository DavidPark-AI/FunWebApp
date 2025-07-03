'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <PageHeader title="개인정보처리방침" />

      <main className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="prose">
          <p className="text-sm text-gray-500 mb-4">최종 업데이트: 2025년 7월 3일</p>
          
          <p className="mb-4">
            이름 추천기에 오신 것을 환영합니다. 저희는 귀하의 개인정보를 존중하고 보호하기 위해 최선을 다하고 있습니다.
            이 개인정보처리방침은 귀하가 저희 웹사이트를 방문할 때 개인정보를 어떻게 관리하는지 알려드리며,
            귀하의 개인정보 권리와 법률이 어떻게 보호하는지에 대해 안내해 드립니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">1. 수집하는 데이터</h2>
          <p className="mb-4">
            <strong>개인 데이터:</strong> 서비스 이용 시 다음과 같은 데이터를 수집할 수 있습니다:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>이름 추천을 위해 업로드한 이미지</li>
            <li>문의 양식을 통해 제공하신 정보</li>
            <li>IP 주소, 브라우저 유형 및 버전, 시간대 설정, 브라우저 플러그인 유형 및 버전, 운영 체제 및 플랫폼 등 기술 데이터</li>
            <li>웹사이트 사용 방식에 관한 사용 데이터</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. 데이터 사용 방법</h2>
          <p className="mb-2">귀하의 개인 데이터는 다음과 같은 목적으로 사용됩니다:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>이름 추천 서비스 제공 및 개선</li>
            <li>문의 응답</li>
            <li>웹사이트 유지보수 및 개선</li>
            <li>사용자 경험 향상을 위한 사용 패턴 분석</li>
            <li>관련 광고 표시</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. 제3자 서비스 및 광고</h2>
          <p className="mb-4">
            저희 웹사이트는 광고 표시를 위해 Google 애드센스를 사용합니다. Google은 귀하의 검색 기록을 바탕으로 개인 맞춤형 광고를 제공하기 위해 쿠키를 사용합니다.
            Google의 광고 쿠키 사용으로 Google과 그 파트너는 귀하의 저희 사이트 방문 및/또는 다른 인터넷 사이트 방문을 기반으로 광고를 제공할 수 있습니다.
          </p>
          <p className="mb-4">
            <strong>제3자 쿠키:</strong> 저희 자체 쿠키 외에도 서비스 사용 통계를 보고하고 서비스를 통해 광고를 제공하기 위해 다양한 제3자 쿠키를 사용할 수 있습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. 광고에 대한 선택권</h2>
          <p className="mb-4">
            <a href="https://www.google.com/settings/ads" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>을 방문하여 맞춤형 광고를 거부할 수 있습니다.
            또한 <a href="https://www.aboutads.info" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>를 방문하여 일부(모든 것은 아님) 제3자 공급업체의 맞춤형 광고를 위한 쿠키 사용을 거부할 수 있습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. 데이터 저장 및 보안</h2>
          <p className="mb-4">
            업로드한 이미지는 이름 추천을 위해 처리되며 저희 서버에 영구적으로 저장되지 않습니다.
            저희는 귀하의 개인 정보를 무단 액세스, 변경, 공개 또는 파괴로부터 보호하기 위해 적절한 보안 조치를 구현합니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. 귀하의 권리</h2>
          <p className="mb-4">
            위치에 따라 귀하는 다음과 같은 개인 데이터 관련 권리를 가질 수 있습니다:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>정보 접근, 업데이트 또는 삭제할 권리</li>
            <li>정정 권리</li>
            <li>처리에 반대할 권리</li>
            <li>데이터 이동성에 대한 권리</li>
            <li>동의를 철회할 권리</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. 개인정보처리방침 변경</h2>
          <p className="mb-4">
            저희는 수시로 개인정보처리방침을 업데이트할 수 있습니다. 변경 사항이 있을 경우 이 페이지에 새로운 개인정보처리방침을 게시하여 알려드립니다.
            변경 사항이 있는지 주기적으로 이 개인정보처리방침을 검토하는 것이 좋습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. 문의하기</h2>
          <p className="mb-4">
            이 개인정보처리방침에 대해 궁금한 점이 있으시면 다음으로 연락해 주세요:
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
