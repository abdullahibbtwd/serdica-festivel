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
		/** Which upcoming edition year this day belongs to */
		editionYear: z.union([z.literal(2025), z.literal(2026)]).optional(),
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

/** Kept for future upcoming editions — not used on home while mode is between-editions. */
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
		role: z.enum(['organiser', 'funder', 'institutional', 'sponsor']),
		editions: z.array(z.union([z.literal(2025), z.literal(2026)])).min(1),
		url: z.url().optional(),
		logo: z.string().optional(),
		status,
	}),
});

const gallery = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/gallery' }),
	schema: ({ image }) =>
		z
			.object({
				src: image(),
				alt: bilingual,
				caption: bilingual.optional(),
				edition: z.union([z.literal(2025), z.literal(2026)]),
				credit: z.string().optional(),
				rightsConfirmed: z.boolean().default(false),
				order: z.number().int().nonnegative().default(0),
			})
			.superRefine((data, ctx) => {
				if (data.rightsConfirmed && !data.credit?.trim()) {
					ctx.addIssue({
						code: 'custom',
						message: 'credit is required when rightsConfirmed is true',
						path: ['credit'],
					});
				}
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

const editions = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/editions' }),
	schema: z.object({
		year: z.union([z.literal(2025), z.literal(2026)]),
		number: z.union([z.literal(1), z.literal(2)]),
		status: z.enum(['past', 'upcoming']),
		name: bilingual,
		days: z
			.array(
				z.object({
					date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
					label: bilingual,
					status,
					places: z
						.array(
							z.object({
								name: bilingual,
								note: bilingual.optional(),
								mapUrl: z.url().optional(),
								status,
							}),
						)
						.default([]),
				}),
			)
			.min(1),
		summary: bilingual,
		theme: bilingual.optional(),
		highlights: z.array(bilingual).optional(),
		visitorActivities: z.array(bilingual).optional(),
		weatherNote: bilingual.optional(),
		stats: z
			.object({
				participants: z
					.object({
						value: z.string().min(1),
						status,
					})
					.optional(),
				countries: z
					.object({
						value: z.number().int().positive(),
						/** Optional confirmed list of country names */
						list: bilingual.optional(),
						status,
					})
					.optional(),
				groups: z
					.object({
						value: z.number().int().positive(),
						status,
					})
					.optional(),
				locations: z
					.object({
						value: z.number().int().positive(),
						status,
					})
					.optional(),
			})
			.optional(),
		funding: bilingual.optional(),
		partners: z
			.array(
				z.object({
					id: z.string().min(1),
					role: z.enum(['organiser', 'funder', 'institutional', 'sponsor']),
				}),
			)
			.default([]),
		participatingGroups: z.array(z.string().min(1)).optional(),
		media: z
			.array(
				z.object({
					outlet: z.string().min(1),
					title: bilingual.optional(),
					url: z.url().optional(),
					status,
				}),
			)
			.optional(),
		additionalNotes: z
			.array(
				z.object({
					text: bilingual,
					status,
				}),
			)
			.optional(),
	}),
});

const about = defineCollection({
	loader: glob({ pattern: '**/*.{yaml,yml,md}', base: './src/content/about' }),
	schema: ({ image }) =>
		z.object({
			eyebrow: bilingual,
			title: bilingual,
			/** Short teaser on the home page */
			lead: bilingual,
			/** Mission line highlighted on home */
			mission: bilingual,
			/** Full body paragraphs */
			paragraphs: z.array(bilingual).min(1),
			image: image().optional(),
			imageAlt: bilingual.optional(),
		}),
});

const festival = defineCollection({
	loader: glob({ pattern: 'festival.yaml', base: './src/content' }),
	schema: ({ image }) =>
		z.object({
			mode: z.enum(['between-editions', 'upcoming']),
			nextEdition: z.union([z.literal(2025), z.literal(2026)]).nullable(),
			admission: z.enum(['unknown', 'free', 'paid']),
			email: z.email(),
			phone: z.string().optional(),
			phoneStatus: status.optional(),
			facebook: z.url().optional(),
			facebookStatus: status.optional(),
			city: bilingual,
			tagline: bilingual,
			photographers: z
				.array(
					z.object({
						name: z.string().min(1),
						status,
					}),
				)
				.default([]),
			hero: z.object({
				title: bilingual,
				tagline: bilingual,
				eyebrow: bilingual,
				image: image(),
				imageAlt: bilingual,
			}),
		}),
});

export const collections = {
	programme,
	locations,
	partners,
	gallery,
	expect,
	editions,
	about,
	festival,
};
