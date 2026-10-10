import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** Both locale strings are required — a missing bg or en fails the build. */
const bilingual = z.object({
	bg: z.string().min(1),
	en: z.string().min(1),
});

const status = z.enum(['draft', 'confirmed']).default('draft');

const programmeTag = z.enum([
	'kids',
	'join-in',
	'battle',
	'craft',
	'food',
	'ceremony',
	'spectacle',
]);

const programme = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/programme' }),
	schema: z.object({
		day: z.number().int().positive(),
		label: bilingual,
		items: z.array(
			z.object({
				time: z.string().min(1),
				title: bilingual,
				description: bilingual,
				location: z.string().min(1),
				tags: z.array(programmeTag).default([]),
				highlight: z.boolean().default(false),
				status,
			}),
		),
	}),
});

const locations = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/locations' }),
	schema: z.object({
		name: bilingual,
		address: bilingual,
		schedule: bilingual.optional(),
		transport: bilingual.optional(),
		mapUrl: z.url(),
		mapPin: z
			.object({
				lat: z.number().min(-90).max(90),
				lng: z.number().min(-180).max(180),
			})
			.optional(),
		status,
	}),
});

const partners = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/partners' }),
	schema: z.object({
		name: bilingual,
		subtitle: bilingual.optional(),
		url: z.url(),
		logo: z.string().optional(),
		icon: z.string().optional(),
		group: z.enum(['organiser', 'institutional', 'sponsor']),
		status,
	}),
});

const gallery = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/gallery' }),
	schema: ({ image }) =>
		z.object({
			src: image(),
			alt: bilingual,
			caption: bilingual.optional(),
			credit: z.string().optional(),
			rightsConfirmed: z.boolean().default(false),
			order: z.number().int().nonnegative().default(0),
		}),
});

const expect = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/expect' }),
	schema: ({ image }) =>
		z.object({
			title: bilingual,
			description: bilingual,
			tag: bilingual,
			venueHint: bilingual.optional(),
			icon: z.string().optional(),
			image: image(),
			alt: bilingual,
			isKids: z.boolean().default(false),
			order: z.number().int().nonnegative().default(0),
			status,
		}),
});

const festival = defineCollection({
	loader: glob({ pattern: 'festival.yaml', base: './src/content' }),
	schema: ({ image }) =>
		z.object({
			edition: z.string().min(1),
			dates: bilingual.optional(),
			admission: z.enum(['unknown', 'free', 'paid']),
			email: z.email(),
			facebook: z.url().optional(),
			hero: z.object({
				title: bilingual,
				tagline: bilingual,
				eyebrow: bilingual,
				image: image(),
				imageAlt: bilingual,
			}),
			about: z.object({
				eyebrow: bilingual,
				title: bilingual,
				// Needs organiser confirmation — see comments in festival.yaml
				quote: bilingual.optional(),
				paragraphs: z.array(bilingual).min(1),
				image: image(),
				imageAlt: bilingual,
				imageCredit: bilingual.optional(),
			}),
			stats: z.object({
				participants: z.number().int().nonnegative(),
				countries: z.number().int().nonnegative(),
				/** Optional third stat — omit until confirmed */
				days: z.number().int().positive().optional(),
			}),
			locationsIntro: bilingual.optional(),
		}),
});

export const collections = {
	programme,
	locations,
	partners,
	gallery,
	expect,
	festival,
};
