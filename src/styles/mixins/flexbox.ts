import type { Theme } from '@mui/material';

/**
 * Миксины для работы с Flexbox-компоновкой.
 */
export const flexMixins = {
    row: {
        display: 'flex',
        flexDirection: 'row',
    },

    column: {
        display: 'flex',
        flexDirection: 'column',
    },

    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    spaceBetween: {
        display: 'flex',
        justifyContent: 'space-between',
    },

    startWrap: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    spaceEvenly: {
        display: 'flex',
        justifyContent: 'space-evenly',
    },

    endAlign: {
        display: 'flex',
        justifyContent: 'flex-end',
    },

    columnSpaceBetween: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    columnCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    centerWithGap: (gap = 2) => ({
        display: 'flex',
        alignItems: 'center',
        gap: (theme: Theme) => theme.spacing(gap),
    }),
};
