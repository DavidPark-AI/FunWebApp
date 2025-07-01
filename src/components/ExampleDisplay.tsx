import React from 'react';
import Image from 'next/image';

interface ExampleDisplayProps {
  language: 'en' | 'ko' | 'ja';
}

// Translations for different languages
const translations = {
  en: {
    exampleTitle: 'How It Works',
    exampleDescription: 'Upload a clear photo of yourself and our AI will analyze your features and suggest a name that fits you.',
    resultTitle: 'Sample Result',
    sampleName: 'Emma',
    samplePronunciation: 'EM-uh',
    sampleReason: 'A graceful name that complements your gentle smile and warm, friendly features. The name Emma has historical roots meaning "whole" or "universal", which reflects the completeness of your balanced facial features. Your expressive eyes convey intelligence and creativity, while your facial symmetry suggests harmony and confidence – all qualities that the name Emma has come to represent in contemporary culture. Famous Emmas like Emma Watson and Emma Stone share similar approachable yet elegant qualities that your appearance naturally conveys.'
  },
  ko: {
    exampleTitle: '이용 방법',
    exampleDescription: '선명한 얼굴 사진을 업로드하면 AI가 당신의 특징을 분석하고 어울리는 이름을 추천해 드립니다.',
    resultTitle: '결과 예시',
    sampleName: '지민',
    samplePronunciation: 'Ji-min',
    sampleReason: '밝은 표정과 부드러운 인상에 어울리는 세련된 이미지의 이름입니다. "지"는 지혜로움을, "민"은 민첩함과 영리함을 의미하여 당신의 지적인 눈빛과 섬세한 이목구비에 완벽하게 어울립니다. 사진에서 보여지는 자연스러운 미소는 친근함을 주면서도 자신감 있는 인상을 주며, 현대적이면서도 전통의 가치를 소중히 여기는 당신의 균형잡힌 이미지가 느껴집니다. 또한 "지민"이라는 이름은 K-pop 스타들 사이에서도 인기 있는 이름으로, 세련되고 국제적인 감각을 지닌 당신의 분위기와 잘 어울립니다.'
  },
  ja: {
    exampleTitle: '使い方',
    exampleDescription: 'はっきりとした顔写真をアップロードすると、AIがあなたの特徴を分析し、あなたに合った名前を提案します。',
    resultTitle: '結果サンプル',
    sampleName: '咲良',
    samplePronunciation: 'Sakura (サクラ)',
    sampleReason: '優しい笑顔と温かみのある印象に合った、品のある美しい名前です。"咲"は花が開くという意味で、あなたの明るく開放的な印象を表し、"良"は優れた、美しいという意味で、あなたの洗練された雰囲気と調和します。桜の花のように、繊細さと強さを兼ね備えたイメージを持ち、あなたの晴れやかな表情と知性的な雰囲気が、この伝統的でいても現代的な名前に完璧に反映されています。また、日本の文化で桜は新しい始まりと美の象徴とされており、あなたの前向きで明るい性格特性を素晴らしく表現しています。'
  }
};

export default function ExampleDisplay({ language }: ExampleDisplayProps) {
  const content = translations[language] || translations.en;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-600 mb-2">{content.exampleTitle}</h3>
        <p className="text-sm text-gray-700 mb-3">{content.exampleDescription}</p>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Left side - Example image */}
        <div className="md:w-1/2 relative h-60">
          <Image 
            src="/examples/example-result.JPG" 
            alt="Example photo" 
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-bl-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-xs">Example Photo Analysis</p>
          </div>
        </div>
        
        {/* Right side - Example result */}
        <div className="md:w-1/2 p-4 bg-gray-50">
          <h4 className="text-md font-medium text-gray-800">{content.resultTitle}</h4>
          <div className="mt-2 p-3 bg-white rounded border">
            <h5 className="text-xl font-semibold text-primary-600">{content.sampleName}</h5>
            <p className="text-sm text-gray-500">{content.samplePronunciation}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-700">{content.sampleReason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
