import { IAugmentedJQuery } from 'angular';
let Prism = require('prismjs');

function getWhitespaceLength(line: string): number {
	let matches = line.match(/^\s+/);
	if (matches) {
		return matches[0].length;
	}
	else {
		return 0;
	}
}

function normalizeWhitespace(code): string {
	// Remove leading and trailing empty lines, convert spaces to tabs
	code = code.replace(/^\s*\n/, '');
	code = code.replace(/\n\s*$/, '');
	code = code.replace(/ {4}/g, '\t');

	// Remove common leading whitespace
	let lines = code.split('\n');
	let commonWhitespaceLength = -1;
	let whitespaceLength = 0;

	lines.forEach((line: string) => {
		whitespaceLength = getWhitespaceLength(line);
		if (whitespaceLength > 0) {
			if (commonWhitespaceLength === -1 || whitespaceLength < commonWhitespaceLength) {
				commonWhitespaceLength = whitespaceLength;
			}
		}
	});

	if (commonWhitespaceLength > 0) {
		lines = lines.map((line: string) => {
			return line.slice(commonWhitespaceLength);
		});
		code = lines.join('\n');
	}

	return code;
}

export default function highlight(code: string, language: string): IAugmentedJQuery {
	code = normalizeWhitespace(code);
	let highlightedCode = Prism.highlight(code, Prism.languages[language]);
	let template = `<pre class="language-${language}"><code class="language-${language}"></code></pre>`;
	let markup = angular.element(template);
	markup.find('code').html(highlightedCode);
	return markup;
}
