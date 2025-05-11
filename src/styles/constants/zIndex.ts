/**
 * Константы z-индексов
 *
 * Обеспечивают консистентное расположение элементов по оси Z.
 * Согласуются с встроенными значениями z-index Material UI.
 */
export const zIndex = {
    // Базовые значения для распространенных элементов
    base: 0,
    content: 1,
    overlay: 5,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,

    // MUI Z-Index значения
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    snackbar: 1400,

    // Z-индексы для специфичных кастомных элементов
    sidebarOverContent: 10,
    floatingButton: 100,
    notification: 2000,
};
