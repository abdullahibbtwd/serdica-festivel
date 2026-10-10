/**
 * Minimal markdown → HTML for bilingual content fields.
 * Supports paragraphs, unordered lists, **bold**, and *italic*.
 */
export function renderMarkdown(source: string): string {
	const escaped = source
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	const blocks = escaped
		.split(/\n{2,}/)
		.map((block) => block.trim())
		.filter(Boolean);

	return blocks
		.map((block) => {
			const lines = block.split('\n').map((line) => line.trimEnd());
			const isList = lines.every((line) => /^[-*]\s+/.test(line.trim()));
			if (isList) {
				const items = lines
					.map((line) => `<li>${inline(line.trim().replace(/^[-*]\s+/, ''))}</li>`)
					.join('');
				return `<ul>${items}</ul>`;
			}
			return `<p>${inline(lines.join(' '))}</p>`;
		})
		.join('\n');
}

function inline(text: string): string {
	return text
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
