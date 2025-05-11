import { CssBaseline } from '@mui/material';
import { useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { EStorageKeys } from '@services/storage/storageKeys';
import { THEME, TMode } from './types/themeModes';
import { ThemeContext } from './themeContext';
import { LocalStorageUtil } from '@services/storage';
import { createAppTheme } from './createAppTheme';

export const ThemeContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [mode, setMode] = useState<TMode>(() => LocalStorageUtil.getItem(EStorageKeys.THEME_MODE) ?? THEME.LIGHT);

    const toggleTheme = () => {
        setMode((prevMode) => {
            const newMode = prevMode === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;

            LocalStorageUtil.setItem(EStorageKeys.THEME_MODE, newMode);

            return newMode;
        });
    };

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
