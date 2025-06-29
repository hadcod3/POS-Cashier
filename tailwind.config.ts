import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
    content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
  	extend: {
  		colors: {
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
  		backgroundImage: {
  			'hero-gradient': "url('/assets/images/hero_gradient.png')",
  			grid: "url('/assets/images/grid_bg.png')"
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'fadeInOut': {
  				'0%': {
  					opacity: '0.5'
  				},
  				'50%': {
  					opacity: '1'
  				},
  				'100%': {
  					opacity: '0.5'
  				}
  			},
  			'infinite-scroll': {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'100%': {
  					transform: 'translateX(-120%)'
  				}
  			},
  			'shine': {
  				'0%': {
  					'background-position': '100%'
  				},
  				'100%': {
  					'background-position': '-100%'
  				}
  			}
  		},
  		animation: {
  			'fadeInOut': 'fadeInOut 2.5s ease infinite',
  			'infinite-scroll': 'infinite-scroll 10s linear infinite',
  			'shine': 'shine 5s linear infinite'
  		},
  		scale: {
  			'200': '2',
  			'300': '3',
  			'400': '4'
  		},
  		transitionDelay: {
  			'500': '500ms',
  			'1000': '1000ms',
  			'1500': '1500ms',
  			'2000': '2000ms'
  		},
  		borderWidth: {
  			DEFAULT: '1px',
  			'0.5': '0.5px',
  			'0.25': '0.25px',
  			'0.1': '0.1px',
  			'0.05': '0.05px'
  		},
  		screens: {
  			'xs': '30rem',
  			'xmd': '55rem'
  		}
  	}
  },
}) satisfies Config;
