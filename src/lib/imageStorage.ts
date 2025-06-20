/**
 * 이미지 상태를 세션 스토리지에 저장하고 불러오는 유틸리티 함수들
 * 언어 변경 시 이미지가 유지되도록 관리합니다.
 */

// 이미지 데이터를 저장하기 위한 키
const IMAGE_STORAGE_KEY = 'name_recommender_image';
const IMAGE_PREVIEW_KEY = 'name_recommender_image_preview';

// 로컬스토리지 대신 세션스토리지 사용 - 호환성을 위해 같은 함수들 유지

/**
 * 이미지 파일을 세션 스토리지에 저장
 */
export async function saveImageToLocalStorage(file: File): Promise<void> {
  try {
    // 이미지를 base64로 변환
    const base64 = await convertFileToBase64(file);
    
    // 크기가 큰 이미지인 경우 압축 시도
    let processedBase64 = base64;
    if (base64.length > 500000) { // 500KB 이상이면 압축
      try {
        processedBase64 = await compressBase64Image(base64, 300); // 300KB로 압축 시도
        console.log('Image compressed for storage efficiency');
      } catch (compressionError) {
        console.warn('Image compression failed, using original:', compressionError);
        // 압축 실패 시 원본 사용
      }
    }
    
    // 필요한 정보만 저장
    const imageData = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      base64: processedBase64,
      timestamp: new Date().getTime() // 저장 시간 기록
    };
    
    try {
      // 세션 스토리지에만 저장 (브라우저 탭 닫힐 때까지만 유지)
      sessionStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(imageData));
    } catch (storageError) {
      // 할당량 초과 오류 발생 시 이미지 데이터를 비우고 사용자에게 알림
      console.warn('Storage quota exceeded. Cannot save full image data:', storageError);
      sessionStorage.removeItem(IMAGE_STORAGE_KEY);
      throw new Error('이미지가 너무 큽니다. 더 작은 이미지를 사용해주세요.');
    }
    
    // localStorage 사용 완전히 중단 - 할당량 초과 문제 방지 및 세션 종료시 이미지 자동 제거
  } catch (error) {
    console.error('Failed to save image to storage:', error);
  }
}

/**
 * 이미지 미리보기 URL을 저장
 */
export function saveImagePreviewUrl(previewUrl: string): void {
  try {
    // 미리보기 URL을 세션스토리지에만 저장하여 할당량 문제 방지
    sessionStorage.setItem(IMAGE_PREVIEW_KEY, previewUrl);
    // localStorage 사용 제거
  } catch (error) {
    console.error('Failed to save image preview URL:', error);
    // 할당량 초과 오류가 발생하면 기존 미리보기 데이터도 제거
    sessionStorage.removeItem(IMAGE_PREVIEW_KEY);
    throw new Error('이미지가 너무 큽니다. 더 작은 이미지를 사용해주세요.');
  }
}

/**
 * 저장된 이미지 파일 불러오기
 * 세션 시작 시 새로고침 방지를 위한 유효성 검사 추가
 */
export function getImageFromLocalStorage(): File | null {
  try {
    // 세션 스토리지에서만 가져오기 (로컬 스토리지 사용 중지)
    const data = sessionStorage.getItem(IMAGE_STORAGE_KEY);
    
    if (!data) return null;
    
    const imageData = JSON.parse(data);
    
    // 이미지 저장 시간 검사: 24시간 이상 지난 이미지는 사용하지 않음
    const currentTime = new Date().getTime();
    const imageTime = imageData.timestamp || 0;
    const hoursDiff = (currentTime - imageTime) / (1000 * 60 * 60);
    
    // 24시간 이상 지난 이미지는 삭제
    if (hoursDiff > 24) {
      clearImageFromLocalStorage();
      return null;
    }
    
    // base64 문자열을 Blob으로 변환
    const byteString = atob(imageData.base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: imageData.type });
    
    // Blob에서 File 객체 생성
    return new File([blob], imageData.name, {
      type: imageData.type,
      lastModified: imageData.lastModified
    });
  } catch (error) {
    console.error('Failed to get image from storage:', error);
    clearImageFromLocalStorage(); // 오류 발생 시 스토리지 내용 삭제
    return null;
  }
}

/**
 * 저장된 이미지 미리보기 URL 가져오기
 */
export function getImagePreviewUrl(): string | null {
  try {
    // 세션 스토리지에서만 가져오기
    const previewUrl = sessionStorage.getItem(IMAGE_PREVIEW_KEY);
    return previewUrl;
  } catch (error) {
    console.error('Failed to get image preview URL:', error);
    return null;
  }
}

/**
 * 저장된 이미지 제거
 */
export function clearImageFromLocalStorage(): void {
  try {
    // 세션 스토리지에서만 이미지 데이터 제거
    sessionStorage.removeItem(IMAGE_STORAGE_KEY);
    sessionStorage.removeItem(IMAGE_PREVIEW_KEY);
  } catch (error) {
    console.error('Failed to clear image from storage:', error);
  }
}

/**
 * 이미지 파일을 base64 형태로 변환
 * @param file 이미지 파일
 * @returns Promise<string> base64 문자열
 */
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Base64 이미지 압축 (클라이언트 측 압축)
 * @param base64Image 원본 base64 이미지 문자열
 * @param maxSizeKB 최대 파일 크기(KB)
 * @returns Promise<string> 압축된 base64 이미지 문자열
 */
async function compressBase64Image(base64Image: string, maxSizeKB: number = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    // base64 이미지에서 헤더 분리
    const header = base64Image.split(',')[0];
    const imageData = base64Image.split(',')[1];
    
    // 현재 사이즈 축정 (base64는 실제 크기의 약 4/3배)
    const currentSizeKB = Math.round((imageData.length * 3/4) / 1024);
    
    // 이미 최대 크기 내면 그대로 반환
    if (currentSizeKB <= maxSizeKB) {
      return resolve(base64Image);
    }
    
    // 이미지 객체 생성
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // 수정할 크기 계산 (원본 비율 유지)
      let quality = 0.7; // 초기 품질
      
      // 매우 큰 이미지는 사이즈를 줄임
      let width = img.width;
      let height = img.height;
      
      // 1MB 이상이면 사이즈 축소
      if (currentSizeKB > 1000) {
        const scaleFactor = Math.sqrt(maxSizeKB / currentSizeKB) * 0.9;
        width = Math.floor(img.width * scaleFactor);
        height = Math.floor(img.height * scaleFactor);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas context creation failed'));
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // 압축된 이미지 생성
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Image compression failed'));
    };
    
    img.src = base64Image;
  });
}
