/*
 * Inserts a code block inside the given element; or, if an id is spec
 */
import {element as ngElement, IAttributes, IAugmentedJQuery} from 'angular';

export default InsertElementService;

export interface IInsertElementService {
    (element: IAugmentedJQuery,
     defaultPrevSibling: IAugmentedJQuery,
     defaultTagName: string,
     attrs: IAttributes): void;
}

function InsertElementService(): IInsertElementService {
    return (element: IAugmentedJQuery,
            defaultPrevSibling: IAugmentedJQuery,
            defaultTagName: string,
            attrs: IAttributes): void => {
        if (attrs.prismInsertId) {
            let parentElement = document.getElementById(attrs.prismInsertId);
            parentElement.insertBefore(element[0], parentElement.firstElementChild);
        }
        else {
            let parentElement = ngElement(`<${defaultTagName}></${defaultTagName}>`).append(element);
            defaultPrevSibling.after(parentElement);
        }
    };
}


