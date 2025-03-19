import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, styled } from '@mui/material';

export interface IconButtonProps extends MuiIconButtonProps {
    size?: 'small' | 'medium' | 'large';
}

const StyledIconButton = styled(MuiIconButton, {
    shouldForwardProp: (prop) => prop !== 'size',
})<IconButtonProps>(({ theme, size, color }) => ({
    padding: size === 'small' ? 4 : size === 'large' ? 12 : 8,
    color:
        color === 'primary'
            ? theme.palette.primary.main
            : color === 'secondary'
              ? theme.palette.secondary.main
              : theme.palette.text.primary,

    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },

    '&.Mui-disabled': {
        color: theme.palette.text.disabled,
    },
}));

export const IconButton: React.FC<IconButtonProps> = ({ children, size = 'medium', ...props }) => {
    return (
        <StyledIconButton size={size} {...props}>
            {children}
        </StyledIconButton>
    );
};
