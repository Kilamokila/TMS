import type { Config } from 'stylelint';

const config: Config = {
    extends: ['stylelint-config-standard'],
    rules: {
        'at-rule-empty-line-before': ['always', { except: ['blockless-after-same-name-blockless'] }],
        'media-feature-range-notation': 'prefix',
        'media-query-no-invalid': null,
        'selector-class-pattern': null,
    },
    overrides: [
        {
            files: ['*.less', '**/*.less'],
            customSyntax: 'postcss-less',
        },
    ],
};

export default config;
