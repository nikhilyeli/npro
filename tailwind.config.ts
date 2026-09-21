
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Second brand hue (violet) — gradients, logo, punchy tags.
				// Softer tint/text pair for badges & hovers lives at accent/accent-foreground.
				accent2: 'hsl(var(--accent-2))',
				// Status dot on the logo
				live: 'hsl(var(--live-dot))',
				// Roadmap states
				success: 'hsl(var(--success))',
				progress: 'hsl(var(--progress))',
				// The terminal window is its own always-dark object in both themes,
				// styled like a real shell rather than tracking the page palette.
				terminal: {
					bg: 'hsl(var(--terminal-bg))',
					fg: 'hsl(var(--terminal-fg))',
					muted: 'hsl(var(--terminal-muted))',
					prompt: 'hsl(var(--terminal-prompt))',
					command: 'hsl(var(--terminal-command))',
					highlight: 'hsl(var(--terminal-highlight))',
					cursor: 'hsl(var(--terminal-cursor))',
					red: 'hsl(var(--terminal-red))',
					yellow: 'hsl(var(--terminal-yellow))',
					green: 'hsl(var(--terminal-green))',
				}
			},
			fontSize: {
				display: ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
				'section-title': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
			},
			boxShadow: {
				soft: '0 1px 2px hsl(var(--foreground) / 0.04), 0 1px 3px hsl(var(--foreground) / 0.06)',
				lifted: '0 16px 30px -12px hsl(var(--foreground) / 0.22)',
				glow: '0 0 0 1px hsl(var(--primary) / 0.25), 0 10px 30px -8px hsl(var(--primary) / 0.45)',
			},
			fontFamily: {
				// Brand themes swap these via --font-sans / --font-mono
				sans: ['var(--font-sans)'],
				mono: ['var(--font-mono)'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				blink: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				typing: {
					'0%': { width: '0' },
					'100%': { width: '100%' }
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				rotate: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				blink: 'blink 1s step-end infinite',
				typing: 'typing 3.5s steps(40, end)',
				'pulse-light': 'pulse-light 2s ease-in-out infinite',
				rotate: 'rotate 10s linear infinite',
				float: 'float 6s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
