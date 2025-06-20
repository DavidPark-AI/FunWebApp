import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface PhotoUploaderProps {
  onUpload: (file: File) => void;
  uploadText: {
    title: string;
    instructions: string;
    button: string;
  };
  maxSizeInBytes?: number;
}

export default function PhotoUploader({ onUpload, uploadText, maxSizeInBytes = 5 * 1024 * 1024 }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    if (file.size > maxSizeInBytes) {
      setError(`File size exceeds ${maxSizeInBytes / 1024 / 1024}MB limit`);
      return;
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Pass the file to the parent component
    onUpload(file);

    // Clean up the preview when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [maxSizeInBytes, onUpload]);

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
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
}
