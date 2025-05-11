import { TypographyOptions } from '@mui/material/styles/createTypography';

/**
 * Настройки типографики для приложения
 */

export const typography: TypographyOptions = {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
    },
    h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
    },
    h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.2,
    },
    h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.2,
    },
    h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
    },
    h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
    },
    subtitle1: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.4,
    },
    subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.4,
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
    },
    button: {
        fontWeight: 500,
        fontSize: '0.875rem',
        textTransform: 'none',
    },
    caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
    },
    overline: {
        fontSize: '0.625rem',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },
};
