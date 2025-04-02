import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
    Typography,
    Box,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { TestRun, TestRunStatus } from '../model/testRun';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TestRunStatsBar } from './TestRunStatsBar';
import { EditTestRunModal } from './EditTestRunModal';
import { DeleteTestRunModal } from './DeleteTestRunModal';

interface TestRunsTableProps {
    testRuns: TestRun[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEditTestRun?: (testRun: TestRun, data: any) => void;
    onDeleteTestRun?: (testRun: TestRun) => void;
}

export const TestRunsTable: React.FC<TestRunsTableProps> = ({
    testRuns,
    onEditTestRun = () => {},
    onDeleteTestRun = () => {},
}) => {
    const { t } = useTranslation();
    const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [, setSelectedRunId] = useState<string | null>(null);

    // Состояния для модальных окон
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTestRun, setSelectedTestRun] = useState<TestRun | null>(null);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedRuns(testRuns.map((run) => run.id));
        } else {
            setSelectedRuns([]);
        }
    };

    const handleSelect = (id: string) => {
        const selectedIndex = selectedRuns.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedRuns, id];
        } else {
            newSelected = selectedRuns.filter((runId) => runId !== id);
        }

        setSelectedRuns(newSelected);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, run: TestRun) => {
        setAnchorEl(event.currentTarget);
        setSelectedRunId(run.id);
        setSelectedTestRun(run);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRunId(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        setIsEditModalOpen(true);
    };

    const handleDelete = () => {
        handleMenuClose();
        setIsDeleteModalOpen(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEditConfirm = (data: any) => {
        if (selectedTestRun) {
            onEditTestRun(selectedTestRun, data);
        }

        setIsEditModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (selectedTestRun) {
            onDeleteTestRun(selectedTestRun);
        }

        setIsDeleteModalOpen(false);
    };

    const formatTime = (seconds: number): string => {
        if (seconds === 0) return '0s';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let result = '';

        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}m `;
        if (remainingSeconds > 0 || result === '') result += `${remainingSeconds}s`;

        return result.trim();
    };

    const getStatusChip = (status: TestRunStatus) => {
        const statusColors: Record<TestRunStatus, { bg: string; text: string }> = {
            inProgress: { bg: '#3f51b5', text: 'white' },
            passed: { bg: '#4caf50', text: 'white' },
            failed: { bg: '#f44336', text: 'white' },
            blocked: { bg: '#ff9800', text: 'white' },
            invalid: { bg: '#9c27b0', text: 'white' },
        };

        const { bg, text } = statusColors[status];

        return (
            <Chip
                label={t(`testRuns.status.${status}`)}
                size="small"
                sx={{
                    backgroundColor: bg,
                    color: text,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                }}
            />
        );
    };

    const getTimeSinceStarted = (startedAt: string): string => {
        const started = new Date(startedAt);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - started.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return t('testRuns.startedToday');
        } else if (diffInDays === 1) {
            return t('testRuns.startedYesterday');
        } else {
            return t('testRuns.startedDaysAgo', { count: diffInDays });
        }
    };

    const isSelected = (id: string) => selectedRuns.indexOf(id) !== -1;

    return (
        <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedRuns.length > 0 && selectedRuns.length < testRuns.length}
                                    checked={testRuns.length > 0 && selectedRuns.length === testRuns.length}
                                    onChange={handleSelectAll}
                                    inputProps={{ 'aria-label': 'select all test runs' }}
                                />
                            </TableCell>
                            <TableCell>{t('testRuns.columns.title')}</TableCell>
                            <TableCell>{t('testRuns.columns.status')}</TableCell>
                            <TableCell>{t('testRuns.columns.author')}</TableCell>
                            <TableCell>{t('testRuns.columns.environment')}</TableCell>
                            <TableCell>{t('testRuns.columns.totalTime')}</TableCell>
                            <TableCell>{t('testRuns.columns.elapsedTime')}</TableCell>
                            <TableCell>{t('testRuns.columns.testRunStats')}</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {testRuns.map((run) => {
                            const isItemSelected = isSelected(run.id);

                            return (
                                <TableRow
                                    key={run.id}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            onClick={() => handleSelect(run.id)}
                                            inputProps={{ 'aria-labelledby': `test-run-${run.id}` }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {run.title}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {getTimeSinceStarted(run.startedAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{getStatusChip(run.status)}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    bgcolor: 'primary.main',
                                                    color: 'primary.contrastText',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '4px',
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                {run.author.avatar || run.author.name.charAt(0)}
                                            </Box>
                                            <Typography variant="body2">{run.author.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{run.environment}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{formatTime(run.totalTime)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{formatTime(run.elapsedTime)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Box sx={{ flexGrow: 1, mr: 1 }}>
                                                <TestRunStatsBar stats={run.stats} />
                                            </Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                {run.stats.total}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={(event) => handleMenuOpen(event, run)}
                                            aria-label={t('testRuns.menu.tooltip')}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Меню с действиями */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('common.edit')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>{t('common.delete')}</ListItemText>
                </MenuItem>
            </Menu>

            {/* Модальное окно для редактирования */}
            {selectedTestRun && (
                <EditTestRunModal
                    open={isEditModalOpen}
                    testRun={selectedTestRun}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditConfirm}
                />
            )}

            {/* Модальное окно для подтверждения удаления */}
            {selectedTestRun && (
                <DeleteTestRunModal
                    open={isDeleteModalOpen}
                    testRun={selectedTestRun}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </>
    );
};
