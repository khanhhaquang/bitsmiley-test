module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'postcss.config.js',
    'tailwind.config.js',
    'src/**/*.svg',
    '**/public/**',
    '**/node_modules/**',
    'scripts/**'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'tailwindcss/no-custom-classname': [
      'error',
      {
        whitelist: ['scrollbar-none']
      }
    ],
    'import/no-unresolved': 'error',
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      1,
      {
        'newlines-between': 'always',
        groups: [
          'external',
          'builtin',
          'internal',
          'sibling',
          'parent',
          'index'
        ],
        pathGroups: [
          { pattern: '@/components', group: 'internal' },
          { pattern: '@/components/**', group: 'internal' },
          { pattern: '@/configs', group: 'internal' },
          { pattern: '@/config/**', group: 'internal' },
          { pattern: '@/contracts/**', group: 'internal' },
          { pattern: '@/hooks/**', group: 'internal' },
          { pattern: '@/pages/**', group: 'internal' },
          { pattern: '@/assets/**', group: 'internal' },
          { pattern: '@/services/**', group: 'internal' },
          { pattern: '@/store/**', group: 'internal' },
          { pattern: '@/types/**', group: 'internal' },
          { pattern: '@/utils/**', group: 'internal' },
          { pattern: '@/abi/**', group: 'internal' }
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  },
  overrides: [
    {
      files: ['./src/hooks/*.ts'],
      rules: {
        'import/no-default-export': 'error'
      }
    }
  ]
}
