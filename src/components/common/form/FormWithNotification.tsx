import React, { ReactNode, useState } from 'react';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';

export interface FormWithNotificationProps {
    children: ReactNode;
    onSubmit?: () => Promise<void>;
    isLoading?: boolean;
    showLoadingOverlay?: boolean;
    successMessage?: string;
    errorMessage?: string;
    autoHandleErrors?: boolean;
}

export function FormWithNotification({
    children,
    isLoading = false,
    showLoadingOverlay = false,
}: FormWithNotificationProps): React.ReactElement {
    const [error, setError] = useState<string | null>(null);

    return (
        <div style={{ position: 'relative' }}>
            {/* Основное содержимое */}
            {children}

            {/* Оверлей загрузки */}
            {isLoading && showLoadingOverlay && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            {/* Уведомление об ошибке */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError(null)} severity="error" variant="filled">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}
