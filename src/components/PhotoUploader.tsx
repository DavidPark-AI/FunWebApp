import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { saveImagePreviewUrl, getImagePreviewUrl } from '@/lib/imageStorage';

// Function to check if browser can resize images
const canResizeImages = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof HTMLCanvasElement !== 'undefined' && 
         typeof FileReader !== 'undefined';
};

interface PhotoUploaderProps {
  onUpload: (file: File) => void;
  uploadText: {
    title: string;
    instructions: string;
    button: string;
  };
  maxSizeInBytes?: number;
  // 초기화 트리거 (새 이미지 업로드 또는 초기화 버튼 클릭 시 처리를 위한 플래그)
  resetTrigger?: number;
}

// Function to resize an image file
const resizeImage = (file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      // Create a new Image object (with type assertion since constructor signatures vary)
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob and then to file
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to blob conversion failed'));
              return;
            }
            
            // Create new file with same name but resized
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            resolve(resizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = readerEvent.target?.result as string;
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function PhotoUploader({ onUpload, uploadText, maxSizeInBytes = 5 * 1024 * 1024, resetTrigger = 0 }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [browserCanResize, setBrowserCanResize] = useState<boolean | null>(null);

  // 컴포넌트 마운트 시 저장된 이미지 미리보기 로드 및 브라우저 기능 확인
  useEffect(() => {
    // 브라우저 기능 확인 (한 번만 확인하면 충분)
    if (browserCanResize === null) {
      setBrowserCanResize(canResizeImages());
    }
    
    // resetTrigger가 변경되었고 그 값이 0보다 큰 경우 (초기화 버튼 클릭 시)
    if (resetTrigger > 0) {
      console.log('포토 업로더: 초기화 트리거 받음', resetTrigger);
      setPreview(null);
      setError(null);
      setWarning(null);
      return;
    }
    
    // 초기 로드 또는 새로 고침 시 저장된 미리보기 로드
    const savedPreview = getImagePreviewUrl();
    if (savedPreview) {
      console.log('포토 업로더: 저장된 미리보기 이미지 로드');
      setPreview(savedPreview);
    }
  }, [resetTrigger]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setWarning(null);
    const file = acceptedFiles[0];
    
    if (!file) {
      console.log('파일 업로드: 파일이 없습니다');
      return;
    }
    
    console.log('파일 업로드 시작:', file.name, file.size);
    let finalFile = file;
    
    // Handle large files
    if (file.size > maxSizeInBytes) {
      // If browser supports image resizing
      if (browserCanResize) {
        try {
          setWarning(`File size exceeds ${maxSizeInBytes / 1024 / 1024}MB limit. Attempting to resize...`);
          console.log('파일 사이즈 제한 초과, 자동 리사이징 시도');
          
          // Try resizing the image
          finalFile = await resizeImage(file);
          
          if (finalFile.size > maxSizeInBytes) {
            // If still too large after resizing
            setError(`File is still too large after resizing (${(finalFile.size / 1024 / 1024).toFixed(2)}MB). Please use a smaller image.`);
            console.log('리사이징 후에도 사이즈가 커서 실패');
            return;
          }
          
          setWarning(`Image resized successfully from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(finalFile.size / 1024 / 1024).toFixed(2)}MB`);
          console.log('리사이징 성공:', file.size, '->', finalFile.size);
        } catch (err) {
          console.error('Error resizing image:', err);
          setError(`File size exceeds ${maxSizeInBytes / 1024 / 1024}MB limit and automatic resizing failed. Please use a smaller image.`);
          return;
        }
      } else {
        // Browser doesn't support resizing
        setError(`File size exceeds ${maxSizeInBytes / 1024 / 1024}MB limit. Your browser doesn't support automatic resizing. Please use a smaller image.`);
        return;
      }
    }

    try {
      // Create a preview
      const objectUrl = URL.createObjectURL(finalFile);
      console.log('미리보기 URL 생성:', objectUrl.substring(0, 30) + '...');
      
      // 미리보기를 state에 설정
      setPreview(objectUrl);
      
      // 스토리지에 미리보기 저장
      saveImagePreviewUrl(objectUrl);
      
      // 부모 컴포넌트에 파일 전달
      onUpload(finalFile);
      
      console.log('파일 업로드 완료:', file.name, '미리보기 설정 완료');
    } catch (err) {
      console.error('미리보기 생성 오류:', err);
      setError('이미지 미리보기 생성 시 오류가 발생했습니다.');
    }

    // Clean up function for when component unmounts
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
        console.log('미리보기 URL 해제');
      }
    };
  }, [maxSizeInBytes, onUpload, browserCanResize, preview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxSize: maxSizeInBytes,
    multiple: false
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-2">{uploadText.title}</h3>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <Image 
                src={preview} 
                alt="Preview" 
                className="rounded-lg object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <p className="text-primary-600">Click or drag to change photo</p>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">{uploadText.instructions}</p>
            {!browserCanResize && (
              <p className="mt-2 text-xs text-amber-600">Note: Your browser may not support automatic resizing of large images.</p>
            )}
          </div>
        )}
      </div>
      
      {warning && (
        <p className="text-amber-600 mt-2 text-sm">{warning}</p>
      )}
      
      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
}
