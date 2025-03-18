export const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;

export type TMode = (typeof THEME)[keyof typeof THEME];
