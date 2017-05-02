/*
 * Dynamically creates a code block that matches the element
 * Shows/hides the code block per user input
 */

import {element, IAttributes, IAugmentedJQuery, ICompileService, IScope} from 'angular';
import {IRepeatAsCodeService} from '../services/repeat-as-code.service';

export class ToggleRepeatCodeController {
    code: HTMLElement;
    codeWrapper: HTMLElement;

    show() {
        this.codeWrapper.style.height = this.code.offsetHeight + 'px';
    }

    hide() {
        this.codeWrapper.style.height = '0';
    }
}

export default ['RepeatAsCodeService', '$compile', ToggleRepeatDirective];

export function ToggleRepeatDirective(RepeatAsCodeService: IRepeatAsCodeService, $compile: ICompileService) {
    return {
        controller: ToggleRepeatCodeController,
        controllerAs: '$ctrl',
        priority: 1000,
        restrict: 'A',
        scope: {
            toggleRepeatCode: '@',
        },
        compile: (tElement: IAugmentedJQuery, tAttrs: IAttributes) => {
            // Highlight code
            tElement.removeAttr('toggle-repeat-code');
            let code = RepeatAsCodeService(tElement, tAttrs.toggleRepeatCode);
            let codeWrapper = element(`<div class="prism-toggleable-code"></div>`).append(code);

            // Create an element containing the code and a toggle-show directive
            let toggleShow = element(`<toggle-show on-hide="$ctrl.hide()" on-show="$ctrl.show()"></toggle-show>`);
            let parent = element(`<div></div>`);
            parent.append(toggleShow);
            parent.append(codeWrapper);
            let linkFn = $compile(parent, null, 100);

            // Bind the directive to this controller
            return (scope: IScope, iElement: IAugmentedJQuery, iAttrs: IAttributes, controller) => {
                controller.code = code[0];
                controller.codeWrapper = codeWrapper[0];
                let content = linkFn(scope);
                iElement.after(content);
            };
        }
    };
}
