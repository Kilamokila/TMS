import React, { useState, useEffect, useMemo } from 'react';
import { EStorageKeys } from '@services/storage/storageKeys';
import { LocalStorageUtil } from '@services/storage';
import { LanguageContext } from './languageContext';
import { waitForI18n } from '@src/i18n/i18n';
import { LANGUAGE, TLanguage } from './types/languageModes';

export const LanguageContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [language, setLanguage] = useState<TLanguage>(
        () => LocalStorageUtil.getItem(EStorageKeys.LANGUAGE) ?? LANGUAGE.EN,
    );

    useEffect(() => {
        const initLanguage = async () => {
            try {
                const i18nInstance = await waitForI18n();

                await i18nInstance.changeLanguage(language);
            } catch (err) {
                console.error('Error changing language:', err);
            }
        };

        initLanguage();
    }, [language]);

    const changeLanguage = (newLanguage: TLanguage) => {
        setLanguage((prevLanguage: TLanguage) => {
            if (prevLanguage === newLanguage) return prevLanguage;

            LocalStorageUtil.setItem(EStorageKeys.LANGUAGE, newLanguage);

            return newLanguage;
        });
    };

    const contextValue = useMemo(() => ({ language, changeLanguage }), [language]);

    return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};
