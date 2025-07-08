/**
 * 이미지 분석 상태와 결과를 세션 스토리지에 저장하고 불러오는 유틸리티 함수들
 * 페이지 새로고침 후에도 분석 상태가 유지되도록 관리합니다.
 */

// 분석 상태와 결과를 저장하기 위한 키
const IMAGE_ANALYZED_KEY = 'name_recommender_image_analyzed';
const ANALYSIS_RESULT_KEY = 'name_recommender_analysis_result';

/**
 * 이미지 분석 상태를 세션 스토리지에 저장
 */
export function saveImageAnalyzedState(analyzed: boolean): void {
  try {
    sessionStorage.setItem(IMAGE_ANALYZED_KEY, analyzed ? 'true' : 'false');
  } catch (error) {
    console.error('Failed to save analysis state:', error);
  }
}

/**
 * 이미지 분석 상태를 세션 스토리지에서 가져오기
 */
export function getImageAnalyzedState(): boolean {
  try {
    const state = sessionStorage.getItem(IMAGE_ANALYZED_KEY);
    return state === 'true';
  } catch (error) {
    console.error('Failed to get analysis state:', error);
    return false;
  }
}

/**
 * 분석 결과를 세션 스토리지에 저장
 */
export function saveAnalysisResult(result: any): void {
  try {
    if (result) {
      const resultWithoutImageUrl = { ...result };
      // 이미지 URL은 저장할 필요가 없음 (다시 생성됨)
      if (resultWithoutImageUrl.previewImageUrl) {
        delete resultWithoutImageUrl.previewImageUrl;
      }
      sessionStorage.setItem(ANALYSIS_RESULT_KEY, JSON.stringify(resultWithoutImageUrl));
    } else {
      sessionStorage.removeItem(ANALYSIS_RESULT_KEY);
    }
  } catch (error) {
    console.error('Failed to save analysis result:', error);
  }
}

/**
 * 분석 결과를 세션 스토리지에서 가져오기
 */
export function getAnalysisResult(): any | null {
  try {
    const saved = sessionStorage.getItem(ANALYSIS_RESULT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to get analysis result:', error);
    return null;
  }
}

/**
 * 분석 상태와 결과를 모두 제거
 */
export function clearAnalysisData(): void {
  try {
    sessionStorage.removeItem(IMAGE_ANALYZED_KEY);
    sessionStorage.removeItem(ANALYSIS_RESULT_KEY);
  } catch (error) {
    console.error('Failed to clear analysis data:', error);
  }
}
