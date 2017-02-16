import { bootstrap, module } from 'angular';
import routes from './config/routes';
import uiRouter from 'angular-ui-router';
import ApplicationComponent from './components/application/application.component';
import DashboardComponent from './components/dashboard/dashboard.component';


module('app', [
    uiRouter
])
    .config(routes)
    .component('applicationComponent', ApplicationComponent)
    .component('dashboardComponent', DashboardComponent);

bootstrap(document, ['app']);
