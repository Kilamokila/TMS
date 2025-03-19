import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps, styled } from '@mui/material';

export interface TooltipProps extends MuiTooltipProps {
    maxWidth?: number | string;
}

const StyledTooltip = styled(
    ({ className, ...props }: MuiTooltipProps) => <MuiTooltip {...props} classes={{ popper: className }} />,
    {
        shouldForwardProp: (prop) => prop !== 'maxWidth',
    },
)<TooltipProps>(({ theme, maxWidth }) => ({
    '& .MuiTooltip-tooltip': {
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
        color: theme.palette.common.white,
        fontSize: '0.75rem',
        padding: '6px 12px',
        maxWidth: maxWidth || 300,
        borderRadius: theme.shape.borderRadius,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    '& .MuiTooltip-arrow': {
        color: theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.grey[700],
    },
}));

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    title,
    placement = 'bottom',
    arrow = true,
    enterDelay = 300,
    maxWidth,
    ...props
}) => {
    if (!title) {
        return <>{children}</>;
    }

    return (
        <StyledTooltip
            title={title}
            placement={placement}
            arrow={arrow}
            enterDelay={enterDelay}
            maxWidth={maxWidth}
            {...props}
        >
            {typeof children === 'string' || typeof children === 'number' ? <span>{children}</span> : children}
        </StyledTooltip>
    );
};
