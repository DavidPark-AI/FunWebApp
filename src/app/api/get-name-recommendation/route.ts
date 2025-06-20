import { NextRequest, NextResponse } from 'next/server';
import { getNameSuggestion, type NameLanguageType, type UILanguageType } from '@/lib/openai';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const nameLanguage = formData.get('nameLanguage') as NameLanguageType | null;
    const uiLanguage = formData.get('uiLanguage') as UILanguageType | null;
    
    // Validate inputs
    if (!imageFile || !nameLanguage || !uiLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert image to buffer
    const buffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    
    // Resize image to 512x512
    const resizedImageBuffer = await resizeImage(imageBuffer);
    
    // Convert resized image to base64
    const base64Image = resizedImageBuffer.toString('base64');
    
    // Get name suggestion from OpenAI
    const nameSuggestion = await getNameSuggestion(
      base64Image,
      nameLanguage,
      uiLanguage
    );
    
    // Return the name suggestion
    return NextResponse.json(
      {
        success: true,
        result: {
          ...nameSuggestion,
          // Store a thumbnail version of the image for the result card
          previewImageUrl: `data:${imageFile.type};base64,${base64Image}`
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Increase the limit to handle larger payloads for images
/**
 * 이미지를 512x512 픽셀로 리사이징하는 함수
 * @param imageBuffer 원본 이미지 버퍼
 * @returns 리사이징된 이미지 버퍼
 */
async function resizeImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Sharp를 사용하여 이미지를 512x512 크기로 리사이징
    // 이미지 비율을 유지하면서 맞추고, 필요한 부분을 중앙을 기준으로 크롭합니다.
    return await sharp(imageBuffer)
      .resize(512, 512, {
        fit: 'cover',      // 이미지를 채우면서 비율 유지
        position: 'centre' // 중앙 기준으로 크롭
      })
      .jpeg({ quality: 80 })  // JPEG 품질을 80%로 설정하여 용량 축소
      .toBuffer();
  } catch (error) {
    console.error('이미지 리사이징 오류:', error);
    // 리사이징에 실패하면 원본 이미지를 반환
    return imageBuffer;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
