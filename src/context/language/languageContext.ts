import { createContext, useContext } from 'react';
import { noop } from 'lodash-es';
import { ILanguageContext } from './types/LanguageContextInterface';

export const LanguageContext = createContext<ILanguageContext>({
    language: 'en',
    changeLanguage: noop,
});

export const useLanguageContext = (): ILanguageContext => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguageContext должен использоваться внутри LanguageContextProvider');
    }

    return context;
};
