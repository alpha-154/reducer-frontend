import type { Config } from "tailwindcss";
import tailwindCssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			'styrene-thin': ["var(--font-styrene-thin)"],
  			'styrene-thin-italic': ["var(--font-styrene-thin-italic)"],
  			'styrene-regular': ["var(--font-styrene-regular)"],
  			'styrene-medium': ["var(--font-styrene-medium)"],
  			'styrene-bold': ["var(--font-styrene-bold)"],
  			'styrene-a-thin-italic': ["var(--font-styreneA-thin-italic)"],
  			'styrene-a-thin-trial': ["var(--font-styreneA-thin-trial)"]
  		},
  		colors: {
  			colors: {
  				'custom-orange': '#eb683f',
  				'custom-orange-thin': '#22180b',
  				'custom-orange-text-1': '#66410e ',
  				'custom-orange-text-2': '#ee940b',
  				'custom-orange-text-3': '#ff9f0b',
  				'dark-shade': '#130d06'
  			},
  			albasterbg: '#F1F0E8',
  			albasterInnerBg: '#EBE9DF',
  			boneInnerBg: '#DED8C4',
  			burntSienna: '#D87D5D',
  			burntSiennaDeep: '#E2714F',
  			nightText: '#10100E',
  			brownText: '#535146',
  			darkbrownText: '#3D3929',
  			cardBlueBg: '#E7E3F1',
  			cardBlueBorder: '#9D8CE3',
  			textBlue: '#433872',
  			inputBg: '#F8F8F7',
  			messageOne: '#F4F4F1',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [tailwindCssAnimate],
};
export default config;
