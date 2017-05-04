/*
 * Dynamically inserts a code block containing the code that created this element
 * Includes a Show/Hide Code button
 */

import {element, IAttributes, IAugmentedJQuery} from 'angular';
import {IRepeatAsCodeService} from '../services/repeat-as-code.service';

export default ['RepeatAsCodeService', ToggleRepeatDirective];

export function ToggleRepeatDirective(RepeatAsCodeService: IRepeatAsCodeService) {
    return {
        priority: 1000,
        restrict: 'A',
        compile: (tElement: IAugmentedJQuery, attr: IAttributes) => {
            tElement.removeAttr('toggle-repeat-code');
            let code = RepeatAsCodeService(tElement, attr.toggleRepeatCode);
            let toggleableCode = element(`<toggleable-code></toggleable-code>`).append(code);
            tElement.after(toggleableCode);
        }
    };
}
