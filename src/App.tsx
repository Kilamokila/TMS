import React from 'react';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { ThemeContextProvider } from './context/theme';
import { store } from '@store/store';
import { LanguageContextProvider } from '@context/language/LanguageContextProvider';

export const App: React.FC = () => {
    return (
        <StrictMode>
            <Provider store={store}>
                <LanguageContextProvider>
                    <ThemeContextProvider>
                        <RouterProvider router={router} />
                    </ThemeContextProvider>
                </LanguageContextProvider>
            </Provider>
        </StrictMode>
    );
};
