import { defaultLang, ui, type Lang, type UiKey } from './ui';

export function isLang(value: string): value is Lang {
	return value === 'bg' || value === 'en';
}

export function t(lang: Lang, key: UiKey, vars?: Record<string, string | number>): string {
	let value: string = ui[lang][key] ?? ui[defaultLang][key];
	if (vars) {
		for (const [name, replacement] of Object.entries(vars)) {
			value = value.replaceAll(`{${name}}`, String(replacement));
		}
	}
	return value;
}

/** Other locale for a given language. */
export function otherLang(lang: Lang): Lang {
	return lang === 'bg' ? 'en' : 'bg';
}

/**
 * Returns the equivalent path in the other language.
 * Expects a pathname like `/bg/`, `/bg/programme/`, `/en/programme/`.
 */
export function getLocalizedPath(pathname: string, targetLang: Lang): string {
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length === 0) {
		return `/${targetLang}/`;
	}

	if (isLang(segments[0])) {
		segments[0] = targetLang;
	} else {
		segments.unshift(targetLang);
	}

	return `/${segments.join('/')}/`;
}
