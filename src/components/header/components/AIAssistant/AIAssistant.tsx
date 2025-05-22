import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import GraphicEq from '@mui/icons-material/GraphicEq';

import { useGenerateTestSuiteMutation } from '@services/api/rtkQuery';
import { AITestSuite } from '@services/api/models/aiAssistant';
import TestCasePreview from './components/TestCasePreview/TestCasePreview';

const AIAssistant: React.FC = () => {
    const [isOpen, setOpen] = useState(false);
    const [promt, setPrompt] = useState('');
    const [data, setData] = useState<AITestSuite>();

    const { t } = useTranslation();
    const [generateTestSuite, { isLoading, error }] = useGenerateTestSuiteMutation();

    const handleClose = (): void => {
        setOpen(false);
        setPrompt('');
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            const { data } = await generateTestSuite(promt);

            if (data) {
                setData(data);
            }
        } catch (error) {
            console.error('Failed to create organization:', error);
        }
    };

    return (
        <div>
            <IconButton onClick={() => setOpen(true)}>
                <GraphicEq />
            </IconButton>
            <Dialog open={isOpen} onClose={handleClose} fullWidth>
                <DialogTitle>AI Assistant</DialogTitle>
                {data ? (
                    <DialogContent>
                        <Typography sx={{ marginTop: 2 }}>{data.name}</Typography>
                        <Typography sx={{ marginBottom: 2 }}>{data.description}</Typography>
                        {data.testCases.map((testCase) => (
                            <TestCasePreview key={testCase.name} testCase={testCase} />
                        ))}
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <p>{t('aiAssistant.title')}</p>
                        <TextField
                            fullWidth
                            name="title"
                            placeholder={t('aiAssistant.textarea')}
                            value={promt}
                            onChange={(e) => setPrompt(e.target.value)}
                            variant="outlined"
                            multiline
                            rows={6}
                        />
                        {error && <p>Sorry, something went wrong</p>}
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {t('common.close')}
                    </Button>
                    {data ? (
                        <Button onClick={() => setData(undefined)} variant="contained" disabled={isLoading}>
                            {t('common.reset')}
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
                            {isLoading ? t('common.loading') : t('common.ask')}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default React.memo(AIAssistant);
