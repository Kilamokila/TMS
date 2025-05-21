import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const config: UserConfig = defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
        modules: {
            localsConvention: 'camelCase',
        },
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@context': path.resolve(__dirname, 'src/context'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@types': path.resolve(__dirname, 'src/types'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@router': path.resolve(__dirname, 'src/router'),
            '@store': path.resolve(__dirname, 'src/store'),
            '@schemas': path.resolve(__dirname, 'src/schemas'),
            '@src': path.resolve(__dirname, 'src'),
        },
    },
});

export default config;
