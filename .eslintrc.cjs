module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended'
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
  settings: {
    tailwindcss: {
      whitelist: ['scrollbar-none']
    }
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'tailwindcss/enforces-shorthand': 0
  }
}
