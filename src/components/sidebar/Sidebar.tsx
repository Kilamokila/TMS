import React, { useState } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import {
    Box,
    Drawer,
    List,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Collapse,
} from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import BuildIcon from '@mui/icons-material/Build';
import ListIcon from '@mui/icons-material/List';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ComputerIcon from '@mui/icons-material/Computer';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { ROUTES } from '@router/routes';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    borderRight: `1px solid ${theme.palette.divider}`,
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    borderRight: `1px solid ${theme.palette.divider}`,
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

// const SectionHeader = styled(Typography)(({ theme }) => ({
//     padding: theme.spacing(2, 2, 0.5, 2),
//     fontSize: '0.75rem',
//     fontWeight: 700,
//     color: theme.palette.text.secondary,
//     letterSpacing: '0.08em',
// }));

// Interface for sidebar menu items
interface SidebarMenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path?: string;
    divider?: boolean;
}

// Interface for collapsible section
interface SidebarSection {
    id: string;
    label: string;
    icon?: React.ReactNode;
    items: SidebarMenuItem[];
}

export const Sidebar: React.FC = () => {
    const [open, setOpen] = useState(true);
    const { t } = useTranslation();
    const location = useLocation();
    // const theme = useTheme();

    // State for open/closed sections
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        tests: true,
        execution: true,
        issues: true,
    });

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleSectionToggle = (sectionId: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    // Define sidebar menu structure
    const sidebarSections: SidebarSection[] = [
        {
            id: 'tests',
            label: t('sidebar.tests'),
            items: [
                {
                    id: 'repository',
                    label: t('sidebar.repository'),
                    icon: <FolderIcon />,
                    path: `/${ROUTES.WORKSPACE}/repository`,
                },
                {
                    id: 'sharedSteps',
                    label: t('sidebar.sharedSteps'),
                    icon: <ListIcon />,
                    path: `/${ROUTES.WORKSPACE}/shared-steps`,
                },
            ],
        },
        {
            id: 'execution',
            label: t('sidebar.execution'),
            items: [
                {
                    id: 'testRuns',
                    label: t('sidebar.testRuns'),
                    icon: <PlayArrowIcon />,
                    path: `/${ROUTES.TEST_RUNS}`,
                },
                {
                    id: 'testPlans',
                    label: t('sidebar.testPlans'),
                    icon: <AssignmentIcon />,
                    path: `/${ROUTES.WORKSPACE}/test-plans`,
                },
                {
                    id: 'configurations',
                    label: t('sidebar.configurations'),
                    icon: <BuildIcon />,
                    path: `/${ROUTES.WORKSPACE}/configurations`,
                },
                {
                    id: 'environments',
                    label: t('sidebar.environments'),
                    icon: <ComputerIcon />,
                    path: `/${ROUTES.WORKSPACE}/environments`,
                },
            ],
        },
        {
            id: 'issues',
            label: t('sidebar.issues'),
            items: [
                {
                    id: 'defects',
                    label: t('sidebar.defects'),
                    icon: <BugReportIcon />,
                    path: `/${ROUTES.WORKSPACE}/defects`,
                },
                {
                    id: 'requirements',
                    label: t('sidebar.requirements'),
                    icon: <DescriptionIcon />,
                    path: `/${ROUTES.WORKSPACE}/requirements`,
                },
                {
                    id: 'milestones',
                    label: t('sidebar.milestones'),
                    icon: <AssignmentTurnedInIcon />,
                    path: `/${ROUTES.WORKSPACE}/milestones`,
                },
            ],
        },
    ];

    // Helper to render a list of menu items
    const renderMenuItems = (items: SidebarMenuItem[]) => {
        return items.map((item) => {
            const isActive = item.path ? location.pathname === item.path : false;

            return (
                <React.Fragment key={item.id}>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            component={item.path ? Link : 'div'}
                            to={item.path}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: open ? 4 : 2.5, // Больший отступ для подпунктов в открытом меню
                                ...(isActive && {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {
                                        backgroundColor: 'action.selected',
                                    },
                                }),
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: isActive ? 'primary.main' : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    opacity: open ? 1 : 0,
                                    color: isActive ? 'primary.main' : 'inherit',
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    {item.divider && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
            );
        });
    };

    // Render collapsible section
    const renderSection = (section: SidebarSection) => {
        const isOpen = openSections[section.id];
        const hasActiveItem = section.items.some((item) => item.path && location.pathname === item.path);

        return (
            <React.Fragment key={section.id}>
                <ListItem
                    disablePadding
                    sx={{
                        display: 'block',
                        backgroundColor: hasActiveItem && !open ? 'action.selected' : 'transparent',
                    }}
                >
                    <ListItemButton
                        onClick={() => handleSectionToggle(section.id)}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        {section.icon && (
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: hasActiveItem ? 'primary.main' : 'inherit',
                                }}
                            >
                                {section.icon}
                            </ListItemIcon>
                        )}
                        <ListItemText
                            primary={
                                <Typography
                                    variant="subtitle2"
                                    color={hasActiveItem ? 'primary' : 'textSecondary'}
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.08em',
                                    }}
                                >
                                    {section.label}
                                </Typography>
                            }
                            sx={{
                                opacity: open ? 1 : 0,
                            }}
                        />
                        {open && (isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                    </ListItemButton>
                </ListItem>

                {open && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {renderMenuItems(section.items)}
                        </List>
                    </Collapse>
                )}

                {!open && (
                    <List component="div" disablePadding>
                        {renderMenuItems(section.items)}
                    </List>
                )}
            </React.Fragment>
        );
    };

    return (
        <StyledDrawer variant="permanent" open={open}>
            <DrawerHeader>
                <Box sx={{ flexGrow: 1 }}>
                    {open && (
                        <Typography variant="subtitle2" color="textSecondary" sx={{ pl: 2 }}>
                            {t('sidebar.collapseMenu')}
                        </Typography>
                    )}
                </Box>
                <IconButton onClick={handleDrawerToggle}>
                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />

            <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        component={Link}
                        to={`/${ROUTES.WORKSPACE}`}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            ...(location.pathname === `/${ROUTES.WORKSPACE}` && {
                                backgroundColor: 'action.selected',
                                '&:hover': {
                                    backgroundColor: 'action.selected',
                                },
                            }),
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: location.pathname === `/${ROUTES.WORKSPACE}` ? 'primary.main' : 'inherit',
                            }}
                        >
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={t('header.workspace')}
                            sx={{
                                opacity: open ? 1 : 0,
                                color: location.pathname === `/${ROUTES.WORKSPACE}` ? 'primary.main' : 'inherit',
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Render all collapsible sections */}
            {sidebarSections.map(renderSection)}

            <Divider sx={{ my: 1 }} />

            <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('sidebar.settings')} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </StyledDrawer>
    );
};
