// Cloudflare Worker function for handling OpenAI API requests
export async function onRequest(context) {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json;charset=utf-8"
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
    let imageBase64, nameLanguage, uiLanguage;
    
    // Content-Type 헤더 확인
    const contentType = context.request.headers.get('content-type') || '';
    console.log('Request content type:', contentType);
    
    if (contentType.includes('application/json')) {
      // JSON 요청 처리
      try {
        const body = await context.request.json();
        imageBase64 = body.imageBase64;
        nameLanguage = body.nameLanguage;
        uiLanguage = body.uiLanguage;
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return Response.json(
          { error: `Failed to parse JSON request: ${error.message}` },
          { headers, status: 400 }
        );
      }
    } 
    else if (contentType.includes('multipart/form-data')) {
      // multipart/form-data 요청 처리
      try {
        // formData 가져오기
        const formData = await context.request.formData();
        
        // 디버깅을 위해 모든 필드 출력
        console.log('FormData fields:');
        for (const [key, value] of formData.entries()) {
          console.log(`- ${key}: ${typeof value === 'object' ? '[Object data]' : value.substring(0, 30) + '...'}`);
        }
        
        // 여러 가능한 필드 이름 확인
        // 이미지 데이터 찾기
        if (formData.has('image')) {
          const file = formData.get('image');
          console.log('Image file details:', {
            name: file.name,
            type: file.type,
            size: file.size
          });
          
          // File 이나 Blob을 base64로 변환 - Cloudflare Workers 환경에 맞는 방법
          if (file && (file instanceof File || file instanceof Blob)) {
            try {
              // 1. 바이너리 데이터 가져오기
              const arrayBuffer = await file.arrayBuffer();
              const bytes = new Uint8Array(arrayBuffer);
              
              // 2. Base64 인코딩 - Cloudflare Workers에서 사용 가능한 방법
              // btoa() 함수가 이진 데이터를 직접 처리할 수 없으므로
              // 바이트 배열을 문자열로 변환한 후 처리
              let binary = '';
              
              // 대용량 바이트 배열 처리를 위해 청크 크기 분할 처리
              const CHUNK_SIZE = 100000; // 적절한 청크 크기를 설정
              
              for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
                const chunk = bytes.slice(i, Math.min(i + CHUNK_SIZE, bytes.length));
                // 각 청크를 문자열로 변환
                binary += chunk.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
              }
              
              // 문자열을 base64로 인코딩
              imageBase64 = btoa(binary);
              
              console.log('Image converted with arrayBuffer, length:', imageBase64?.length || 0);
              
              // 이미지 데이터 처음 20바이트 로깅 (디버깅용)
              if (imageBase64 && imageBase64.length > 20) {
                console.log('First 20 chars of base64:', imageBase64.substring(0, 20));
              }
            } catch (error) {
              console.error('Error converting image to base64:', error);
            }
          }
        } 
        else if (formData.has('imageBase64')) {
          imageBase64 = formData.get('imageBase64');
          console.log('Found imageBase64 field, length:', imageBase64?.length || 0);
        }
        
        // 다른 이름으로 이미지 데이터 찾아보기
        if (!imageBase64) {
          for (const [key, value] of formData.entries()) {
            if (key.toLowerCase().includes('image') && typeof value === 'string' && value.length > 100) {
              imageBase64 = value;
              console.log(`Using field '${key}' as image data, length:`, imageBase64.length);
              break;
            }
          }
        }
        
        // 언어 설정 찾기
        nameLanguage = formData.get('nameLanguage') || formData.get('language') || 'english';
        uiLanguage = formData.get('uiLanguage') || formData.get('ui') || 'en';
        
        console.log('Extracted data:', { 
          hasImageData: !!imageBase64, 
          nameLanguage,
          uiLanguage
        });
      } catch (error) {
        console.error('Error parsing form data:', error);
        return Response.json(
          { error: `Failed to parse form data: ${error.message}` },
          { headers, status: 400 }
        );
      }
    }
    else {
      // 지원되지 않는 Content-Type
      console.error('Unsupported content type:', contentType);
      return Response.json(
        { error: `Unsupported content type: ${contentType}` },
        { headers, status: 415 }
      );
    }

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

    // 디버깅: 이미지 URL 형식 확인
    console.log('Creating OpenAI request with image');
    
    // base64 이미지 유효성 확인
    // OpenAI API는 data: 스키마가 필요함
    let imageUrl;
    if (imageBase64 && typeof imageBase64 === 'string') {
      // 이미 data: URI 스키마가 있는지 확인
      if (imageBase64.startsWith('data:')) {
        imageUrl = imageBase64;
      } 
      // MIME 형식 추측 - File 객체의 type 속성을 사용하거나 기본으로 JPEG 가정
      else {
        imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      }
      
      // 이미지 URL의 형식 및 길이 확인
      console.log('Image URL format check:', {
        startsWithData: imageUrl.startsWith('data:'),
        urlLength: imageUrl.length,
        urlPrefix: imageUrl.substring(0, 30) + '...'
      });
    } else {
      console.error('Invalid image data:', typeof imageBase64);
      return Response.json(
        { error: "Invalid image data format" },
        { headers, status: 400 }
      );
    }
    
    // OpenAI API 호출
    const requestBody = {
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
                url: imageUrl,
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
    };
    
    console.log('Request structure:', JSON.stringify(requestBody).substring(0, 200) + '...');
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
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
    
    // 줄 단위로 분리
    const lines = responseText.split('\n').map(line => line.trim());
    console.log('Parsed lines:', lines);
    
    // 더 강화된 파싱 로직
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(`Processing line ${i}:`, line);
      
      // 이름 추출: "Name:"으로 시작하는 줄
      if (line.toLowerCase().startsWith('name:')) {
        const namePart = line.substring('name:'.length).trim();
        if (namePart) {
          name = namePart;
          console.log('Found name:', name);
        }
        continue;
      }
      
      // 발음 추출: "Pronunciation:"으로 시작하는 줄
      if (line.toLowerCase().startsWith('pronunciation:')) {
        const pronPart = line.substring('pronunciation:'.length).trim();
        if (pronPart) {
          pronunciation = pronPart;
          console.log('Found pronunciation:', pronunciation);
        }
        continue;
      }
      
      // 이유 추출: "Reason:"으로 시작하는 줄과 그 이후 연속된 텍스트
      if (line.toLowerCase().startsWith('reason:')) {
        reason = line.substring('reason:'.length).trim();
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j].trim();
          // 다음 줄이 비어있지 않고, 콜론을 포함하지 않으면 reason에 추가
          if (nextLine && !nextLine.toLowerCase().includes(':')) {
            reason += ' ' + nextLine;
          } else {
            break;
          }
          j++;
        }
        console.log('Found reason:', reason);
      }
    }

    // 발음 표시 여부 결정
    const shouldShowPronunciation = 
      (nameLanguage === 'korean' && uiLanguage !== 'ko') ||
      (nameLanguage === 'japanese' && uiLanguage !== 'ja');

    // 파싱된 정보를 바탕으로 응답 객체 구성
    const responseObj = {
      name: name || "Unknown",
      reason: reason || "Based on your appearance"
    };
    
    // 발음이 있고 사용해야 하는 경우에만 추가
    if (shouldShowPronunciation && pronunciation) {
      responseObj.pronunciation = pronunciation;
    }
    
    // 응답 객체를 로그로 기록하여 클라이언트에 보내지는 데이터 확인
    console.log('Sending response object to client:', JSON.stringify(responseObj));
    
    // 확장된 헤더 설정으로 캐시 및 CORS 문제 해결
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    };
    
    // Cloudflare Worker에서는 Response.json()을 사용하여 Content-Type 및 직렬화를 자동으로 처리
    return Response.json(responseObj, { headers });

  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error.message || 'Unknown error';
    
    // 오류 상황 자세히 로그
    console.error('Error details:', {
      message: errorMessage,
      stack: error.stack,
      name: error.name
    });
    
    // 동일한 헤더 설정 사용
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    };
    
    // Response.json() 사용하여 JSON 직렬화 및 Content-Type 헤더 가장 기본적인 방식으로 처리
    return Response.json(
      { 
        error: `Internal server error: ${errorMessage}`,
        timestamp: new Date().toISOString()
      },
      { headers, status: 500 }
    );
  }
}

// 기본 프롬프트 생성 함수
function getBasePrompt(uiLanguage) {
  const currentTime = new Date().getTime();
  const randomSeed = Math.floor(Math.random() * 1000000);
  
  const basePrompts = {
    en: `You are an advanced name recommendation system that suggests creative and fitting names based on an image. Follow these steps precisely:

1. FIRST, get a general impression from the image - focus on the overall mood, colors, setting, and feeling rather than detailed facial analysis.

2. SECOND, based on your impression, create a LIST OF 10 UNIQUE AND DIVERSE name suggestions that would match the image's feeling. Include unusual/creative names, not just common ones.

3. THIRD, randomly select ONE name from your list of 10.

4. FINALLY, respond ONLY with:
Name: [your selected name]
Pronunciation: [how to pronounce it]
Reason: [brief explanation why this name matches the image]

IMPORTANT: If the nameLanguage parameter is 'korean', provide the Name, Pronunciation, and Reason in Korean language.
If the nameLanguage is 'japanese', provide them in Japanese. Otherwise, provide them in English.

Session ID: ${currentTime}-${randomSeed}. Use this to ensure results are different each time.`,
    ko: `당신은 이미지를 보고 창의적이고 어울리는 이름을 추천하는 고급 이름 추천 시스템입니다. 다음 절차를 정확히 따르세요:

1. 먼저, 이미지에서 전반적인 인상을 받으세요 - 세부적인 얼굴 분석보다는 전체적인 분위기, 색감, 배경, 느낌에 집중하세요.

2. 두번째, 이 인상을 기반으로 이미지의 느낌에 맞는 10가지 독특하고 다양한 이름 제안 목록을 작성하세요. 흔한 이름뿐만 아니라 특이하고 창의적인 이름도 포함하세요.

3. 세번째, 10개 목록에서 무작위로 하나의 이름을 선택하세요.

4. 마지막으로, 다음 형식으로만 응답하세요:
Name: [선택한 이름]
Pronunciation: [발음 방법]
Reason: [이 이름이 이미지의 느낌과 어울리는 간략한 설명]

중요: 클라이언트 요청 nameLanguage가 'korean'이면 한국어로, 'japanese'면 일본어로, 'english'면 영어로 응답하세요.

세션 ID: ${currentTime}-${randomSeed}. 매번 다른 결과를 보장하기 위해 이 ID를 활용하세요.`,
    ja: `あなたは、画像に基づいて創造的で適切な名前を提案する先進的な名前推薦システムです。次の手順に正確に従ってください：

1. まず、画像から全体的な印象を得てください - 詳細な顔の分析よりも、全体的な雰囲気、色彩、背景、感覚に焦点を当ててください。

2. 次に、あなたの印象に基づいて、この画像の雰囲気に合う10のユニークで多様な名前の候補リストを作成してください。一般的な名前だけでなく、珍しい/創造的な名前も含めてください。

3. 第三に、あなたの10の名前リストからランダムに1つの名前を選択してください。

4. 最後に、次の形式でのみ回答してください：
Name: [選んだ名前]
Pronunciation: [発音方法]
Reason: [この名前が画像の雰囲気に合う理由の簡潔な説明]

重要: クライアントのnameLanguageパラメータが'korean'なら韓国語で、'japanese'なら日本語で、'english'なら英語で応答してください。

セッションID: ${currentTime}-${randomSeed}. 毎回異なる結果を保証するためにこのIDを使用してください。

また、日本語の名前を提案する場合、以下の点に注意してください。
- 日本語の名前には、漢字、ひらがな、カタカナなどが含まれることがあります。
- 日本語の名前には、意味や由来があることがあります。
- 日本語の名前には、文化的な背景や歴史的な背景があることがあります。`
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
