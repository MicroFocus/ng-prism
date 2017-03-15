import { IScope, IAugmentedJQuery } from 'angular';
import highlight from './highlight';

export default [
	() => {
		return {
			restrict: 'A',
			link: (scope: IScope, element: IAugmentedJQuery) => {
				let code = element[0].innerHTML;
				let highlightedCode = highlight(code, 'markup');
				element.append(highlightedCode);
			}
		};
	}
];
