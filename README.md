# ng-prism

### Installation

- `npm install joswhite/ng-prism`
- `angular.module('myApp', ['ng-prism']);`
- `<script src="ng-prism.js">`<br>
  `<link rel="stylesheet" href="ng-prism.css">`

### Use

- See examples in index.html

- `pre > code[highlight]` (highlights code inside it)

    * `highlight` attribute specifies PrismJS language (default: Javascript)
    * HTML markup needs to be escaped

- PrismJS direct use (just like https://prismjs.com)

- `repeat-as-code` attribute (retains HTML element and highlights the code that created it)

    * `repeat-as-code="inner"` highlights the code that created its HTML children elements
    
- `toggle-repeat-code` attribute (`repeat-as-code` with a "Show Code" button)
    
- `toggleable-code` element ("Show Code" button for any code block)

   * child should be any element that produces a code block 
    
### Development

Run `gulp` and navigate to localhost:8080. 

### Notes

- ng-prism converts 4 spaces to the tab character and forces LTR display on the code block
- This project uses [jedwardhawkins/ng-gulp](https://www.github.com/jedwardhawkins/ng-gulp)
- The consuming application is responsible for styling the "Show Code" button