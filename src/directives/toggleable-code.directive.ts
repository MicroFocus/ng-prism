/*
 * Toggles show/hide of the code block inside it
 */

let templateUrl = require('./toggleable-code.directive.html');

import {IAttributes, IAugmentedJQuery, IScope} from 'angular';

export class ToggleableCodeController {
    code: HTMLElement;
    codeWrapper: HTMLElement;
    visible: boolean;

    static $inject = ['$scope', '$element'];

    constructor(private $scope: IScope, private $element: IAugmentedJQuery) {
        this.visible = false;
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
        link: function(scope: IScope, iElement: IAugmentedJQuery, iAttrs: IAttributes, controller) {
            controller.code = iElement.find('pre')[0];
            controller.codeWrapper = iElement.find('div')[0];
        }
    };
}
