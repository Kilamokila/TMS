import { Components } from '@mui/material';
import { TMode } from '@context/theme/types/themeModes';
import { colors } from '../constants/colors';

export const extendBasicMUIStyles = (mode: TMode): Components => {
    const isLight = mode === 'light';

    return {
        /** Настройка базовых стилей для всего приложения */
        MuiCssBaseline: {
            styleOverrides: {
                'html, body': {
                    height: '100%',
                    margin: 0,
                    padding: 0,
                },
                body: {
                    backgroundColor: isLight ? colors.background.lightDefault : colors.background.darkDefault,
                    color: isLight ? colors.text.darkPrimary : colors.text.lightPrimary,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                },
                '#root': {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
                a: {
                    textDecoration: 'none',
                    color: 'inherit',
                },
                '::selection': {
                    backgroundColor: colors.primary.main,
                    color: colors.primary.contrastText,
                },
            },
        },

        /** Стили для кнопок */
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 8,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    minHeight: '40px',
                    '&.MuiButton-containedPrimary': {
                        backgroundColor: colors.primary.main,
                        '&:hover': {
                            backgroundColor: colors.primary.dark,
                        },
                    },
                    '&.MuiButton-outlinedPrimary': {
                        borderColor: colors.primary.main,
                        color: colors.primary.main,
                        '&:hover': {
                            borderColor: colors.primary.dark,
                            backgroundColor: 'rgba(82, 113, 255, 0.04)',
                        },
                    },
                    '&.MuiButton-textPrimary': {
                        color: colors.primary.main,
                        '&:hover': {
                            backgroundColor: 'rgba(82, 113, 255, 0.04)',
                        },
                    },
                    '&.Mui-disabled': {
                        backgroundColor: isLight ? colors.grey[200] : colors.grey[800],
                        color: colors.text.darkDisabled,
                    },
                },
            },
        },

        /** Стили для бумажных поверхностей */
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 8,
                },
                outlined: {
                    borderColor: isLight ? colors.border.lightMain : colors.border.darkMain,
                },
            },
        },

        /** Стили для карточек */
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    borderRadius: 8,
                },
            },
        },

        /** Стили для содержимого карточек */
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '24px',
                    '&:last-child': {
                        paddingBottom: '24px',
                    },
                },
            },
        },

        /** Стили для диалоговых окон */
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                },
            },
        },

        /** Стили для заголовков диалоговых окон */
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: '16px 24px',
                    borderBottom: `1px solid ${isLight ? colors.border.lightMain : colors.border.darkMain}`,
                },
            },
        },

        /** Стили для содержимого диалоговых окон */
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '24px',
                },
            },
        },

        /** Стили для действий в диалоговых окнах */
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: '16px 24px',
                    borderTop: `1px solid ${isLight ? colors.border.lightMain : colors.border.darkMain}`,
                },
            },
        },

        /** Стили для верхней панели приложения */
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    backgroundColor: isLight ? colors.background.lightDefault : colors.background.darkDefault,
                },
            },
        },

        /** Стили для панели инструментов */
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: '64px',
                    '@media (min-width: 600px)': {
                        minHeight: '64px',
                    },
                },
            },
        },

        /** Стили для боковой панели */
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: isLight ? colors.background.lightSidebar : colors.background.darkSidebar,
                    borderRight: `1px solid ${isLight ? colors.border.lightMain : colors.border.darkMain}`,
                },
            },
        },

        /** Стили для ячеек таблицы */
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${isLight ? colors.border.lightMain : colors.border.darkMain}`,
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: isLight ? colors.background.lightPaper : colors.background.darkPaper,
                },
            },
        },

        /** Стили для чипов */
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                },
            },
        },

        /** Стили для элементов списка */
        MuiListItem: {
            styleOverrides: {
                root: {
                    paddingTop: 8,
                    paddingBottom: 8,
                },
            },
        },

        /** Стили для базовых полей ввода */
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },

        /** Стили для обведенных полей ввода */
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isLight ? colors.border.lightDark : colors.border.darkLight,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary.main,
                    },
                },
                notchedOutline: {
                    borderColor: isLight ? colors.border.lightMain : colors.border.darkMain,
                },
            },
        },
    };
};
