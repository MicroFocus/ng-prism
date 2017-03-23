var gulp = require('gulp');
var ngGulp = require('ng-gulp');

ngGulp(gulp, {
	devServerPort: 8082,
	directories: {
		outputVendor: "dist"
	},
	vendorCssBasename: "ng-prism",
	jsBasename: "ng-prism",
    externals: {
    },
    files: {
        vendorDevelopment: [
            'node_modules/angular/angular.js',
			'node_modules/prismjs/themes/prism-okaidia.css'
		],
        vendorProduction: [
            'node_modules/angular/angular.js',
			'node_modules/prismjs/themes/prism-okaidia.css'
		],
        vendorTest: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js'
		]
    }
});
