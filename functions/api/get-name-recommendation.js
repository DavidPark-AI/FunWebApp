// Cloudflare Worker function for handling OpenAI API requests
export async function onRequest(context) {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    // POST 요청이 아니면 에러 반환
    if (context.request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers
      });
    }

    // 요청 데이터 가져오기
    const body = await context.request.json();
    const { imageBase64, nameLanguage, uiLanguage } = body;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Image data is required" }), {
        status: 400,
        headers
      });
    }

    // 환경변수에서 API 키 가져오기 (Cloudflare 대시보드에서 설정 필요)
    const apiKey = context.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers
      });
    }

    // 프롬프트 생성 로직 (간소화된 버전, 실제론 서버측 openai.ts 코드 활용 필요)
    const basePrompt = getBasePrompt(uiLanguage);
    const languageSpecificInstruction = getLanguageSpecificInstruction(nameLanguage, uiLanguage);
    const currentTime = new Date().getTime();
    const randomSeed = Math.floor(Math.random() * 1000000);
    const uniqueRequestId = `${currentTime}-${randomSeed}-${Math.random().toString(36).substring(2, 10)}`;
    const prompt = `${basePrompt} ${languageSpecificInstruction} IMPORTANT: Generate a completely unique result for this request ID: ${uniqueRequestId}`;

    // OpenAI API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt
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
        temperature: 0.7 + (Math.random() * 0.6),
        frequency_penalty: 0.5,
        presence_penalty: 0.5
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify({ error: `OpenAI API error: ${error.error?.message || 'Unknown error'}` }), {
        status: response.status,
        headers
      });
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || '';
    console.log('OpenAI raw response:', responseText);

    // 응답 파싱 로직
    let name = 'Unknown';
    let pronunciation = undefined;
    let reason = 'Based on your appearance and features.';
    
    const lines = responseText.split('\n').map(line => line.trim());
    
    for (const line of lines) {
      if (line.toLowerCase().startsWith('name:')) {
        const namePart = line.substring('name:'.length).trim();
        if (namePart) name = namePart;
        continue;
      }
      
      if (line.toLowerCase().startsWith('pronunciation:')) {
        const pronPart = line.substring('pronunciation:'.length).trim();
        if (pronPart) pronunciation = pronPart;
        continue;
      }
      
      if (line.toLowerCase().startsWith('reason:')) {
        reason = line.substring('reason:'.length).trim();
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

    // 발음 표시 여부 결정
    const shouldShowPronunciation = 
      (nameLanguage === 'korean' && uiLanguage !== 'ko') ||
      (nameLanguage === 'japanese' && uiLanguage !== 'ja');

    // JSON.stringify가 잘못된 경우 오류를 방지하기 위해 try-catch 처리
    try {
      const responseData = {
        name,
        pronunciation: shouldShowPronunciation ? pronunciation : undefined,
        reason
      };
      
      const jsonResponse = JSON.stringify(responseData);
      // 유효한 JSON 형식인지 확인 (이중 보호책)
      JSON.parse(jsonResponse);
      
      return new Response(jsonResponse, { 
        headers,
        status: 200 
      });
    } catch (jsonError) {
      console.error('JSON serialization error:', jsonError);
      return new Response(JSON.stringify({
        error: 'JSON serialization error',
        name: name || 'Unknown',
        reason: reason || 'Could not generate a proper response'
      }), { 
        headers,
        status: 500 
      });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: `Internal server error: ${error.message}` }), {
      status: 500,
      headers
    });
  }
}

// 기본 프롬프트 생성 함수
function getBasePrompt(uiLanguage) {
  const currentTime = new Date().getTime();
  const randomSeed = Math.floor(Math.random() * 1000000);
  
  const basePrompts = {
    en: `You are an advanced name recommendation system that analyzes appearance and suggests creative, fitting names. Follow this exact process:

1. FIRST, analyze the photo carefully and note: approximate age, perceived gender, facial features, expression, clothing style, hair style, and any distinctive characteristics.

2. SECOND, based on your analysis, create a LIST OF 10 UNIQUE AND DIVERSE name suggestions that would suit this person. Include unusual/creative names, not just common ones.

3. THIRD, randomly select ONE name from your list of 10.

4. FINALLY, respond ONLY with:
Name: [your selected name]
Pronunciation: [how to pronounce it]
Reason: [brief explanation why this name fits the person]

Session ID: ${currentTime}-${randomSeed}. Use this to ensure results are different each time.`,
    ko: `당신은 외모를 분석하고 창의적이고 어울리는 이름을 추천하는 고급 이름 추천 시스템입니다. 다음 절차를 정확히 따르세요:

1. 먼저, 사진을 자세히 분석하고 다음을 기록하세요: 대략적인 나이, 인식된 성별, 얼굴 특징, 표정, 의상 스타일, 헤어 스타일 및 기타 특징적인 특성.

2. 두번째, 분석을 기반으로 이 사람에게 어울릴 10가지 독특하고 다양한 이름 제안 목록을 작성하세요. 흔한 이름뿐만 아니라 특이하고 창의적인 이름도 포함하세요.

3. 세번째, 10개 목록에서 무작위로 하나의 이름을 선택하세요.

4. 마지막으로, 다음 형식으로만 응답하세요:
Name: [선택한 이름]
Pronunciation: [발음 방법]
Reason: [이 이름이 그 사람에게 맞는 간략한 설명]

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
  };

  return basePrompts[uiLanguage] || basePrompts.en;
}

// 언어별 특화 지시사항 생성 함수
function getLanguageSpecificInstruction(nameLanguage, uiLanguage) {
  const instructions = {
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
  };

  return instructions[nameLanguage]?.[uiLanguage] || instructions[nameLanguage]?.en || '';
}
