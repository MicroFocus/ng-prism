import { module } from 'angular';
import RepeatAsCode from './repeat-as-code.directive';
import Highlight from './highlight.directive';

module('ng-prism', [])
	.directive('repeatAsCode', RepeatAsCode)
	.directive('highlight', Highlight);
