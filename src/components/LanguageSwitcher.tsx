import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { i18nConfig, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    const locale = pathname.split('/')[1] as Locale;
    if (i18nConfig.locales.includes(locale)) {
      setCurrentLocale(locale);
    }
  }, [pathname]);

  // Calculate paths with the new locale
  const getNewPath = (locale: Locale) => {
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
          className={`px-3 py-1 rounded-md ${
            currentLocale === locale
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
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
