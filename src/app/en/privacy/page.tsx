'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <PageHeader title="Privacy Policy" />

      <main className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="prose">
          <p className="text-sm text-gray-500 mb-4">Last Updated: July 3, 2025</p>
          
          <p className="mb-4">
            Welcome to Name Recommender. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">1. What Data We Collect</h2>
          <p className="mb-4">
            <strong>Personal Data:</strong> When you use our service, we may collect the following data:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Images that you upload for name recommendation</li>
            <li>Information you provide through our contact forms</li>
            <li>Technical data including IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
            <li>Usage data on how you use our website</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Data</h2>
          <p className="mb-2">We use your personal data for these purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and improve our name recommendation service</li>
            <li>To respond to your inquiries</li>
            <li>To maintain and improve our website</li>
            <li>To analyze usage patterns to enhance user experience</li>
            <li>To display relevant advertising</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. Third-Party Services and Advertising</h2>
          <p className="mb-4">
            Our website uses Google AdSense to display advertisements. Google uses cookies to personalize ads based on your browsing history.
            Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.
          </p>
          <p className="mb-4">
            <strong>Third-Party Cookies:</strong> In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service and deliver advertisements on and through the service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">4. Your Choices Regarding Ads</h2>
          <p className="mb-4">
            You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.
            Additionally, you can opt out of some, but not all, third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">5. Data Storage and Security</h2>
          <p className="mb-4">
            Images you upload are processed for name recommendations and are not permanently stored on our servers.
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">6. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal data, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The right to access, update or delete your information</li>
            <li>The right to rectification</li>
            <li>The right to object to processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">7. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us:
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
