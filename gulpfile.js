var gulp = require('gulp');
var ngGulp = require('ng-gulp');

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
			'node_modules/mf-icons/dist/**/*',
            'src/styles/app.css',
            '!node_modules/mf-icons/dist/mf-icons.min.css'
		],
        vendorProduction: [
            'node_modules/angular/angular.js',
            'node_modules/mf-icons/dist/**/*',
            'src/styles/app.css',
            '!node_modules/mf-icons/dist/mf-icons.min.css'
		],
        vendorTest: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js'
		]
    },
    jsBasename: "ng-prism",
    vendorCssBasename: "app"
});
