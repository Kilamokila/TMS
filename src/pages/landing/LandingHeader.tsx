import React, { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, useTheme, Button } from '@mui/material';
import styles from './styles.module.less';
import { CommitLogoSVG } from '@assets/svg';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '@context/language/languageContext';
import { LANGUAGE, TLanguage } from '@context/language/types/languageModes';
import TranslateIcon from '@mui/icons-material/Translate';

interface LandingHeaderProps {
    onLogin: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onLogin }) => {
    const { language, changeLanguage } = useLanguageContext();
    const { t } = useTranslation();
    const theme = useTheme();
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
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                boxShadow: theme.shadows[4],
            }}
        >
            <Toolbar className={styles.toolbar}>
                <Box component="div" className={styles.logo}>
                    <CommitLogoSVG />
                </Box>
                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
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
                    <Button variant="contained" color="primary" onClick={onLogin}>
                        {t('common.login')}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
