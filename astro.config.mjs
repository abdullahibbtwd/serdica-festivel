// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	trailingSlash: 'always',
	site: 'https://example.bg',
	i18n: {
		defaultLocale: 'bg',
		locales: ['bg', 'en'],
		routing: {
			prefixDefaultLocale: true,
		},
	},
	integrations: [
		icon({
			include: {
				'material-symbols': [
					'account-balance',
					'menu',
					'close',
					'shield',
					'stars',
					'verified',
					'calendar-today',
					'calendar-month',
					'location-on',
					'confirmation-number',
					'arrow-forward',
					'near-me',
					'explore',
					'history-edu',
					'photo-library',
					'handshake',
					'mail',
					'pin-drop',
					'event-note',
					'event',
					'schedule',
					'subway',
					'directions-walk',
					'open-in-new',
					'map',
					'church',
					'museum',
					'theater-comedy',
					'public',
					'swords',
					'construction',
					'restaurant',
					'child-care',
					'temple-buddhist',
					'navigation',
					'location-city',
					'foundation',
					'groups',
					'travel-explore',
					'arrow-downward',
				],
			},
		}),
		sitemap({
			i18n: {
				defaultLocale: 'bg',
				locales: {
					bg: 'bg-BG',
					en: 'en-GB',
				},
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
