/*
 * Toggles show/hide of the code block inside it
 */

import { Component } from '../component.decorator';
import {IAugmentedJQuery, IScope} from 'angular';

@Component({
    templateUrl: require('./toggleable-code.component.html'),
    transclude: true
})
export default class ToggleableCodeController {
    code: HTMLElement;
    codeWrapper: HTMLElement;
    visible: boolean;

    static $inject = ['$scope', '$element'];
    constructor(private $scope: IScope, private $element: IAugmentedJQuery) {
        this.visible = false;
    }

    $onInit(): void {
        this.codeWrapper = this.$element.find('.prism-toggleable-code')[0];
        this.code = this.$element.find('pre')[0];
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
