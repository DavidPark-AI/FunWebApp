// 전역 상태 관리 및 컨텍스트를 위한 프로바이더 컴포넌트
'use client';

import React, { ReactNode } from 'react';
import { ImageProvider } from '@/context/ImageContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ImageProvider>
      {children}
    </ImageProvider>
  );
}
