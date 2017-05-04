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
        compile: (tElement: IAugmentedJQuery, tAttrs: IAttributes) => {
            tElement.removeAttr('toggle-repeat-code');
            tElement.removeAttr('toggleable-code-id');
            let code = RepeatAsCodeService(tElement, tAttrs.toggleRepeatCode);

            if (tAttrs.toggleableCodeId) {
                let toggleableCode = document.getElementById(tAttrs.toggleableCodeId);
                toggleableCode.insertBefore(code[0], toggleableCode.firstElementChild);
            }
            else {
                let toggleableCode = element(`<toggleable-code></toggleable-code>`).append(code);
                tElement.after(toggleableCode);
            }
        }
    };
}
