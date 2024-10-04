import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg-color': 'rgb(104, 109, 118, 0.3)',
      }
    },
    screens :{
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    breakpoints: {
      sm: 576,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#ffffff',
            text: '#333333', // NextUI의 light 테마 텍스트 색상
          },
        },
        dark: {
          colors: {
            background: '#27272A',
            text: '#ffffff', // NextUI의 dark 테마 텍스트 색상
          },
        },
      },
    }),
  ],
}
