import { TMode } from './themeModes';

export interface IThemeContext {
    mode: TMode;
    toggleTheme: () => void;
}
