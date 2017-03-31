import { IAttributes, IAugmentedJQuery } from 'angular';
let Prism = require('prismjs');

export default [
	() => {
		return {
			priority: 1000,
			restrict: 'A',
			compile: (element: IAugmentedJQuery, attr: IAttributes) => {
				element.removeAttr('highlight');
				element.parent().attr('dir', 'ltr');
				let language = attr.highlight || 'javascript';
				element.addClass(`language-${language}`);
				Prism.highlightElement(element[0]);
			}
		};
	}
];
