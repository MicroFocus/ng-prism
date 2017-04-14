import { IAttributes, IAugmentedJQuery } from 'angular';

export default ['RepeatAsCodeService',
    (RepeatAsCodeService) => {
        return {
            priority: 1000,
            restrict: 'A',
            compile: (element: IAugmentedJQuery, attr: IAttributes) => {
                element.removeAttr('repeat-as-code');
                RepeatAsCodeService(element, attr.repeatAsCode);
            }
        };
    }
];
