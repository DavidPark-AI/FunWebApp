import OpenAI from 'openai';

// Initialize OpenAI client
// In production, you should get this from environment variable
// Use process.env.OPENAI_API_KEY in production
let openai: OpenAI | null = null;

export const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export type NameLanguageType = 'korean' | 'english' | 'japanese';
export type UILanguageType = 'ko' | 'en' | 'ja';

interface NameSuggestion {
  name: string;
  pronunciation?: string;
  reason: string;
}

export async function getNameSuggestion(
  imageBase64: string, 
  nameLanguage: NameLanguageType,
  uiLanguage: UILanguageType
): Promise<NameSuggestion> {
  // If no API key is available, return mock data for development
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
    console.warn('No OpenAI API key found. Using mock data.');
    return getMockNameData(nameLanguage, uiLanguage);
  }

  let client: OpenAI;
  try {
    client = getOpenAIClient();
  } catch (error) {
    console.warn('Failed to initialize OpenAI client:', error);
    return getMockNameData(nameLanguage, uiLanguage);
  }

  try {
    // Create appropriate prompting based on language selection
    const messages: any[] = [
      {
        role: 'system',
        content: getPrompt(nameLanguage, uiLanguage),
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Please suggest a name based on this photo.'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
              detail: 'low',
            },
          },
        ],
      },
    ];

    // Call OpenAI Vision API - with error handling and fallback
    let response;
    try {
      response = await client.chat.completions.create({
        model: 'gpt-4.1-minin-vision',
        messages,
        max_tokens: 500,
      });
    } catch (apiError) {
      console.error('OpenAI API call failed:', apiError);
      // API 호출 실패 시 모의 데이터로 대체
      return getMockNameData(nameLanguage, uiLanguage);
    }

    const responseText = response.choices[0]?.message?.content || '';
    
    // Parse response - expect format: Name: [name]\nPronunciation (if needed): [pronunciation]\nReason: [reason]
    const nameMatch = responseText.match(/Name: (.+?)(?:\n|$)/);
    const pronunciationMatch = responseText.match(/Pronunciation: (.+?)(?:\n|$)/);
    const reasonMatch = responseText.match(/Reason: (.+?)(?:\n|$|\.)/s);

    return {
      name: nameMatch?.[1] || 'Unknown',
      pronunciation: shouldShowPronunciation(nameLanguage, uiLanguage) ? 
                     pronunciationMatch?.[1] || undefined : 
                     undefined,
      reason: reasonMatch?.[1] || 'Based on your appearance and features.',
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    // 더 자세한 오류 정보 표시
    if (error instanceof Error) {
      throw new Error(`Failed to generate name suggestion: ${error.message}`);
    } else {
      throw new Error(`Failed to generate name suggestion: ${JSON.stringify(error)}`);
    }
  }
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
  const basePrompt = {
    en: 'You are a professional name recommender. Look at the uploaded photo and suggest a name that would suit this person. Reply in English with: Name: [suggested name]\\nPronunciation: [pronunciation in English if needed]\\nReason: [brief reason for this name selection]',
    ko: '당신은 전문적인 이름 추천가입니다. 업로드된 사진을 보고 이 사람에게 어울릴 이름을 제안하세요. 한국어로 다음과 같이 답하세요: Name: [추천 이름]\\nPronunciation: [필요한 경우 영어로 발음]\\nReason: [이 이름을 선택한 간단한 이유]',
    ja: 'あなたは専門の名前推薦者です。アップロードされた写真を見て、この人に合う名前を提案してください。日本語で次のように答えてください：Name: [推奨された名前]\\nPronunciation: [必要に応じて英語での発音]\\nReason: [この名前を選んだ簡単な理由]'
  }[uiLanguage];
  
  const languageSpecificInstruction = {
    korean: {
      en: 'Suggest a Korean name suitable for this person.',
      ko: '이 사람에게 어울리는 한국 이름을 추천해주세요.',
      ja: 'この人に合う韓国語の名前を提案してください。'
    },
    english: {
      en: 'Suggest an English name suitable for this person.',
      ko: '이 사람에게 어울리는 영어 이름을 추천해주세요.',
      ja: 'この人に合う英語の名前を提案してください。'
    },
    japanese: {
      en: 'Suggest a Japanese name suitable for this person.',
      ko: '이 사람에게 어울리는 일본 이름을 추천해주세요.',
      ja: 'この人に合う日本語の名前を提案してください。'
    }
  }[nameLanguage][uiLanguage];
  
  return `${basePrompt} ${languageSpecificInstruction}`;
}

// Mock data for development without API key
function getMockNameData(nameLanguage: NameLanguageType, uiLanguage: UILanguageType): NameSuggestion {
  const mockData = {
    korean: {
      en: {
        name: '민준 (Min-Jun)',
        pronunciation: 'Min-Joon',
        reason: 'This name suggests someone who is clever and talented. The features in the photo show a bright and intelligent look.'
      },
      ko: {
        name: '민준',
        reason: '지적이고 재능있는 사람을 의미하는 이름입니다. 사진에서 보이는 특징이 밝고 지적인 느낌을 줍니다.'
      },
      ja: {
        name: '民準 (민준)',
        pronunciation: 'ミンジュン',
        reason: 'この名前は賢くて才能のある人を表します。写真の特徴から明るく知的な印象を受けます。'
      }
    },
    english: {
      en: {
        name: 'Ethan',
        reason: 'This name conveys strength and reliability. The facial features in the photo suggest someone who is trustworthy and dependable.'
      },
      ko: {
        name: 'Ethan',
        reason: '이 이름은 강인함과 신뢰성을 전달합니다. 사진의 얼굴 특징은 믿을 수 있고 의지할 수 있는 사람임을 시사합니다.'
      },
      ja: {
        name: 'Ethan',
        reason: 'この名前は強さと信頼性を伝えます。写真の顔の特徴から、信頼でき、頼りになる人であることが示唆されます。'
      }
    },
    japanese: {
      en: {
        name: 'Haruki (春輝)',
        pronunciation: 'Ha-roo-key',
        reason: 'This name means "shining spring" and fits well with the bright expression in the photo. The clear eyes suggest a radiant personality.'
      },
      ko: {
        name: '하루키 (春輝)',
        pronunciation: '하루키',
        reason: '이 이름은 "빛나는 봄"을 의미하며 사진의 밝은 표정과 잘 어울립니다. 선명한 눈은 빛나는 성격을 보여줍니다.'
      },
      ja: {
        name: '春輝 (はるき)',
        reason: 'この名前は「輝く春」という意味で、写真の明るい表情によく合います。澄んだ目が輝く人格を示しています。'
      }
    }
  };
  
  return mockData[nameLanguage][uiLanguage as keyof typeof mockData[typeof nameLanguage]];
}
