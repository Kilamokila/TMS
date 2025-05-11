// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PaletteOptions } from '@mui/material';

declare module '@mui/material/styles' {
    interface Palette {
        border: {
            main: string;
            light: string;
            dark: string;
        };
        status: {
            inProgress: string;
            failed: string;
            passed: string;
            blocked: string;
            retest: string;
            skipped: string;
            invalid: string;
        };
    }

    interface PaletteOptions {
        border?: {
            main: string;
            light: string;
            dark: string;
        };
        status?: {
            inProgress: string;
            failed: string;
            passed: string;
            blocked: string;
            retest: string;
            skipped: string;
            invalid: string;
        };
    }
}
