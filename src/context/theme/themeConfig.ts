import { palette } from './palette';
import { TMode } from './types/themeModes';

export const getThemeConfig = (mode: TMode) => {
    const selectedPalette = palette[mode].colors;

    return {
        palette: {
            mode,
            primary: selectedPalette.primary,
            secondary: selectedPalette.secondary,
            background: selectedPalette.background,
        },
    };
};
