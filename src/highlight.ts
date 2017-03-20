import { IAugmentedJQuery } from 'angular';
let Prism = require('prismjs');

function isBlankLine(line: string): boolean {
	if (line.match(/^\s*$/)) {
		return true;
	} else {
		return false;
	}
}
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

	// Remove common leading whitespace, excluding first line (which has none)
	let lines = code.split('\n');
	let firstLine = lines[0];
	let otherLines = lines.slice(1);
	let commonWhitespaceLength = -1;
	let whitespaceLength = 0;

	otherLines.forEach((line: string) => {
		if (!isBlankLine(line)) {
			whitespaceLength = getWhitespaceLength(line);
			if (commonWhitespaceLength === -1 || whitespaceLength < commonWhitespaceLength) {
				commonWhitespaceLength = whitespaceLength;
			}
		}
	});

	if (commonWhitespaceLength > 0) {
		otherLines = otherLines.map((line: string) => {
			return line.slice(commonWhitespaceLength);
		});
		lines = [ firstLine ].concat(otherLines);
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
