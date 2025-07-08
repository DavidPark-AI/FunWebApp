import OpenAI from 'openai';

// 클라이언트 사이드와 서버 사이드 모두 지원하는 구조
export type NameLanguageType = 'korean' | 'english' | 'japanese';
export type UILanguageType = 'ko' | 'en' | 'ja';

export interface NameSuggestion {
  name: string;
  pronunciation?: string;
  reason: string;
}

// 정적 내보내기 환경에서는 이 함수를 사용하지 않음 (클라이언트에서 직접 API 호출)
const getOpenAIClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('OpenAI 클라이언트는 서버 사이드에서만 초기화할 수 있습니다');
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY가 설정되지 않았습니다. .env.local 파일에서 설정하세요.');
  }
  
  return new OpenAI({
    apiKey,
  });
};

// UserCounter 컴포넌트에서 카운터 증가 함수 가져오기
import { incrementAnalysisCount } from '@/components/UserCounter';

// Cloudflare Pages 정적 사이트에서 사용할 OpenAI API 호출 함수
export async function getNameSuggestion(
  imageBase64: string, 
  nameLanguage: NameLanguageType,
  uiLanguage: UILanguageType
): Promise<NameSuggestion> {
  try {
    // 클라이언트 사이드에서 실행 (Cloudflare Pages 정적 사이트)
    if (typeof window !== 'undefined') {
      // 개발 모드인 경우 직접 API 호출이 가능할 수 있음 (CORS 문제로 실패할 가능성 높음)
      if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        console.log('Development mode: Attempting direct API call');
        // 개발 모드 직접 호출 로직 (CORS 문제로 작동하지 않을 수 있음)
        return await makeDirectAPICall(imageBase64, nameLanguage, uiLanguage);
      } else {
        // 프로덕션 모드: Cloudflare Worker API 엔드포인트 호출
        const workerEndpoint = '/api/get-name-recommendation';
        console.log(`Using worker API endpoint: ${workerEndpoint}`);
        
        // FormData 객체를 사용하여 multipart/form-data 형식으로 요청
        const formData = new FormData();
        formData.append('imageBase64', imageBase64);
        formData.append('nameLanguage', nameLanguage);
        formData.append('uiLanguage', uiLanguage);
        
        console.log('Sending request with FormData', {
          nameLanguage,
          uiLanguage,
          imageBase64Length: imageBase64 ? imageBase64.length : 0
        });
        
        const response = await fetch(workerEndpoint, {
          method: 'POST',
          // Content-Type 헤더를 포함하지 않음 - fetch API가 자동으로 multipart/form-data로 설정
          body: formData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Worker API error: ${response.status} - ${errorText}`);
        }
        
        // 가장 기본적인 방식으로 응답 처리
        try {
          console.log('Worker API response status:', response.status);
          // 바로 response.json()을 사용하여 파싱 (fetch API 기본 기능 활용)
          const result = await response.json();
          
          // 성공적으로 분석이 완료되었을 때 카운터 증가
          console.log('📊 클라우드플레어 API 성공: 카운터 증가 시도');
          try {
            incrementAnalysisCount();
            console.log('✅ 카운터 증가 성공');
          } catch (countError) {
            console.error('❌ 카운터 증가 중 오류:', countError);
          }
          return result;
        } catch (error) {
          console.error('Worker API response error:', error);
          // 지원용 디버깅 정보 수집
          try {
            const errorText = await response.text();
            console.log('Worker API raw error response:', errorText);
          } catch (e) {
            console.log('Could not get error response text');
          }
          
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Worker API response error: ${errorMessage}`);
        }
      }
    } 
    // 서버 사이드에서 실행 (개발 환경)
    else {
      return await makeDirectAPICall(imageBase64, nameLanguage, uiLanguage);
    }
  } catch (error) {
    console.error('Name suggestion error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate name: ${error.message}`);
    } else {
      throw new Error('Failed to generate name: Unknown error');
    }
  }
}

// 직접 OpenAI API 호출하는 함수 (서버 사이드 또는 개발 환경)
async function makeDirectAPICall(
  imageBase64: string,
  nameLanguage: NameLanguageType,
  uiLanguage: UILanguageType
): Promise<NameSuggestion> {
  try {
    // 서버 사이드에서만 OpenAI 클라이언트 사용
    if (typeof window === 'undefined') {
      const openai = getOpenAIClient();
      
      // 랜덤 요소 추가: 매번 다른 이름 생성
      const randomTemp = 0.7 + (Math.random() * 0.6); // 0.7~1.3 사이의 랜덤 temperature
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: getPrompt(nameLanguage, uiLanguage)
          },
          {
            role: "user", 
            content: [
              {
                type: "text",
                text: "Please suggest a name based on this photo."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: randomTemp,
        frequency_penalty: 0.5,
        presence_penalty: 0.5
      });
      
      // 성공적으로 분석이 완료되었을 때만 카운터 증가
      if (typeof window !== 'undefined') {
        console.log('📊 직접 API 호출 성공: 카운터 증가 시도');
        try {
          incrementAnalysisCount();
          console.log('✅ 직접 API 호출: 카운터 증가 성공');
        } catch (countError) {
          console.error('❌ 직접 API 호출: 카운터 증가 중 오류:', countError);
        }
      }
      return parseResponse(response, nameLanguage, uiLanguage);
    } 
    // 클라이언트 사이드에서는 CORS 문제로 직접 호출이 불가능할 수 있음
    else {
      throw new Error('클라이언트에서 직접 OpenAI API를 호출할 수 없습니다. API 키가 노출될 위험이 있습니다.');
    }
  } catch (apiError: any) {
    console.error('OpenAI API 호출 실패:', apiError);
    throw new Error(`OpenAI API 호출 오류: ${apiError.message || '알 수 없는 오류'}`);
  }
}

// OpenAI API 응답 파싱 함수
function parseResponse(response: any, nameLanguage: NameLanguageType, uiLanguage: UILanguageType): NameSuggestion {
  const responseText = response.choices[0]?.message?.content || '';
  console.log('OpenAI raw response:', responseText); // 디버깅용 로그 추가
  
  // 견고한 파싱을 위해 정규식 대신 더 안전한 방식 사용
  let name = 'Unknown';
  let pronunciation = undefined;
  let reason = 'Based on your appearance and features.';
  
  // 줄 단위로 분석
  const lines = responseText.split('\n').map((line: string) => line.trim());
  
  for (const line of lines) {
    // Name 부분 찾기
    if (line.toLowerCase().startsWith('name:')) {
      const namePart = line.substring('name:'.length).trim();
      if (namePart) name = namePart;
      continue;
    }
    
    // Pronunciation 부분 찾기
    if (line.toLowerCase().startsWith('pronunciation:')) {
      const pronPart = line.substring('pronunciation:'.length).trim();
      if (pronPart) pronunciation = pronPart;
      continue;
    }
    
    // Reason 부분 찾기 (여러 줄일 수 있음)
    if (line.toLowerCase().startsWith('reason:')) {
      reason = line.substring('reason:'.length).trim();
      // 추가 reason 줄 검사 (다음 줄들이 다른 키워드로 시작하지 않으면 reason의 일부로 간주)
      let i = lines.indexOf(line) + 1;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (nextLine && !nextLine.toLowerCase().includes(':')) {
          reason += ' ' + nextLine;
        } else {
          break;
        }
        i++;
      }
    }
  }
  
  return {
    name,
    pronunciation: shouldShowPronunciation(nameLanguage, uiLanguage) ? pronunciation : undefined,
    reason,
  };
}

// Helper to determine if pronunciation should be shown
// Show pronunciation when name language is different from UI language
function shouldShowPronunciation(nameLanguage: NameLanguageType, uiLanguage: UILanguageType): boolean {
  if (nameLanguage === 'korean' && uiLanguage !== 'ko') return true;
  if (nameLanguage === 'japanese' && uiLanguage !== 'ja') return true;
  return false;
}

// Generate appropriate prompt based on language selection
function getPrompt(nameLanguage: NameLanguageType, uiLanguage: UILanguageType): string {
  const currentTime = new Date().getTime();
  // 더 강한 무작위성을 위한 인자 추가
  const randomSeed = Math.floor(Math.random() * 1000000000);
  
  const basePrompt = {
    en: `You are an advanced name recommendation system that analyzes appearance and suggests creative, fitting names. Follow this exact process:

1. FIRST, analyze the photo carefully and note: approximate age, perceived gender, facial features, expression, clothing style, hair style, and any distinctive characteristics.

2. SECOND, based on your analysis, create a LIST OF 10 UNIQUE AND DIVERSE name suggestions that would suit this person. Include unusual/creative names, not just common ones.

3. THIRD, randomly select ONE name from your list of 10.

4. FINALLY, respond ONLY with:
Name: [your selected name]
Pronunciation: [how to pronounce it]
Reason: [brief explanation why this name fits the person]

Session ID: ${currentTime}-${randomSeed}. Use this to ensure results are different each time.`,
    
    ko: `당신은 외모를 분석하고 창의적이고 적합한 이름을 추천하는 고급 이름 추천 시스템입니다. 다음 과정을 정확히 따르세요:

1. 먼저, 사진을 주의 깊게 분석하고 다음을 기록하세요: 대략적인 나이, 인식된 성별, 얼굴 특징, 표정, 옷 스타일, 머리 스타일, 그리고 눈에 띄는 특징들.

2. 둘째, 분석을 토대로 이 사람에게 어울릴 만한 10가지 고유하고 다양한 이름 목록을 작성하세요. 흔한 이름뿐만 아니라 특이하고 창의적인 이름도 포함하세요.

3. 셋째, 10개 이름 목록에서 무작위로 한 개의 이름을 선택하세요.

4. 마지막으로, 다음 형식으로만 응답하세요:
Name: [선택한 이름]
Pronunciation: [발음 방법]
Reason: [이 이름이 그 사람에게 어울리는 간단한 이유]

세션 ID: ${currentTime}-${randomSeed}. 매번 다른 결과를 보장하기 위해 이 ID를 활용하세요.`,
    
    ja: `あなたは、外見を分析し、創造的で適切な名前を提案する先進的な名前推薦システムです。次の手順に正確に従ってください：

1. まず、写真を注意深く分析し、次の点に注目してください：おおよその年齢、認識された性別、顔の特徴、表情、服装スタイル、髪型、およびその他の特徴的な特性。

2. 次に、あなたの分析に基づいて、この人に合う10のユニークで多様な名前の候補リストを作成してください。一般的な名前だけでなく、珍しい/創造的な名前も含めてください。

3. 第三に、あなたの10の名前リストからランダムに1つの名前を選択してください。

4. 最後に、次の形式でのみ回答してください：
Name: [選択した名前]
Pronunciation: [発音方法]
Reason: [この名前がその人に合う簡単な理由]

セッションID：${currentTime}-${randomSeed}。これを使用して、毎回異なる結果を確実にしてください。`
  }[uiLanguage];
  
  const languageSpecificInstruction = {
    korean: {
      en: 'Focus on suggesting unique Korean names. First analyze physical features, age impression, style, etc. Then create 10 different Korean names, ensuring a mix of modern and traditional options, with varied meanings. AVOID common names like MinJun, JiHoon, or SooJin. Finally, choose one name from your list randomly and explain why it fits.',
      
      ko: '독특한 한국 이름을 추천하는 데 집중하세요. 먼저 신체적 특징, 나이 인상, 스타일 등을 분석하세요. 그런 다음 현대적인 이름과 전통적인 이름을 다양한 의미로 혼합하여 10가지 다양한 한국 이름을 만드세요. 민준, 지훈, 수진과 같은 흔한 이름은 피하세요. 마지막으로 목록에서 무작위로 하나의 이름을 선택하고 그것이 왜 어울리는지 설명하세요.',
      
      ja: 'ユニークな韓国の名前の提案に焦点を当ててください。まず、身体的特徴、年齢の印象、スタイルなどを分析します。次に、現代的な名前と伝統的な名前を様々な意味で混ぜた10の異なる韓国名を作成してください。MinJun、JiHoon、SooJinなどの一般的な名前は避けてください。最後に、リストからランダムに1つの名前を選び、なぜそれが適しているのかを説明してください。'
    },
    
    english: {
      en: 'Focus on suggesting unique English names. First analyze physical features, age impression, style, etc. Then create 10 different English names, ensuring a mix of modern and classic options, with varied origins and meanings. AVOID common names like John, Ethan, or Emma. Finally, choose one name from your list randomly and explain why it fits.',
      
      ko: '독특한 영어 이름을 추천하는 데 집중하세요. 먼저 신체적 특징, 나이 인상, 스타일 등을 분석하세요. 그런 다음 현대적인 이름과 고전적인 이름을 다양한 기원과 의미로 혼합하여 10가지 다양한 영어 이름을 만드세요. John, Ethan, Emma와 같은 흔한 이름은 피하세요. 마지막으로 목록에서 무작위로 하나의 이름을 선택하고 그것이 왜 어울리는지 설명하세요.',
      
      ja: 'ユニークな英語の名前の提案に焦点を当ててください。まず、身体的特徴、年齢の印象、スタイルなどを分析します。次に、現代的な名前と古典的な名前を様々な起源と意味で混ぜた10の異なる英語名を作成してください。John、Ethan、Emmaなどの一般的な名前は避けてください。最後に、リストからランダムに1つの名前を選び、なぜそれが適しているのかを説明してください。'
    },
    
    japanese: {
      en: 'Focus on suggesting unique Japanese names. First analyze physical features, age impression, style, etc. Then create 10 different Japanese names, ensuring a mix of modern and traditional options, with varied kanji combinations and meanings. AVOID common names like Haruki, Yuki, or Aiko. Finally, choose one name from your list randomly and explain why it fits.',
      
      ko: '독특한 일본 이름을 추천하는 데 집중하세요. 먼저 신체적 특징, 나이 인상, 스타일 등을 분석하세요. 그런 다음 현대적인 이름과 전통적인 이름을 다양한 한자 조합과 의미로 혼합하여 10가지 다양한 일본 이름을 만드세요. Haruki, Yuki, Aiko와 같은 흔한 이름은 피하세요. 마지막으로 목록에서 무작위로 하나의 이름을 선택하고 그것이 왜 어울리는지 설명하세요.',
      
      ja: 'ユニークな日本の名前の提案に焦点を当ててください。まず、身体的特徴、年齢の印象、スタイルなどを分析します。次に、現代的な名前と伝統的な名前を様々な漢字の組み合わせと意味で混ぜた10の異なる日本名を作成してください。ハルキ、ユキ、アイコなどの一般的な名前は避けてください。最後に、リストからランダムに1つの名前を選び、なぜそれが適しているのかを説明してください。'
    }
  }[nameLanguage][uiLanguage];
  
  // 시간 및 임의 값 기반 고유 요청 ID
  const uniqueRequestId = `${currentTime}-${randomSeed}-${Math.random().toString(36).substring(2, 10)}`;
  
  return `${basePrompt} ${languageSpecificInstruction} IMPORTANT: Generate a completely unique result for this request ID: ${uniqueRequestId}`;
}

// Mock data section removed since we're only using the real API now
