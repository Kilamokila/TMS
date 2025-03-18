import { createContext, useContext } from 'react';
import { noop } from 'lodash-es';
import { IThemeContext } from './types/ThemeContextInterface';
import { THEME } from './types/themeModes';

export const ThemeContext = createContext<IThemeContext>({
    mode: THEME.LIGHT,
    toggleTheme: noop,
});

export const useThemeContext = (): IThemeContext => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useThemeContext должен использоваться внутри ThemeContextProvider');
    }

    return context;
};
