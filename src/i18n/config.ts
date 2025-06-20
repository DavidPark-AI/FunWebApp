export const i18nConfig = {
  locales: ['ko', 'en', 'ja'],
  defaultLocale: 'ko'
};

export type Locale = (typeof i18nConfig)['locales'][number];
