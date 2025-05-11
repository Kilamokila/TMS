import type { Shadows } from '@mui/material';

/**
 * Переопределение системы теней по умолчанию
 */
export const getShadows = () => {
    const createShadow = (px1: number, px2: number, px3: number, opacity: number): string => {
        return `0px ${px1}px ${px2}px 0px rgba(0, 0, 0, ${opacity}), 0px ${px3}px ${px2 * 0.5}px 0px rgba(0, 0, 0, ${opacity * 0.7})`;
    };

    return [
        'none',
        createShadow(1, 2, 0, 0.05), // elevation 1
        createShadow(2, 4, 1, 0.05), // elevation 2
        createShadow(3, 6, 1, 0.06), // elevation 3
        createShadow(4, 8, 2, 0.06), // elevation 4
        createShadow(5, 10, 2, 0.07), // elevation 5
        createShadow(6, 12, 3, 0.07), // elevation 6
        createShadow(7, 14, 3, 0.08), // elevation 7
        createShadow(8, 16, 4, 0.08), // elevation 8
        createShadow(9, 18, 4, 0.09), // elevation 9
        createShadow(10, 20, 5, 0.09), // elevation 10
        createShadow(11, 22, 5, 0.1), // elevation 11
        createShadow(12, 24, 6, 0.1), // elevation 12
        createShadow(13, 26, 6, 0.11), // elevation 13
        createShadow(14, 28, 7, 0.11), // elevation 14
        createShadow(15, 30, 7, 0.12), // elevation 15
        createShadow(16, 32, 8, 0.12), // elevation 16
        createShadow(17, 34, 8, 0.13), // elevation 17
        createShadow(18, 36, 9, 0.13), // elevation 18
        createShadow(19, 38, 9, 0.14), // elevation 19
        createShadow(20, 40, 10, 0.14), // elevation 20
        createShadow(21, 42, 10, 0.15), // elevation 21
        createShadow(22, 44, 11, 0.15), // elevation 22
        createShadow(23, 46, 11, 0.16), // elevation 23
        createShadow(24, 48, 12, 0.16), // elevation 24
    ] as unknown as Shadows;
};
