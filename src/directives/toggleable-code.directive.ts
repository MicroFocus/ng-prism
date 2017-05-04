/*
 * Toggles show/hide of the code block inside it
 */

let templateUrl = require('./toggleable-code.directive.html');

import {IAttributes, IAugmentedJQuery, IScope} from 'angular';

export interface IToggleableCodeController {
    code: HTMLElement;
    codeWrapper: HTMLElement;
}

export class ToggleableCodeController implements IToggleableCodeController {
    code: HTMLElement;
    codeWrapper: HTMLElement;
    visible: boolean;

    constructor() {
        this.visible = false;
    }

    toggleCode() {
        if (this.visible) {
            this.hide();
        }
        else {
            this.show();
        }
    }

    show() {
        this.codeWrapper.style.height = this.code.offsetHeight + 'px';
        this.visible = true;
    }

    hide() {
        this.codeWrapper.style.height = '0';
        this.visible = false;
    }
}

export default [ToggleableCodeDirective];

export function ToggleableCodeDirective() {
    return {
        controller: ToggleableCodeController,
        controllerAs: '$ctrl',
        restrict: 'E',
        scope: {},
        templateUrl: templateUrl,
        transclude: true,
        link: function(scope: IScope,
                       iElement: IAugmentedJQuery,
                       iAttrs: IAttributes,
                       controller: IToggleableCodeController) {
            let children = iElement.children();

            for (let childIndex = 0; childIndex < children.length; childIndex++) {
                let child = children[childIndex];
                if (child.className.indexOf('prism-toggleable-code') !== -1) {
                    controller.codeWrapper = child;
                    controller.code = <HTMLElement>(child.firstElementChild);
                }
            }
        }
    };
}
