import React from 'react';

import Collapse from '@mui/material/Collapse';

import { TestCase } from '@services/api/models/aiAssistant';
import { Typography } from '@mui/material';

import styles from './TestCasePreview.module.less';

type Props = {
    testCase: TestCase;
};

const TestCasePreview: React.FC<Props> = ({ testCase }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div onClick={() => setIsOpen(!isOpen)}>
            <Typography className={styles.title}>
                {testCase.name} - {testCase.priority}
            </Typography>
            <Collapse in={isOpen} timeout="auto" onClick={() => setIsOpen(!isOpen)}>
                <div className={styles.cases}>
                    {testCase.steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <Typography>
                                <strong>Действие:&nbsp;&nbsp;</strong>
                                {step.action}
                            </Typography>
                            <Typography>
                                <strong>Ожидаемый результат:&nbsp;&nbsp;</strong>
                                {step.expectedResult}
                            </Typography>
                        </div>
                    ))}
                </div>
            </Collapse>
        </div>
    );
};

export default React.memo(TestCasePreview);
