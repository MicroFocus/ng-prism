import { module } from 'angular';
import Highlight from './directives/highlight.directive';
import RepeatAsCode from './directives/repeat-as-code.directive';
import RepeatAsCodeService from './services/repeat-as-code.service';
import ToggleableCode from './directives/toggleable-code.directive';
import ToggleRepeatCode from './directives/toggle-repeat-code.directive';
import ToggleShowComponent from './components/toggle-show.component';

module('ng-prism', [])
    .component('toggleShow', ToggleShowComponent)

    .directive('highlight', Highlight)
    .directive('repeatAsCode', RepeatAsCode)
    .directive('toggleableCode', ToggleableCode)
    .directive('toggleRepeatCode', ToggleRepeatCode)

    .factory('RepeatAsCodeService', RepeatAsCodeService);
