export const i18nConfig = {
  locales: ['en', 'ko', 'ja'],
  defaultLocale: 'en'
};

export type Locale = (typeof i18nConfig)['locales'][number];
