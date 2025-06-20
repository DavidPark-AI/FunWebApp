import React from 'react';

export type NameLanguage = 'korean' | 'english' | 'japanese';

interface NameLanguageSelectorProps {
  selectedLanguage: NameLanguage;
  onChange: (language: NameLanguage) => void;
  labels: {
    title: string;
    korean: string;
    english: string;
    japanese: string;
  };
}

export default function NameLanguageSelector({ 
  selectedLanguage, 
  onChange,
  labels 
}: NameLanguageSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto my-4">
      <h3 className="text-xl font-semibold mb-2">{labels.title}</h3>
      <div className="grid grid-cols-3 gap-2">
        <LanguageButton 
          language="korean"
          label={labels.korean}
          emoji="🇰🇷"
          isSelected={selectedLanguage === 'korean'}
          onClick={() => onChange('korean')}
        />
        <LanguageButton 
          language="english"
          label={labels.english}
          emoji="🇺🇸"
          isSelected={selectedLanguage === 'english'}
          onClick={() => onChange('english')}
        />
        <LanguageButton 
          language="japanese"
          label={labels.japanese}
          emoji="🇯🇵"
          isSelected={selectedLanguage === 'japanese'}
          onClick={() => onChange('japanese')}
        />
      </div>
    </div>
  );
}

interface LanguageButtonProps {
  language: NameLanguage;
  label: string;
  emoji: string;
  isSelected: boolean;
  onClick: () => void;
}

function LanguageButton({ label, emoji, isSelected, onClick }: LanguageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all border-2
        ${isSelected 
          ? 'bg-primary-600 text-white border-primary-800 shadow-lg scale-105' 
          : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
    >
      <span className="text-2xl mb-1">{emoji}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}
