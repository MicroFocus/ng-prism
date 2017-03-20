import { module } from 'angular';
import RepeatAsCode from './repeat-as-code.component';

module('ng-prism', [])
	.directive('repeatAsCode', RepeatAsCode);
