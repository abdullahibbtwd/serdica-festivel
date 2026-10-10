/**
 * Draft visibility: hidden in production builds unless PUBLIC_SHOW_DRAFTS=true.
 * Always visible in `astro dev`.
 */
export function showDrafts(): boolean {
	return import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';
}

export function isPublishedStatus(status: 'draft' | 'confirmed'): boolean {
	return status === 'confirmed' || showDrafts();
}

export function isPublishedRights(rightsConfirmed: boolean): boolean {
	return rightsConfirmed || showDrafts();
}
