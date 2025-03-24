import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { EStorageKeys } from '@services/storage/storageKeys';

import translationEN from './locales/en/translation.json';
import translationRU from './locales/ru/translation.json';
import { LocalStorageUtil } from '@services/storage';

interface Resources {
    [language: string]: {
        translation: TranslationValue;
    };
}

interface TranslationValue {
    [key: string]: string | TranslationValue;
}

const resources: Resources = {
    en: { translation: translationEN },
    ru: { translation: translationRU },
};

const supportedLanguages = Object.keys(resources);

let isInitialized = false;

const customDetector = {
    name: 'customLocalStorageDetector',
    lookup() {
        return LocalStorageUtil.getItem<string>(EStorageKeys.LANGUAGE);
    },
    cacheUserLanguage(lng: string) {
        LocalStorageUtil.setItem(EStorageKeys.LANGUAGE, lng);
    },
};

const i18nInitialized = new Promise<typeof i18n>((resolve) => {
    i18n.use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'en',
            defaultNS: 'translation',
            interpolation: {
                escapeValue: false,
            },
            detection: {
                order: ['customLocalStorageDetector', 'navigator'],
                caches: [],
                convertDetectedLanguage: (lng: string) => {
                    const languageCode = lng.split('-')[0].toLowerCase();

                    return supportedLanguages.includes(languageCode) ? languageCode : 'ru';
                },
            },
        })
        .then(() => {
            i18n.services.languageDetector?.addDetector(customDetector);
            isInitialized = true;
            resolve(i18n);
        });
});

export const changeLanguage = async (lang: string): Promise<void> => {
    if (!isInitialized) {
        await i18nInitialized;
    }

    await i18n.changeLanguage(lang);
};

export const waitForI18n = () => i18nInitialized;

export const isI18nInitialized = () => isInitialized;

export default i18n;
