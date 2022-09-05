export const SUPPORTED_LOCALES = [
  'en-US',
  'ko-KR',
  'tr-TR',
  'vi-VN',
  'zh-CN',
] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  'en-US': 'English',
  'ko-KR': '한국어',
  'tr-TR': 'Türkçe',
  'vi-VN': 'Tiếng Việt',
  'zh-CN': '中文',
};
