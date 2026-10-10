import type { Lang } from '../i18n/ui';
import { isPublishedStatus, showDrafts } from './drafts';

type Bilingual = { bg: string; en: string };
type Status = 'draft' | 'confirmed';

export interface EditionDay {
	date: string;
	label: Bilingual;
	status: Status;
	places: Array<{
		name: Bilingual;
		note?: Bilingual;
		mapUrl?: string;
		status: Status;
	}>;
}

export interface EditionData {
	year: 2025 | 2026;
	number: 1 | 2;
	status: 'past' | 'upcoming';
	name: Bilingual;
	days: EditionDay[];
	summary: Bilingual;
	theme?: Bilingual;
	highlights?: Bilingual[];
	visitorActivities?: Bilingual[];
	weatherNote?: Bilingual;
	stats?: {
		participants?: { value: string; status: Status };
		countries?: { value: number; list?: Bilingual; status: Status };
		groups?: { value: number; status: Status };
		locations?: { value: number; status: Status };
	};
	funding?: Bilingual;
	partners: Array<{ id: string; role: 'organiser' | 'funder' | 'institutional' | 'sponsor' }>;
	participatingGroups?: string[];
	media?: Array<{ outlet: string; title?: Bilingual; url?: string; status: Status }>;
	additionalNotes?: Array<{ text: Bilingual; status: Status }>;
}

/** Confirmed days only (or all when drafts visible). */
export function visibleDays(edition: EditionData) {
	return edition.days.filter((day) => isPublishedStatus(day.status));
}

/** Short date range label from confirmed (or visible) days. */
export function formatEditionDates(edition: EditionData, lang: Lang): string {
	const days = visibleDays(edition);
	if (days.length === 0) return '';

	const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
	const first = sorted[0].date;
	const last = sorted[sorted.length - 1].date;

	const fmt = (iso: string) => {
		const [y, m, d] = iso.split('-').map(Number);
		const date = new Date(Date.UTC(y, m - 1, d));
		return new Intl.DateTimeFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC',
		}).format(date);
	};

	if (first === last) return fmt(first);

	const [y1, m1, d1] = first.split('-').map(Number);
	const [y2, m2, d2] = last.split('-').map(Number);

	if (y1 === y2 && m1 === m2) {
		const monthYear = new Intl.DateTimeFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', {
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC',
		}).format(new Date(Date.UTC(y1, m1 - 1, d1)));
		return lang === 'bg' ? `${d1}–${d2} ${monthYear}` : `${d1}–${d2} ${monthYear}`;
	}

	return `${fmt(first)} – ${fmt(last)}`;
}

/** Compact meta for hero: "2–3 October 2026" */
export function formatEditionDatesCompact(edition: EditionData, lang: Lang): string {
	const days = visibleDays(edition).filter((d) => d.status === 'confirmed' || showDrafts());
	const confirmed = days.filter((d) => d.status === 'confirmed');
	const use = confirmed.length ? confirmed : days;
	if (!use.length) return '';

	const sorted = [...use].sort((a, b) => a.date.localeCompare(b.date));
	const first = sorted[0].date;
	const last = sorted[sorted.length - 1].date;
	const [, m1, d1] = first.split('-').map(Number);
	const [y2, m2, d2] = last.split('-').map(Number);

	const month = new Intl.DateTimeFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', {
		month: 'long',
		timeZone: 'UTC',
	}).format(new Date(Date.UTC(y2, m2 - 1, d2)));

	if (first === last) {
		return lang === 'bg' ? `${d1} ${month} ${y2}` : `${d1} ${month} ${y2}`;
	}

	if (m1 === m2) {
		return lang === 'bg' ? `${d1}–${d2} ${month} ${y2}` : `${d1}–${d2} ${month} ${y2}`;
	}

	return formatEditionDates(edition, lang);
}

export function editionStartEnd(edition: EditionData): { startDate?: string; endDate?: string } {
	const confirmed = edition.days
		.filter((d) => d.status === 'confirmed')
		.map((d) => d.date)
		.sort();
	if (!confirmed.length) return {};
	return { startDate: confirmed[0], endDate: confirmed[confirmed.length - 1] };
}

export function visiblePlaces(day: EditionDay) {
	return day.places.filter((p) => isPublishedStatus(p.status));
}

export function confirmedStat<T extends { status: Status }>(stat: T | undefined): T | undefined {
	if (!stat) return undefined;
	return isPublishedStatus(stat.status) ? stat : undefined;
}
