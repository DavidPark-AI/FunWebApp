import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { i18nConfig, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    if (pathname) {
      const locale = pathname.split('/')[1] as Locale;
      if (i18nConfig.locales.includes(locale)) {
        setCurrentLocale(locale);
      }
    }
  }, [pathname]);

  // Calculate paths with the new locale
  const getNewPath = (locale: Locale) => {
    if (!pathname) return `/${locale}`;
    
    const pathParts = pathname.split('/');
    pathParts[1] = locale;
    return pathParts.join('/');
  };

  return (
    <div className="flex justify-center space-x-2 my-2">
      {i18nConfig.locales.map((locale) => (
        <Link
          href={getNewPath(locale)}
          key={locale}
          className={`px-3 py-1 rounded-md text-base font-medium border-2 ${
            currentLocale === locale
              ? 'bg-primary-600 text-white border-primary-700 shadow-md'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {locale === 'en' ? '🇺🇸 English' : 
           locale === 'ko' ? '🇰🇷 한국어' : 
           locale === 'ja' ? '🇯🇵 日本語' : locale}
        </Link>
      ))}
    </div>
  );
}
