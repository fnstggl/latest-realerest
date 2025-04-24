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
			screens: {
				'xs': '480px',
			},
			fontFamily: {
				sans: ['Helvetica', 'Arial', 'sans-serif'],
				futura: ['Futura', 'Helvetica', 'Arial', 'sans-serif'],
				'editorial': ['Playfair Display', 'Georgia', 'serif'], // A serif font that mimics the style
				'playfair': ['Playfair Display', 'serif'],
			},
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				donedeal: {
					'navy': '#000000',
					'red': '#000000',
					'pink': '#F8F9FA',
					'blue': '#F8F9FA',
					'light-gray': '#F8F9FA',
					'dark-gray': '#343A40'
				},
				glass: {
					purple: '#8B5CF6',
					orange: '#F97316',
					pink: '#FF3CAC',
					peach: '#FDE1D3',
					blue: '#000000',
					green: '#10B981',
					yellow: '#FBBF24',
					background: 'rgba(255, 255, 255, 0.05)',
					border: 'rgba(255, 255, 255, 0.1)',
					overlay: 'rgba(0, 0, 0, 0.2)',
				},
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'first': {
					'0%': { transform: 'translateX(-50%) rotate(0deg)' },
					'25%': { transform: 'translateX(50%) rotate(90deg) scale(1.2)' },
					'50%': { transform: 'translateX(-50%) rotate(180deg)' },
					'75%': { transform: 'translateX(50%) rotate(270deg) scale(0.8)' },
					'100%': { transform: 'translateX(-50%) rotate(360deg)' },
				},
				'second': {
					'0%': { transform: 'translateX(50%) translateY(0%)' },
					'25%': { transform: 'translateX(-30%) translateY(-50%)' },
					'50%': { transform: 'translateX(-50%) translateY(50%)' },
					'75%': { transform: 'translateX(30%) translateY(-50%)' },
					'100%': { transform: 'translateX(50%) translateY(0%)' },
				},
				'third': {
					'0%': { transform: 'translateX(-50%) translateY(50%) scale(1)' },
					'33%': { transform: 'translateX(50%) translateY(-50%) scale(1.2)' },
					'66%': { transform: 'translateX(-50%) translateY(50%) scale(0.8)' },
					'100%': { transform: 'translateX(-50%) translateY(50%) scale(1)' },
				},
				'fourth': {
					'0%': { transform: 'translateX(50%) translateY(50%) scale(1) rotate(0deg)' },
					'20%': { transform: 'translateX(0%) translateY(0%) scale(1.2) rotate(90deg)' },
					'40%': { transform: 'translateX(-50%) translateY(-50%) scale(1) rotate(180deg)' },
					'60%': { transform: 'translateX(0%) translateY(-100%) scale(0.8) rotate(270deg)' },
					'80%': { transform: 'translateX(50%) translateY(-50%) scale(1) rotate(360deg)' },
					'100%': { transform: 'translateX(50%) translateY(50%) scale(1) rotate(0deg)' },
				},
				'fifth': {
					'0%': { transform: 'translateX(0) scale(1.2)' },
					'33%': { transform: 'translateX(50%) scale(0.8)' },
					'66%': { transform: 'translateX(-50%) scale(1)' },
					'100%': { transform: 'translateX(0) scale(1.2)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'enter': 'fade-in 0.5s ease-out, scale-in 0.3s ease-out',
				'first': 'first 20s infinite',
				'second': 'second 30s infinite',
				'third': 'third 25s infinite',
				'fourth': 'fourth 40s infinite',
				'fifth': 'fifth 35s infinite'
			},
			backgroundImage: {
				'gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #7E69AB 100%)',
				'gradient-orange': 'linear-gradient(135deg, #F97316 0%, #FDBA74 100%)',
				'gradient-pink': 'linear-gradient(135deg, #FF3CAC 0%, #F8A4D8 100%)',
				'gradient-peach': 'linear-gradient(135deg, #FDE1D3 0%, #FECACA 100%)',
				'gradient-orange-pink': 'linear-gradient(135deg, #F97316 0%, #FF3CAC 100%)',
				'gradient-blue-purple': 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
				'gradient-green-blue': 'linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)',
				'gradient-yellow-orange': 'linear-gradient(135deg, #FBBF24 0%, #F97316 100%)',
				'rainbow-gradient': 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
