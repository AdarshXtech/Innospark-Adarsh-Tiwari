import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c6af7',
        primary_container: '#b8b0ff',
        primary_dark: '#4f3fe0',
        surface: '#0e1117',
        surface_container_lowest: '#070a0f',
        surface_container_low: '#141821',
        surface_container: '#1a1f2e',
        surface_container_high: '#222840',
        surface_container_highest: '#2c334f',
        surface_bright: '#343d5c',
        on_surface: '#e2e4f0',
        on_surface_variant: '#8890b0',
        outline_variant: 'rgba(124,106,247,0.2)',
        gold: '#c9a84c',
        gold_light: '#e8c97a',
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        ambient: '0 0 40px 0 rgba(30,28,28,0.06)',
        glow: '0 0 24px 0 rgba(255,107,0,0.25)',
        'glow-sm': '0 0 12px 0 rgba(255,107,0,0.15)',
      },
    },
  },
  plugins: [],
}
export default config
