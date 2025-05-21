import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface PaginationProps {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    page,
    pageSize,
    totalPages,
    onPageChange,
    onPageSizeChange,
}) => {
    const { t } = useTranslation();

    const handlePrevPage = useCallback(() => {
        if (page > 0) {
            onPageChange(page - 1);
        }
    }, [page, onPageChange]);

    const handleNextPage = useCallback(() => {
        if (page < totalPages - 1) {
            onPageChange(page + 1);
        }
    }, [page, totalPages, onPageChange]);

    const handlePageSizeChange = useCallback(
        (event: SelectChangeEvent<number>) => {
            onPageSizeChange(Number(event.target.value));
            onPageChange(0);
        },
        [onPageSizeChange, onPageChange],
    );

    const displayPage = page + 1;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 2,
                px: 1,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {t('projects.rowsPerPage')}
                </Typography>
                <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 70 }}
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handlePrevPage} disabled={page === 0} size="small">
                    <ChevronLeftIcon />
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mx: 1,
                        minWidth: 30,
                    }}
                >
                    <Typography
                        variant="body2"
                        component="span"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'medium',
                        }}
                    >
                        {displayPage}
                    </Typography>
                </Box>

                <IconButton onClick={handleNextPage} disabled={page >= totalPages - 1} size="small">
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
};
