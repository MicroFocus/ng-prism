# ng-prism

### Installation

- `npm install joswhite/ng-prism`
- `angular.module('myApp', ['ng-prism']);`
- `<script src="ng-prism.js">`
  `<link rel="stylesheet" href="vendor.css">`  ***fix***

### Use

- Use Prism directly - http://prismjs.com (the example below highlights Javascript code)<br>
  `<pre><code class="language-javascript">...</code></pre>`
  
- `repeat-as-code` directive - repeats HTML as highlighted code immediately after tag:<br>
  `<tag repeat-as-code>...</tag>` becomes HTML &lt;tag&gt;...&lt;/tag&gt; followed by code `<tag>...</tag>` 
    
### Development

Run `gulp` and navigate to localhost:8080. 

### Notes

- These Angular directives convert 4 spaces to the tab character and trim common leading whitespace.
 Using Prism directly does not do this.
- This project uses [jedwardhawkins/ng-gulp](https://www.github.com/jedwardhawkins/ng-gulp).