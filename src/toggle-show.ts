import {element, IAugmentedJQuery} from 'angular';

const TOOLBAR_HTML =
`
<div class="toolbar">
    <div class="toolbar-item">
        <span>
            <i class="mf-icon mf-icon-close_thick"></i>
        </span>
    </div>
</div>
`;

export function addToolbar(codeBlock: IAugmentedJQuery) {

    let toolbar =

    codeBlock.addClass('code-toolbar');
    codeBlock.append(toolbar);
    codeBlock.after()
}

function createCloseElement(): IAugmentedJQuery {
    let closeElement = element(TOOLBAR_HTML);
    toolbar.find('span').on('click', () => {
        preBlock.addClass('prism-hidden');
        showCode.removeClass('prism-hidden');
    });

    return closeElement;
}

function createShowCodeElement(): IAugmentedJQuery {

}
