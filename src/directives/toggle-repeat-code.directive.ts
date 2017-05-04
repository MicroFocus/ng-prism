/*
 * Dynamically creates a code block that matches the element
 * Shows/hides the code block per user input
 */

import {element, IAttributes, IAugmentedJQuery, ICompileService, IScope} from 'angular';
import {IRepeatAsCodeService} from '../services/repeat-as-code.service';

export default ['RepeatAsCodeService', ToggleRepeatDirective];

export function ToggleRepeatDirective(RepeatAsCodeService: IRepeatAsCodeService) {
    return {
        priority: 1000,
        restrict: 'A',
        compile: (tElement: IAugmentedJQuery, tAttrs: IAttributes) => {
            tElement.removeAttr('toggle-repeat-code');
            let code = RepeatAsCodeService(tElement, tAttrs.toggleRepeatCode);
            let toggleableCode = element(`<toggleable-code></toggleable-code>`).append(code);
            tElement.after(toggleableCode);
        }
    };
}
