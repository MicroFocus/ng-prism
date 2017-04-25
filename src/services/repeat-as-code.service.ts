import {IAugmentedJQuery} from 'angular';
import { highlight, normalizeOuterHTML } from '../highlight';

export default RepeatAsCodeService;

export interface IRepeatAsCodeService {
    (element: IAugmentedJQuery, type: string): IAugmentedJQuery;
}

function RepeatAsCodeService() {
    return (element: IAugmentedJQuery, type: string): IAugmentedJQuery => {
        let code = null;
        if (type === 'inner') {
            code = element[0].innerHTML;
        }
        else {
            code = normalizeOuterHTML(element[0].outerHTML);
        }
        let highlightedCode = highlight(code, 'markup');

        return highlightedCode;
    };
}
