import React from 'react';
import { StrictMode } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { ThemeContextProvider } from './context/theme';

export const App: React.FC = () => {
    return (
        <StrictMode>
            <ThemeContextProvider>
                <RouterProvider router={router} />
            </ThemeContextProvider>
        </StrictMode>
    );
};
