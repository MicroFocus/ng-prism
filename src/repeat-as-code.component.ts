import { IScope, IAugmentedJQuery } from 'angular';
import highlight from './highlight';

export default [
	() => {
		return {
			restrict: 'A',
			link: (scope: IScope, element: IAugmentedJQuery) => {
				element[0].removeAttribute('repeat-as-code');
				let code = element[0].outerHTML;
				let highlightedCode = highlight(code, 'markup');
				element.after(highlightedCode);
			}
		};
	}
];
