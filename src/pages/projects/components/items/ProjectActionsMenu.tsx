import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { ProjectResponseDto } from '@services/api/models/projects';

interface ProjectActionsMenuProps {
    project: ProjectResponseDto;
    onEdit: (project: ProjectResponseDto) => void;
    onDelete: (project: ProjectResponseDto) => void;
}

export const ProjectActionsMenu: React.FC<ProjectActionsMenuProps> = ({ project, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: unknown) => {
        if (event && typeof event === 'object' && 'stopPropagation' in event) {
            (event as React.MouseEvent<HTMLElement>).stopPropagation();
        }

        setAnchorEl(null);
    };

    const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onEdit(project);
        handleClose(event);
    };

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onDelete(project);
        handleClose(event);
    };

    return (
        <>
            <Tooltip title={t('testRuns.menu.tooltip')}>
                <IconButton
                    aria-label="more"
                    id={`project-actions-button-${project.id}`}
                    aria-controls={open ? `project-actions-menu-${project.id}` : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                    size="small"
                >
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            <Menu
                id={`project-actions-menu-${project.id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('projects.editProject')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>{t('common.delete')}</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};
