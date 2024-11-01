import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from '../locales/en.json'
import translationJA from '../locales/ja.json'
import translationKO from '../locales/ko.json'
import translationZH from '../locales/zh.json'

export type SupportLanguage = 'en' | 'zh' | 'ko' | 'ja'

export const availableLanguage: Record<SupportLanguage, string> = {
  en: 'English',
  zh: '繁體中文',
  ko: '한국인',
  ja: '日本語'
}

const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  },
  ko: {
    translation: translationKO
  },
  ja: {
    translation: translationJA
  }
}

i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  })
