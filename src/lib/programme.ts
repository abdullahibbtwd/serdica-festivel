import { getCollection, getEntry } from 'astro:content';
import { isPublishedStatus } from './drafts';

/**
 * Programme page / nav appear only when festival mode is upcoming,
 * nextEdition is set, and at least one confirmed programme item exists.
 */
export async function hasPublicProgramme(): Promise<boolean> {
	const festival = await getEntry('festival', 'festival');
	if (!festival) return false;
	if (festival.data.mode !== 'upcoming' || festival.data.nextEdition == null) {
		return false;
	}

	const days = await getCollection('programme');
	return days.some((day) => day.data.items.some((item) => item.status === 'confirmed'));
}

export async function getVisibleProgrammeDays(lang: 'bg' | 'en') {
	const locations = await getCollection('locations');
	const locationName = (id: string) => {
		const match = locations.find((loc) => loc.id === id);
		return match ? match.data.name[lang] : id;
	};

	return (await getCollection('programme'))
		.map((entry) => ({
			id: entry.id,
			day: entry.data.day,
			label: entry.data.label[lang],
			items: entry.data.items
				.filter((item) => isPublishedStatus(item.status))
				.map((item) => ({
					...item,
					title: item.title[lang],
					description: item.description[lang],
					locationName: locationName(item.location),
					isDraft: item.status === 'draft',
				}))
				.sort((a, b) => a.time.localeCompare(b.time)),
		}))
		.filter((day) => day.items.length > 0)
		.sort((a, b) => a.day - b.day);
}
