import { Link } from '@tanstack/react-router';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import React from 'react';
import styles from './styles.module.less';
import { ROUTES } from '@router/routes';
import { useThemeContext } from '@context/theme';

export const Header: React.FC = () => {
    const { mode, toggleTheme } = useThemeContext();

    return (
        <AppBar position="static" sx={{ bgcolor: 'white' }}>
            <Toolbar className={styles.toolbar}>
                <Box component="div" className={styles.logo}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="8" fill="#2C2E3B" />
                        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="white" fontSize="12">
                            TMS
                        </text>
                    </svg>
                </Box>
                <nav className={styles.navLinks}>
                    <Link to={`/${ROUTES.PROJECTS}`} className={styles.navLink}>
                        Проекты
                    </Link>
                    <Link to={`/${ROUTES.WORKSPACE}`} className={styles.navLink}>
                        Пространство
                    </Link>
                    <Button onClick={toggleTheme}>Переключить на {mode === 'light' ? 'темную' : 'светлую'} тему</Button>
                </nav>
            </Toolbar>
        </AppBar>
    );
};
