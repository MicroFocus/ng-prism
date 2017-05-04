/*
 * Dynamically inserts a code block containing the code that created this element
 * Includes a Show/Hide Code button
 */

import {IAttributes, IAugmentedJQuery} from 'angular';
import {IRepeatAsCodeService} from '../services/repeat-as-code.service';
import {IInsertElementService} from '../services/insert-element.service';

export default ['InsertElementService', 'RepeatAsCodeService', ToggleRepeatDirective];

export function ToggleRepeatDirective(InsertElementService: IInsertElementService,
                                      RepeatAsCodeService: IRepeatAsCodeService) {
    return {
        priority: 1000,
        restrict: 'A',
        compile: (element: IAugmentedJQuery, attr: IAttributes) => {
            element.removeAttr('toggle-repeat-code');
            element.removeAttr('prism-insert-id');
            let code = RepeatAsCodeService(element, attr.toggleRepeatCode);
            InsertElementService(code, element, 'toggleable-code', attr);
        }
    };
}
