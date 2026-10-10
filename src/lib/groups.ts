import { getCollection } from 'astro:content';
import { isPublishedStatus } from './drafts';

export async function getPublishedGroups() {
	return (await getCollection('groups'))
		.filter((entry) => isPublishedStatus(entry.data.status))
		.map((entry) => ({
			...entry,
			isDraft: entry.data.status === 'draft',
		}));
}

/** Map edition participating-group labels → group page href when published. */
export async function getGroupPageHrefByLabel(lang: 'bg' | 'en'): Promise<Map<string, string>> {
	const map = new Map<string, string>();
	for (const entry of await getPublishedGroups()) {
		const href = `/${lang}/groups/${entry.data.id}/`;
		map.set(entry.data.name.en, href);
		map.set(entry.data.name.bg, href);
		map.set(entry.data.shortName.en, href);
		map.set(entry.data.shortName.bg, href);
	}
	return map;
}
