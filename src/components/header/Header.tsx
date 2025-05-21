import { Link, useNavigate } from '@tanstack/react-router';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, useTheme, Typography } from '@mui/material';
import React, { useState } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TranslateIcon from '@mui/icons-material/Translate';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './styles.module.less';
import { ROUTES } from '@router/routes';
import { useThemeContext } from '@context/theme';

import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@context/language/languageContext';
import { LANGUAGE, TLanguage } from '@context/language/types/languageModes';
import { useKeycloak } from '@context/auth';
import { TMSLogoDarkSVG, TMSLogoLightSVG } from '@assets/svg';
import shadows from '@mui/material/styles/shadows';

export const Header: React.FC = () => {
    const { mode, toggleTheme } = useThemeContext();
    const theme = useTheme();
    const { language, changeLanguage } = useLanguageContext();
    const { t } = useTranslation();
    const { logout } = useKeycloak();
    const [langMenuAnchorEl, setLangMenuAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

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

    const handleNavigateToProjects = () => {
        navigate({ to: `/${ROUTES.PROJECTS}` });
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: shadows[2],
            }}
        >
            <Toolbar className={styles.toolbar}>
                <Box onClick={handleNavigateToProjects} component="div" className={styles.logo}>
                    {mode === 'dark' ? <TMSLogoDarkSVG /> : <TMSLogoLightSVG />}
                </Box>
                <nav className={styles.navLinks}>
                    <Typography variant="inherit" sx={{ color: theme.palette.text.primary }}>
                        <Link to={`/${ROUTES.PROJECTS}`}>{t('header.projects')}</Link>
                    </Typography>
                    <Typography variant="inherit" sx={{ color: theme.palette.text.primary }}>
                        <Link to={`/${ROUTES.WORKSPACE}`}>{t('header.workspace')}</Link>
                    </Typography>
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
                    <IconButton onClick={handleLogout} color="inherit">
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
