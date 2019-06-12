var gulp = require('gulp');
var ngGulp = require('@microfocus/ng-gulp');

ngGulp(gulp, {
    cssBasename: "ng-prism",
	devServerPort: 8082,
	directories: {
		outputVendor: "dist"
	},
    externals: {
    },
    files: {
        vendorDevelopment: [
            'node_modules/angular/angular.js',
            'src/styles/app.css'
		],
        vendorProduction: [
            'node_modules/angular/angular.js',
            'src/styles/app.css'
		],
        vendorTest: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js'
		]
    },
    jsBasename: "ng-prism",
    vendorCssBasename: "app"
});
