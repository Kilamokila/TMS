import React from 'react';
import {
    Dialog as MuiDialog,
    DialogProps as MuiDialogProps,
    DialogTitle as MuiDialogTitle,
    DialogContent as MuiDialogContent,
    DialogActions as MuiDialogActions,
    IconButton,
    styled,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface DialogProps extends Omit<MuiDialogProps, 'title'> {
    title?: React.ReactNode;
    onClose?: () => void;
    actions?: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    closable?: boolean;
    titleDivider?: boolean;
    actionsDivider?: boolean;
    noPadding?: boolean;
}

const StyledDialog = styled(MuiDialog)({
    '& .MuiDialog-paper': {
        borderRadius: 8,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
});

const StyledDialogTitle = styled(MuiDialogTitle, {
    shouldForwardProp: (prop) => !['titleDivider', 'closable'].includes(prop as string),
})<{ titleDivider?: boolean; closable?: boolean }>(({ theme, titleDivider, closable }) => ({
    padding: '16px 24px',
    borderBottom: titleDivider ? `1px solid ${theme.palette.divider}` : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...(closable && {
        paddingRight: 56,
    }),
}));

const StyledDialogContent = styled(MuiDialogContent, {
    shouldForwardProp: (prop) => prop !== 'noPadding',
})<{ noPadding?: boolean }>(({ noPadding }) => ({
    padding: noPadding ? 0 : '20px 24px',
}));

const StyledDialogActions = styled(MuiDialogActions, {
    shouldForwardProp: (prop) => prop !== 'actionsDivider',
})<{ actionsDivider?: boolean }>(({ theme, actionsDivider }) => ({
    padding: '16px 24px',
    borderTop: actionsDivider ? `1px solid ${theme.palette.divider}` : 'none',
    justifyContent: 'flex-end',
    gap: 8,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: 8,
    top: 8,
    color: theme.palette.grey[500],
}));

export const Dialog: React.FC<DialogProps> = ({
    children,
    title,
    onClose,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    closable = true,
    titleDivider = false,
    actionsDivider = false,
    noPadding = false,
    ...props
}) => {
    return (
        <StyledDialog onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} {...props}>
            {title && (
                <StyledDialogTitle titleDivider={titleDivider} closable={closable}>
                    {typeof title === 'string' ? (
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                    ) : (
                        title
                    )}
                    {closable && onClose && (
                        <CloseButton aria-label="close" onClick={onClose}>
                            <CloseIcon />
                        </CloseButton>
                    )}
                </StyledDialogTitle>
            )}
            <StyledDialogContent noPadding={noPadding}>{children}</StyledDialogContent>
            {actions && <StyledDialogActions actionsDivider={actionsDivider}>{actions}</StyledDialogActions>}
        </StyledDialog>
    );
};
