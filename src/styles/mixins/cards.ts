import { Theme } from '@mui/material';

/**
 * Миксины для карточек
 * Обеспечивают консистентные стили для карточек в приложении
 */
export const cardMixins = {
    /**
     * Базовая карточка
     */
    base: (theme: Theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        padding: theme.spacing(3),
        transition: 'box-shadow 0.3s ease-in-out',
    }),

    /**
     * Интерактивная карточка с анимацией при наведении
     */
    interactive: (theme: Theme) => ({
        ...cardMixins.base(theme),
        cursor: 'pointer',
        '&:hover': {
            boxShadow: theme.shadows[3],
        },
    }),

    /**
     * Карточка с рамкой вместо тени
     */
    outlined: (theme: Theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(3),
    }),

    /**
     * Карточка-заглушка для "пустого состояния"
     */
    empty: (theme: Theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        border: `1px dashed ${theme.palette.divider}`,
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    }),

    /**
     * Карточка для диалогов (внутри модальных окон)
     */
    dialog: (theme: Theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }),
};
