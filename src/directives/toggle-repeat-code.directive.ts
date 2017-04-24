import {element, IAttributes, IAugmentedJQuery, IScope} from 'angular';

export class ToggleRepeatCodeController {
    visible: boolean;

    static $inject = ['$scope'];
    constructor(private $scope: IScope) {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}

export default ['RepeatAsCodeService',
    (RepeatAsCodeService) => {
        return {
            controller: ToggleRepeatCodeController,
            controllerAs: '$ctrl',
            priority: 1000,
            restrict: 'A',
            compile: (tElement: IAugmentedJQuery, attr: IAttributes) => {
                tElement.removeAttr('toggle-repeat-code');
                let code = RepeatAsCodeService(tElement, attr.toggleRepeatCode);
                code.attr('ng-show', '$ctrl.visible');
                let toggleShow = element(`<toggle-show on-hide="$ctrl.hide()" on-show="$ctrl.show()"></toggle-show>`);
                let parent = element(`<div></div>`);
                parent.append(toggleShow);
                parent.append(code);
                tElement.after(parent);
            }
        };
    }
];
