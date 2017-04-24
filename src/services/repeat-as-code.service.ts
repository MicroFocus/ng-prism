import {IAugmentedJQuery} from 'angular';
import { highlight, normalizeOuterHTML } from '../highlight';

export default RepeatAsCodeService;

function RepeatAsCodeService() {
    return (element: IAugmentedJQuery, type: string) => {
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
