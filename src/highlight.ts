import {element, IAugmentedJQuery} from 'angular';
import * as Prism from 'prismjs';

require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');	// Anonymous functions to load plugins
require('prismjs/plugins/toolbar/prism-toolbar');
let whitespacePlugin = Prism.plugins.NormalizeWhitespace;					// Public-facing plugin objects
let toolbarPlugin = Prism.plugins.toolbar;

whitespacePlugin.setDefaults({
    'tabs-to-spaces': 4
});

// Provide interface to show and hide code blocks, except if <code> has attribute data-toolbar="none"
toolbarPlugin.registerButton('button', (env) => {
    let codeBlock = element(env.element);
    let toolbarOverride = codeBlock.attr('data-toolbar');
    if (toolbarOverride === 'none') {
        return null;
    }

    let preBlock = codeBlock.parent();
    let showCode = element(`<div class="prism-show-code" dir="ltr"><button type="button">Show Code</button></div>`);
    showCode.on('click', () => {
        showCode.addClass('prism-hidden');
        preBlock.removeClass('prism-hidden');
    });

    preBlock.after(showCode);
    preBlock.addClass('prism-hidden');
    // env.element.hasAttribute('disabled') , .getAttribute() (sequence to avoid exception)

    let html = `<span><i class="mf-icon mf-icon-close_thick"></i></span>`;
    let button = element(html);
    button.on('click', () => {
        preBlock.addClass('prism-hidden');
        showCode.removeClass('prism-hidden');
    });

    return button[0];
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
    let template = `<pre class="language-${language}" dir="ltr">
						<code class="language-${language}"></code>
					</pre>`;
    let markup = element(template);
    markup.find('code').html(highlightedCode);
    return markup;
}
