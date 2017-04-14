import { module } from 'angular';
import Highlight from './directives/highlight.directive';
import RepeatAsCode from './directives/repeat-as-code.directive';
import RepeatAsCodeService from './services/repeat-as-code.service';
import ToggleShow from './directives/toggle-show.directive';
import ToggleRepeatCode from './directives/toggle-repeat-code.directive';

module('ng-prism', [])
    .directive('highlight', Highlight)
    .directive('repeatAsCode', RepeatAsCode)
    .directive('toggleShow', ToggleShow)
    .directive('toggleRepeatCode', ToggleRepeatCode)

    .factory('RepeatAsCodeService', RepeatAsCodeService);
