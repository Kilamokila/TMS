import { palette } from './palette';
import { TMode } from './types/themeModes';

export const getThemeConfig = (mode: TMode) => {
    const selectedPalette = palette[mode].colors;

    return {
        palette: {
            mode,
            primary: selectedPalette.primary,
            secondary: selectedPalette.secondary,
            error: selectedPalette.error,
            warning: selectedPalette.warning,
            info: selectedPalette.info,
            success: selectedPalette.success,
            grey: selectedPalette.grey,
            text: selectedPalette.text,
            background: selectedPalette.background,
            action: selectedPalette.action,
            divider: selectedPalette.border.main,
        },
        shape: {
            borderRadius: 8,
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            button: {
                textTransform: 'none',
                fontWeight: 500,
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: selectedPalette.background.default,
                        color: selectedPalette.text.primary,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: 'none',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        backgroundColor: selectedPalette.background.default,
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: selectedPalette.background.sidebar,
                        borderRight: `1px solid ${selectedPalette.border.main}`,
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: `1px solid ${selectedPalette.border.main}`,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                    },
                },
            },
        },
    };
};
