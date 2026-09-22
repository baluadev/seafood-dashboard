import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Stitch BigCart palette — mapped to Poppins/green brand
        'primary': '#356b00',
        'primary-dark': '#6CC51D',
        'primary-light': '#EBFFD7',
        'primary-container': '#6cc51d',
        'primary-base': '#AEDC81',
        'secondary': '#42691c',
        'secondary-fixed': '#c2f193',
        'on-secondary-fixed-variant': '#2b5002',
        'surface': '#f8f9fa',
        'surface-mist': '#F4F5F9',
        'surface-neutral': '#F5F5F5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f4f4',
        'surface-container': '#edeeef',
        'surface-container-high': '#e7e8e9',
        'surface-container-highest': '#e1e3e3',
        'surface-bright': '#f8f9fa',
        'surface-dim': '#d9dadb',
        'border-subtle': '#EBEBEB',
        'text-dark': '#000000',
        'text-muted': '#868889',
        'on-surface': '#191c1d',
        'on-primary': '#ffffff',
        'on-primary-container': '#244c00',
        'on-secondary-container': '#486f21',
        'on-secondary': '#ffffff',
        'background': '#f8f9fa',
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'link-accent': '#1A0DAB',
        'outline': '#707a65',
        'outline-variant': '#c0cab2',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '0.75rem',
        'space-lg': '1rem',
        'space-xl': '1.5rem',
        'space-2xl': '2rem',
        'gutter': '1rem',
        'gutter-desktop': '1.5rem',
        'margin': '1rem',
        'margin-desktop': '2.5rem',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        '2xl': '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
