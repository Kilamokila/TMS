import React from 'react';
import {
    TextField,
    TextFieldProps,
    styled,
    FormHelperText,
    InputAdornment,
    FormControl,
    InputLabel,
} from '@mui/material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
    helperText?: React.ReactNode;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    isFullWidth?: boolean;
}

const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'isFullWidth',
})<InputProps>(({ theme, error, disabled, isFullWidth }) => ({
    width: isFullWidth ? '100%' : 'auto',

    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900],

        '& fieldset': {
            borderColor: error
                ? theme.palette.error.main
                : theme.palette.mode === 'light'
                  ? theme.palette.grey[300]
                  : theme.palette.grey[700],
        },

        '&:hover fieldset': {
            borderColor: error
                ? theme.palette.error.main
                : theme.palette.mode === 'light'
                  ? theme.palette.grey[400]
                  : theme.palette.grey[600],
        },

        '&.Mui-focused fieldset': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
        },

        ...(disabled && {
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],

            '& fieldset': {
                borderColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            },

            '& .MuiInputBase-input': {
                color: theme.palette.text.disabled,
            },
        }),
    },

    '& .MuiInputBase-input': {
        padding: '10px 16px',
        height: '22px',
    },

    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,

        '&.Mui-focused': {
            color: error ? theme.palette.error.main : theme.palette.primary.main,
        },

        '&.Mui-error': {
            color: theme.palette.error.main,
        },
    },
}));

export const Input: React.FC<InputProps> = ({
    label,
    helperText,
    startAdornment,
    endAdornment,
    isFullWidth = false,
    ...props
}) => {
    const inputId = React.useId();

    return (
        <FormControl error={props.error} fullWidth={isFullWidth}>
            {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
            <StyledTextField
                id={inputId}
                variant="outlined"
                isFullWidth={isFullWidth}
                label={label}
                InputProps={{
                    startAdornment: startAdornment && (
                        <InputAdornment position="start">{startAdornment}</InputAdornment>
                    ),
                    endAdornment: endAdornment && <InputAdornment position="end">{endAdornment}</InputAdornment>,
                }}
                {...props}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};
