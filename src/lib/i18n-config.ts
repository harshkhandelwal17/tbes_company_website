export const i18n = {
  locales: ['en', 'fr', 'it'],
  defaultLocale: 'en',
}

export type Locale = (typeof i18n)['locales'][number]
