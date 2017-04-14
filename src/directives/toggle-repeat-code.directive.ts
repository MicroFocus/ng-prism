import { element, IAttributes, IAugmentedJQuery } from 'angular';

export default ['RepeatAsCodeService',
    (RepeatAsCodeService) => {
        return {
            priority: 1000,
            restrict: 'A',
            compile: (tElement: IAugmentedJQuery, attr: IAttributes) => {
                tElement.removeAttr('toggle-repeat-code');
                RepeatAsCodeService(tElement, attr.toggleRepeatCode);
                let showHide = element(`<toggle-show></toggle-show>`);
                tElement.after(showHide[0]);
            }
        };
    }
];
