import React from 'react';
import { Box, Tooltip, styled } from '@mui/material';
import { TestRunStats } from '../model/testRun';

interface TestRunStatsBarProps {
    stats: TestRunStats;
}

interface SegmentProps {
    width: number;
    color: string;
    count: number;
    label: string;
}

const StatsBarContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: 20,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    overflow: 'hidden',
}));

const Segment = styled(Box)<{ width: number; color: string }>(({ width, color }) => ({
    height: '100%',
    width: `${width}%`,
    backgroundColor: color,
}));

export const TestRunStatsBar: React.FC<TestRunStatsBarProps> = ({ stats }) => {
    const { total, passed, failed, blocked, skipped, invalid } = stats;

    // Расчет процентного соотношения для каждого сегмента
    const calculateSegments = (): SegmentProps[] => {
        if (total === 0) return [];

        return [
            {
                width: (passed / total) * 100,
                color: '#4CAF50', // зеленый для пройденных тестов
                count: passed,
                label: 'Passed',
            },
            {
                width: (failed / total) * 100,
                color: '#F44336', // красный для упавших тестов
                count: failed,
                label: 'Failed',
            },
            {
                width: (blocked / total) * 100,
                color: '#FF9800', // оранжевый для заблокированных тестов
                count: blocked,
                label: 'Blocked',
            },
            {
                width: (skipped / total) * 100,
                color: '#9E9E9E', // серый для пропущенных тестов
                count: skipped,
                label: 'Skipped',
            },
            {
                width: (invalid / total) * 100,
                color: '#9C27B0', // фиолетовый для недействительных тестов
                count: invalid,
                label: 'Invalid',
            },
        ].filter((segment) => segment.count > 0);
    };

    const segments = calculateSegments();

    return (
        <StatsBarContainer>
            {segments.map((segment, index) => (
                <Tooltip key={index} title={`${segment.label}: ${segment.count} (${segment.width.toFixed(1)}%)`} arrow>
                    <Segment width={segment.width} color={segment.color} />
                </Tooltip>
            ))}
        </StatsBarContainer>
    );
};
