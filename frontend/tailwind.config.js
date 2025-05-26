import { createThemes } from 'tw-colors';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    createThemes({
      light: {
        white: '#ffffff',
        black: '#000000',
        'dark-grey': '#6B6B6B',
        red: '#ff0000',
        transparent: 'transparent',
        twitter: '#1DA1F2',
        purple: '#8B46FF',
        background: '#ffffff',
        text: '#111827',
        card: '#f3f4f6',
        primary: '#1e40af',
      },
      dark: {
        white: '#0f172a',
        black: '#ffffff',
        'dark-grey': '#E7E7E7',
        red: '#991F1F',
        transparent: 'transparent',
        twitter: '#1DA1F2',
        purple: '#582C8E',
        background: '#0f172a',
        text: '#f9fafb',
        card: '#1e293b',
        primary: '#60a5fa',
      },
    }),
  ],
};
