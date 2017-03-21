import { IAugmentedJQuery } from 'angular';
import { highlight, normalizeOuterHTML } from './highlight';

export default [
	() => {
		return {
			priority: 1000,
			restrict: 'A',
			compile: (element: IAugmentedJQuery) => {
				element[0].removeAttribute('repeat-as-code');
				let code = normalizeOuterHTML(element[0].outerHTML);
				let highlightedCode = highlight(code, 'markup');
				element.after(highlightedCode);
			}
		};
	}
];
