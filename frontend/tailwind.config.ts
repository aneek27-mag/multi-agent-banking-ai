import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "surface-bright": "#2f3952", 
        "surface-variant": "#2a344e", 
        "surface-container-high": "#1f2942", 
        "surface-container-lowest": "#030d25", 
        "surface-dim": "#07122a", 
        "surface": "#07122a", 
        "surface-container-low": "#101b33", 
        "surface-container-highest": "#2a344e", 
        "surface-container": "#151f37", 
        "primary-fixed-dim": "#00daf3", 
        "on-surface": "#d9e2ff", 
        "on-surface-variant": "#bac9cc", 
        "secondary-container": "#3c4962",
        "background": "#07122a", 
        "on-primary": "#00363d",
        "tertiary-fixed-dim": "#d1bcff",
        "error": "#ffb4ab",
      },
      fontFamily: {
        "label-md": ["JetBrains Mono", "monospace"],
        "body-md": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
      }
    },
  },
  plugins: [],
}
export default config