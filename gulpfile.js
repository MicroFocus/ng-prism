var gulp = require('gulp');
var ngGulp = require('ng-gulp');

ngGulp(gulp, {
    externals: {
        'angular-ui-router': 'window["angular-ui-router"]'
    },
    files: {
        vendorDevelopment: [
            'node_modules/angular/angular.js',
            'vendor/**/*'
        ],
        vendorProduction: [
            'vendor/**/*'
        ]
    }
});
