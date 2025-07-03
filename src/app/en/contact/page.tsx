'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-pink-50">
      <PageHeader title="Contact Us" />

      <main className="max-w-2xl mx-auto bg-yellow-50 p-8 rounded-lg shadow-md border border-yellow-100">
        <div className="prose">
          <p className="mb-4">
            Thank you for your interest in the Name Recommender app. If you have any questions, concerns, or feedback,
            please feel free to reach out to us:
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">Email Contact</h2>
          <p className="mb-2">
            For general inquiries, assistance, or feedback:
            <br />
            <a href="mailto:sm82.park@gmail.com" className="text-primary-600 hover:underline">
              sm82.park@gmail.com
            </a>
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">Response Time</h2>
          <p>
            We strive to respond to all inquiries within 2-3 business days. However, during busy periods,
            it might take a bit longer. Thank you for your patience and understanding.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
