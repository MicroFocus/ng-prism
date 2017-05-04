/*
 * Dynamically inserts a code block containing the code that created this element
 */

import { IAttributes, IAugmentedJQuery } from 'angular';
import {IInsertElementService} from '../services/insert-element.service';
import {IRepeatAsCodeService} from '../services/repeat-as-code.service';

export default ['InsertElementService', 'RepeatAsCodeService',
    (InsertElementService: IInsertElementService,
     RepeatAsCodeService: IRepeatAsCodeService) => {
        return {
            priority: 1000,
            restrict: 'A',
            compile: (element: IAugmentedJQuery, attr: IAttributes) => {
                element.removeAttr('repeat-as-code');
                let code = RepeatAsCodeService(element, attr.repeatAsCode);
                InsertElementService(code, element, attr);
            }
        };
    }
];
