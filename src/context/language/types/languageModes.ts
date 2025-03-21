export const LANGUAGE = {
    EN: 'en',
    RU: 'ru',
} as const;

export type TLanguage = (typeof LANGUAGE)[keyof typeof LANGUAGE];
