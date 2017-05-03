# ng-prism

### Installation

- `npm install joswhite/ng-prism`
- `angular.module('myApp', ['ng-prism']);`
- `<script src="ng-prism.js">`<br>
  `<link rel="stylesheet" href="ng-prism.css">`

### Use

- See examples in index.html

- `highlight` attribute (highlights code)

    * attribute specifies PrismJS language (default: Javascript)
    * markup needs to be escaped

- PrismJS direct use (just like https://prismjs.com)

- `repeat-as-code` attribute (highlights code for its HTML element)

    * `repeat-as-code="inner"` highlights code for its child element
    
- `toggle-repeat-code` attribute (`repeat-as-code` with a "Show Code" button)
    
- `toggleable-code` element ("Show Code" button for any code block)

   * child should be any element that produces a code block 
    
### Development

Run `gulp` and navigate to localhost:8080. 

### Notes

- ng-prism converts 4 spaces to the tab character and forces LTR display on the code block
- HTML markup needs to be escaped, unless you are using the `repeat-as-code` directive
- This project uses [jedwardhawkins/ng-gulp](https://www.github.com/jedwardhawkins/ng-gulp).