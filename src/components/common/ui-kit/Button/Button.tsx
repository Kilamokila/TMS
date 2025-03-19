import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
    isFullWidth?: boolean;
}

const StyledButton = styled(MuiButton, {
    shouldForwardProp: (prop) => prop !== 'isFullWidth',
})<ButtonProps>(({ theme, variant, color, isFullWidth }) => ({
    padding: '8px 16px',
    fontWeight: 500,
    width: isFullWidth ? '100%' : 'auto',
    minHeight: '40px',
    textTransform: 'none',
    boxShadow: variant === 'contained' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',

    '&.MuiButton-containedPrimary': {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },

    '&.MuiButton-outlinedPrimary': {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover': {
            borderColor: theme.palette.primary.dark,
            backgroundColor: 'rgba(82, 113, 255, 0.04)',
        },
    },

    '&.MuiButton-textPrimary': {
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: 'rgba(82, 113, 255, 0.04)',
        },
    },

    ...(color === 'success' && {
        '&.MuiButton-contained': {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
            '&:hover': {
                backgroundColor: theme.palette.success.dark,
            },
        },
    }),

    ...(color === 'error' && {
        '&.MuiButton-contained': {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            '&:hover': {
                backgroundColor: theme.palette.error.dark,
            },
        },
    }),

    '&.Mui-disabled': {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        color: theme.palette.text.disabled,
    },
}));

export const Button: React.FC<ButtonProps> = ({ children, isFullWidth = false, ...props }) => {
    return (
        <StyledButton isFullWidth={isFullWidth} disableElevation {...props}>
            {children}
        </StyledButton>
    );
};
