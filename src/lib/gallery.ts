import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { isPublishedRights } from './drafts';
import { getPublishedGroups } from './groups';

export type GalleryFilter = 'all' | '2025' | '2026' | string;

export interface GalleryItem {
	id: string;
	src: ImageMetadata;
	edition?: 2025 | 2026;
	group?: string;
	groupLabel?: string;
}

/** Edition archive photos + published group albums (e.g. Legio I Italica). */
export async function getGalleryItems(lang: 'bg' | 'en'): Promise<GalleryItem[]> {
	const editionItems: GalleryItem[] = (await getCollection('gallery'))
		.filter((entry) => isPublishedRights(entry.data.rightsConfirmed))
		.sort((a, b) => b.data.edition - a.data.edition || a.data.order - b.data.order)
		.map((entry) => ({
			id: entry.id,
			src: entry.data.src,
			edition: entry.data.edition,
		}));

	const groupItems: GalleryItem[] = [];
	for (const entry of await getPublishedGroups()) {
		entry.data.photos
			.filter((photo) => isPublishedRights(photo.rightsConfirmed))
			.forEach((photo, index) => {
				groupItems.push({
					id: `group-${entry.data.id}-${index}`,
					src: photo.src,
					group: entry.data.id,
					groupLabel: entry.data.shortName[lang],
				});
			});
	}

	return [...groupItems, ...editionItems];
}

/** Home teaser: first 4 legion photos, then 4 per edition year. */
export function galleryPreviewItems(items: GalleryItem[]): GalleryItem[] {
	const legion = items.filter((item) => item.group === 'legio-i-italica').slice(0, 4);
	const y2026 = items.filter((item) => item.edition === 2026).slice(0, 4);
	const y2025 = items.filter((item) => item.edition === 2025).slice(0, 4);
	return [...legion, ...y2026, ...y2025];
}

export function parseGalleryFilter(params: URLSearchParams): GalleryFilter {
	const group = params.get('group');
	if (group) return group;
	const year = params.get('year');
	if (year === '2025' || year === '2026') return year;
	return 'all';
}
