import { Box } from '@mui/material';
import React from 'react';
import styles from './styles.module.less';

export const Sidebar: React.FC<React.PropsWithChildren> = (props) => {
    return <Box className={styles.wrapper}>{props.children}</Box>;
};
