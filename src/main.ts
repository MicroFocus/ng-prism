import { module } from 'angular';
import Highlight from './directives/highlight.directive';
import InsertElementService from './services/insert-element.service';
import RepeatAsCode from './directives/repeat-as-code.directive';
import RepeatAsCodeService from './services/repeat-as-code.service';
import ToggleableCode from './directives/toggleable-code.directive';
import ToggleRepeatCode from './directives/toggle-repeat-code.directive';

module('ng-prism', [])
    .directive('highlight', Highlight)
    .directive('repeatAsCode', RepeatAsCode)
    .directive('toggleableCode', ToggleableCode)
    .directive('toggleRepeatCode', ToggleRepeatCode)

    .factory('InsertElementService', InsertElementService)
    .factory('RepeatAsCodeService', RepeatAsCodeService);
