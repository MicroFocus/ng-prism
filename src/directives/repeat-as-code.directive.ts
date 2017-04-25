import { IAttributes, IAugmentedJQuery } from 'angular';
import {IRepeatAsCodeService} from '../services/repeat-as-code.service';

export default ['RepeatAsCodeService',
    (RepeatAsCodeService: IRepeatAsCodeService) => {
        return {
            priority: 1000,
            restrict: 'A',
            compile: (element: IAugmentedJQuery, attr: IAttributes) => {
                element.removeAttr('repeat-as-code');
                let code = RepeatAsCodeService(element, attr.repeatAsCode);
                element.after(code);
            }
        };
    }
];
