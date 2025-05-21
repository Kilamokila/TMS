import React, { useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { hideNotification } from '@store/slices/notificationSlice';

/**
 * Компонент для отображения уведомлений, получающий данные из Redux store
 */
export const NotificationManager: React.FC = () => {
    const dispatch = useAppDispatch();
    const { open, message, severity, autoHideDuration } = useAppSelector((state) => state.notification);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(hideNotification());
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (open && autoHideDuration) {
            timer = setTimeout(() => {
                dispatch(hideNotification());
            }, autoHideDuration);
        }

        return () => clearTimeout(timer);
    }, [open, autoHideDuration, dispatch]);

    return (
        <Snackbar open={open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity={severity} elevation={6} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};
