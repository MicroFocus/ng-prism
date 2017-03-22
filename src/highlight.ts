import { element, IAugmentedJQuery } from 'angular';
let Prism = require('prismjs');

require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');	// Anonymous function to load plugin
let whitespacePlugin = Prism.plugins.NormalizeWhitespace;					// Public-facing plugin object

whitespacePlugin.setDefaults({
	'tabs-to-spaces': 4
});

// Determine length of whitespace at beginning of string
function getWhitespaceLength(line: string): number {
	let matches = line.match(/^\s+/);
	if (matches) {
		return matches[0].length;
	}
	else {
		return 0;
	}
}

// Indent first line of an element's outerHTML since the DOM strips off its indentation
export function normalizeOuterHTML(code: string): string {
	let lines = code.split('\n');
	let lastLine = lines[lines.length - 1];
	let lastLineIndent = getWhitespaceLength(lastLine);	// Indent it identical to the last line
	lines[0] = lastLine.substr(0, lastLineIndent).concat(lines[0]);
	code = lines.join('\n');
	return code;
}

// Highlight code in the specified PrismJS language
export function highlight(code: string, language: string): IAugmentedJQuery {
	code = whitespacePlugin.normalize(code);
	let highlightedCode = Prism.highlight(code, Prism.languages[language]);
	let template = `<pre class="language-${language}"><code class="language-${language}"></code></pre>`;
	let markup = element(template);
	markup.find('code').html(highlightedCode);
	return markup;
}
