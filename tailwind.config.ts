import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
      },
      colors: {
        primary: {
          lighter: '#C8FAD6',
          light: '#5BE49B',
          main: '#00A76F',
          dark: '#007867',
          darker: '#004B50',
          contrastText: '#FFFFFF',
        },
      },
    },
  },
} satisfies Config;
