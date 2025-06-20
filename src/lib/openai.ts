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
      // 랜덤 요소 추가: 매번 다른 이름 생성을 위한 temperature 조정 및 랜덤 seed 추가
      const randomSeed = Math.floor(Math.random() * 1000000); // 더 큰 범위의 랜덤 시드 생성
      const randomTemp = 0.7 + (Math.random() * 0.6); // 0.7~1.3 사이의 랜덤 temperature 값
      
      response = await client.chat.completions.create({
        model: 'gpt-4-vision-preview', // 올바른 모델명으로 수정
        messages,
        max_tokens: 500,
        temperature: randomTemp, // 매번 다른 창의성 레벨 적용
        seed: randomSeed, // 랜덤 시드 적용
        frequency_penalty: 0.5, // 반복 단어 사용 감소
        presence_penalty: 0.5, // 새로운 주제 도입 촉진
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
