import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getImageFromLocalStorage, saveImageToLocalStorage, getImagePreviewUrl, saveImagePreviewUrl, clearImageFromLocalStorage } from '@/lib/imageStorage';

// 컨텍스트 타입 정의
interface ImageContextType {
  selectedFile: File | null;
  previewUrl: string | null;
  setSelectedImage: (file: File) => void;
  resetImage: () => void;
}

// 기본값으로 컨텍스트 생성
const ImageContext = createContext<ImageContextType>({
  selectedFile: null,
  previewUrl: null,
  setSelectedImage: () => {},
  resetImage: () => {},
});

// 컨텍스트 프로바이더 컴포넌트
export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 컴포넌트 마운트 시 저장된 이미지 로드
  useEffect(() => {
    // 세션/로컬 스토리지에서 저장된 이미지 가져오기
    const savedFile = getImageFromLocalStorage();
    const savedPreview = getImagePreviewUrl();

    // 저장된 파일이 있으면 상태 업데이트
    if (savedFile) {
      setSelectedFile(savedFile);
    }

    // 저장된 미리보기가 있으면 상태 업데이트
    if (savedPreview) {
      setPreviewUrl(savedPreview);
    }
  }, []);

  // 이미지 설정 함수
  const setSelectedImage = (file: File) => {
    // 파일 객체 저장
    setSelectedFile(file);
    
    // 미리보기 URL 생성
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // 세션/로컬 스토리지에 저장
    saveImageToLocalStorage(file);
    saveImagePreviewUrl(objectUrl);
  };

  // 이미지 초기화 함수
  const resetImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    clearImageFromLocalStorage();
  };

  return (
    <ImageContext.Provider
      value={{
        selectedFile,
        previewUrl,
        setSelectedImage,
        resetImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

// 커스텀 훅으로 컨텍스트 사용
export const useImage = () => useContext(ImageContext);
