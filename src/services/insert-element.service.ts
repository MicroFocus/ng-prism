/*
 * Service that inserts an element into the DOM via its 'insert' method:
 * - If attr.prismInsertId is specified, inserts it as the first child of the id
 * - Otherwise, inserts it after defaultPrevSibling
 */


import {IAttributes, IAugmentedJQuery} from 'angular';

export interface IInsertElementService {
    insert(element: IAugmentedJQuery, defaultPrevSibling: IAugmentedJQuery, attr: IAttributes): void;
    removeAttributes(element: IAugmentedJQuery): void;
}

export default class InsertElementService implements IInsertElementService {
    removeAttributes(element: IAugmentedJQuery) {
        element.removeAttr('prism-insert-id');
    }

    insert(element: IAugmentedJQuery, defaultPrevSibling: IAugmentedJQuery, attr: IAttributes): void {
        if (attr.prismInsertId) {
            let parentElement = document.getElementById(attr.prismInsertId);
            parentElement.insertBefore(element[0], parentElement.firstElementChild);
        }
        else {
            defaultPrevSibling.after(element);
        }
    };
}


