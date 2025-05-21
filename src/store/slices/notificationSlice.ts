import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TNotificationSeverity } from '@hooks/useNotification/types';

export interface INotification {
    open: boolean;
    message: string;
    severity: TNotificationSeverity;
    autoHideDuration?: number;
}

const DEFAULT_DURATION = 3000;

const initialState: INotification = {
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: DEFAULT_DURATION,
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (
            state,
            action: PayloadAction<{
                message: string;
                severity?: TNotificationSeverity;
                autoHideDuration?: number;
            }>,
        ) => {
            const { message, severity = 'info', autoHideDuration = DEFAULT_DURATION } = action.payload;

            state.open = true;
            state.message = message;
            state.severity = severity;
            state.autoHideDuration = autoHideDuration;
        },
        hideNotification: (state) => {
            state.open = false;
        },
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
