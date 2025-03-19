import React from 'react';
import {
    Checkbox as MuiCheckbox,
    CheckboxProps as MuiCheckboxProps,
    styled,
    FormControlLabel,
    FormControlLabelProps,
    Typography,
} from '@mui/material';

export interface CheckboxProps extends MuiCheckboxProps {
    label?: string;
    labelPlacement?: FormControlLabelProps['labelPlacement'];
}

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
    padding: 8,

    '&.Mui-checked': {
        color: theme.palette.primary.main,
    },

    '&.Mui-disabled': {
        color: theme.palette.text.disabled,
    },

    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    marginLeft: 0,
    marginRight: 0,

    '& .MuiFormControlLabel-label': {
        color: theme.palette.text.primary,
        fontSize: '0.875rem',
    },

    '&.Mui-disabled .MuiFormControlLabel-label': {
        color: theme.palette.text.disabled,
    },
}));

export const Checkbox: React.FC<CheckboxProps> = ({ label, labelPlacement = 'end', ...props }) => {
    const checkbox = <StyledCheckbox {...props} />;

    if (!label) {
        return checkbox;
    }

    return (
        <StyledFormControlLabel
            control={checkbox}
            label={<Typography variant="body2">{label}</Typography>}
            labelPlacement={labelPlacement}
            disabled={props.disabled}
        />
    );
};
