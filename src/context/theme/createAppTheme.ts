import { createTheme, Theme } from '@mui/material/styles';
import { TMode } from '@context/theme/types/themeModes';
import { createPalette, extendBasicMUIStyles, getShadows, spacing, typography, zIndex } from '@src/styles';

/**
 * Создает расширенную тему приложения, унифицируя все стилевые параметры
 */

export const createAppTheme = (mode: TMode): Theme => {
    const palette = createPalette(mode);

    return createTheme({
        palette,
        typography,
        shape: {
            borderRadius: 8,
        },
        spacing: (factor: number) => `${spacing.unit * factor}px`,
        zIndex,
        shadows: getShadows(),
        components: extendBasicMUIStyles(mode),
    });
};
