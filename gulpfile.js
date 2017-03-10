var gulp = require('gulp');
var ngGulp = require('ng-gulp');

ngGulp(gulp, {
    devServerPort: 8081,
    externals: {
        'angular-ui-router': 'window["angular-ui-router"]'
    },
    files: {
        vendorDevelopment: [
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js'
        ],
        vendorProduction: [
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js'
        ]
    }
});
