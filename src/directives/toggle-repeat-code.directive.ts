/*
 * Dynamically creates a code block that matches the element
 * Shows/hides the code block per user input
 */

import {element, IAttributes, IAugmentedJQuery, ICompileService, IScope} from 'angular';
import {IRepeatAsCodeService} from '../services/repeat-as-code.service';

export default ['RepeatAsCodeService', '$compile', ToggleRepeatDirective];

export function ToggleRepeatDirective(RepeatAsCodeService: IRepeatAsCodeService, $compile: ICompileService) {
    return {
        priority: 1000,
        restrict: 'A',
        compile: (tElement: IAugmentedJQuery, tAttrs: IAttributes) => {
            // Create toggleable code block
            tElement.removeAttr('toggle-repeat-code');
            let code = RepeatAsCodeService(tElement, tAttrs.toggleRepeatCode);
            let toggleableCode = element(`<toggleable-code></toggleable-code>`).append(code);
            let linkFn = $compile(toggleableCode);

            // Compile the code block
            return (scope: IScope, iElement: IAugmentedJQuery) => {
                let content = linkFn(scope);
                iElement.after(content);
            };
        }
    };
}
