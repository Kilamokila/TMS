import { Link } from '@tanstack/react-router';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TranslateIcon from '@mui/icons-material/Translate';
import styles from './styles.module.less';
import { ROUTES } from '@router/routes';
import { useThemeContext } from '@context/theme';

import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@context/language/languageContext';
import { LANGUAGE, TLanguage } from '@context/language/types/languageModes';

export const Header: React.FC = () => {
    const { mode, toggleTheme } = useThemeContext();
    const { language, changeLanguage } = useLanguageContext();
    const { t } = useTranslation();

    const [langMenuAnchorEl, setLangMenuAnchorEl] = useState<null | HTMLElement>(null);

    const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLangMenuAnchorEl(event.currentTarget);
    };

    const handleLangMenuClose = () => {
        setLangMenuAnchorEl(null);
    };

    const handleLanguageChange = (lang: TLanguage) => {
        changeLanguage(lang);
        handleLangMenuClose();
    };

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: 'background.default',
                color: 'text.primary',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
        >
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
                        {t('header.projects')}
                    </Link>
                    <Link to={`/${ROUTES.WORKSPACE}`} className={styles.navLink}>
                        {t('header.workspace')}
                    </Link>
                    <Link to={`/${ROUTES.TEST_RUNS}`} className={styles.navLink}>
                        {t('testRuns.title')}
                    </Link>
                </nav>
                <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
                    <IconButton
                        onClick={handleLangMenuOpen}
                        color="inherit"
                        aria-label={t('header.toggleLanguage')}
                        title={t('header.toggleLanguage')}
                    >
                        <TranslateIcon />
                    </IconButton>
                    <Menu anchorEl={langMenuAnchorEl} open={Boolean(langMenuAnchorEl)} onClose={handleLangMenuClose}>
                        <MenuItem onClick={() => handleLanguageChange(LANGUAGE.EN)} selected={language === LANGUAGE.EN}>
                            English
                        </MenuItem>
                        <MenuItem onClick={() => handleLanguageChange(LANGUAGE.RU)} selected={language === LANGUAGE.RU}>
                            Русский
                        </MenuItem>
                    </Menu>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        aria-label={t('header.toggleTheme')}
                        title={t('header.toggleTheme')}
                    >
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
