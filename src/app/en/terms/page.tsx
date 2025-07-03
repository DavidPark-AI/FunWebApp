'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-pink-50">
      <PageHeader title="Terms of Service" />

      <main className="max-w-2xl mx-auto bg-yellow-50 p-8 rounded-lg shadow-md border border-yellow-100">
        <div className="prose">
          <p className="text-sm text-gray-500 mb-4">Last Updated: July 3, 2025</p>
          
          <p className="mb-4">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Name Recommender website.
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms,
            you may not access the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. Service Description</h2>
          <p className="mb-4">
            Name Recommender is a service that provides name recommendations based on images uploaded by users.
            The recommendations are generated using artificial intelligence and are intended for entertainment and reference purposes only.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. User Responsibilities</h2>
          <p className="mb-4">When using our service, you agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate information when required</li>
            <li>Use the service for lawful purposes only</li>
            <li>Not upload content that infringes on intellectual property rights</li>
            <li>Not upload images of other individuals without their consent</li>
            <li>Not use the service to harass, abuse, or harm another person</li>
            <li>Not attempt to disrupt or compromise the security of our service</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property of
            Name Recommender and its licensors. The Service is protected by copyright, trademark, and other laws.
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. Disclaimer of Warranties</h2>
          <p className="mb-4">
            The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied.
            We do not guarantee the accuracy, completeness, or usefulness of the name recommendations provided through our Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall Name Recommender, nor its directors, employees, partners, agents, suppliers, or affiliates,
            be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability
            to access or use the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. Third-Party Links</h2>
          <p className="mb-4">
            Our Service may contain links to third-party websites or services that are not owned or controlled by Name Recommender.
            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
            Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">9. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us:
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
