import { element, IAttributes, IAugmentedJQuery } from 'angular';
let templateUrl = require('../templates/show-code.template.html');

const HIDE_CODE =
`
<div class="code-toolbar">
    <div class="toolbar">
        <div class="toolbar-item">
            <span>
                <i class="mf-icon mf-icon-close_thick"></i>
            </span>
        </div>
    </div>
</div>
`;

export default [
    () => {
        return {
            restrict: 'E',
            templateUrl: templateUrl,
            compile: (tElement: IAugmentedJQuery, attr: IAttributes) => {
                let codeBlock = tElement.next();
                if (codeBlock.prop('tagName') === 'PRE') {
                    tElement.after(element(HIDE_CODE));
                    /*let hideCode = element('<div>Hide Code</div>')[0];
                    tElement.after(hideCode);*/
                    //codeBlock.appendChild(hideCode);
                }
                else {
                    throw new Error('Toggle/Show directive expected code block, but found: ' + codeBlock);
                }
            }
        };
    }
];
