import { PaletteOptions } from '@mui/material';
import { TMode } from '@context/theme/types/themeModes';
import { colors } from '../constants';

export const createPalette = (mode: TMode): PaletteOptions => {
    const isLight = mode === 'light';

    return {
        mode,
        primary: {
            main: colors.primary.main,
            light: colors.primary.light,
            dark: colors.primary.dark,
            contrastText: colors.primary.contrastText,
        },
        secondary: {
            main: colors.secondary.main,
            light: colors.secondary.light,
            dark: colors.secondary.dark,
            contrastText: colors.secondary.contrastText,
        },
        error: {
            main: colors.error.main,
            light: colors.error.light,
            dark: colors.error.dark,
            contrastText: colors.error.contrastText,
        },
        warning: {
            main: colors.warning.main,
            light: colors.warning.light,
            dark: colors.warning.dark,
            contrastText: colors.warning.contrastText,
        },
        info: {
            main: colors.info.main,
            light: colors.info.light,
            dark: colors.info.dark,
            contrastText: colors.info.contrastText,
        },
        success: {
            main: colors.success.main,
            light: colors.success.light,
            dark: colors.success.dark,
            contrastText: colors.success.contrastText,
        },
        grey: colors.grey,
        text: {
            primary: isLight ? colors.text.darkPrimary : colors.text.lightPrimary,
            secondary: isLight ? colors.text.darkSecondary : colors.text.lightSecondary,
            disabled: isLight ? colors.text.darkDisabled : colors.text.lightDisabled,
        },
        background: {
            default: isLight ? colors.background.lightDefault : colors.background.darkDefault,
            paper: isLight ? colors.background.lightPaper : colors.background.darkPaper,
        },
        action: {
            active: isLight ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.7)',
            hover: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
            selected: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.16)',
            disabled: isLight ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)',
            disabledBackground: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
        },
        border: {
            main: isLight ? colors.border.lightMain : colors.border.darkMain,
            light: isLight ? colors.border.lightLight : colors.border.darkLight,
            dark: isLight ? colors.border.lightDark : colors.border.darkDark,
        },
        status: {
            inProgress: colors.status.inProgress,
            failed: colors.status.failed,
            passed: colors.status.passed,
            blocked: colors.status.blocked,
            retest: colors.status.retest,
            skipped: colors.status.skipped,
            invalid: colors.status.invalid,
        },
    };
};
