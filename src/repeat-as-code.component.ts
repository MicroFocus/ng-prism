import { IAttributes, IAugmentedJQuery } from 'angular';
import { highlight, normalizeOuterHTML } from './highlight';

export default [
	() => {
		return {
			priority: 1000,
			restrict: 'A',
			compile: (element: IAugmentedJQuery, attr: IAttributes) => {
				element[0].removeAttribute('repeat-as-code');
				let code = null;
				if (attr.repeatAsCode === 'inner') {
					code = element[0].innerHTML;
				}
				else {
					code = normalizeOuterHTML(element[0].outerHTML);
				}
				let highlightedCode = highlight(code, 'markup');
				element.after(highlightedCode);

			}
		};
	}
];
