import { TLanguage } from './languageModes';

export interface ILanguageContext {
    language: TLanguage;
    changeLanguage: (lang: TLanguage) => void;
}
