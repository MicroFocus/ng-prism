import { Component } from '../../component.decorator';

@Component({
    templateUrl: require('./dashboard.component.html')
})
export default class DashboardComponent {
    data: any[] = [
        {
            imageUrl: 'images/request_access.png',
            title: 'Request Access',
            description: 'Request permissions and other resources'
        },
        {
            imageUrl: 'images/dashboard.png',
            title: 'Dashboard',
            description: 'Navigate to IDM Dashboard'
        },
        {
            imageUrl: 'images/my_approvals.png',
            title: 'My Approvals',
            description: 'View my 1 Identity Manager approval tasks'
        },
        {
            imageUrl: 'images/my_request_history.png',
            title: 'My Request History',
            description: 'View my request history'
        },
        {
            imageUrl: 'images/my_access.png',
            title: 'My Access',
            description: 'View my access permissions'
        },
        {
            imageUrl: 'images/my_profile.png',
            title: 'My Profile',
            description: 'Update personal information'
        },
        {
            imageUrl: 'images/change_my_password.png',
            title: 'Change My Password',
            description: 'Create a new password'
        },
        {
            imageUrl: 'images/search.png',
            title: 'Search',
            description: 'Search for people and groups'
        },
        {
            imageUrl: 'images/org_chart.png',
            title: 'Org Chart',
            description: 'Explore the organization'
        },
        {
            imageUrl: 'images/manage_teams.png',
            title: 'Manage Teams',
            description: 'Create, update and delete teams in your Identity Manager system'
        },
        {
            imageUrl: 'images/assign_roles.png',
            title: 'Assign Roles',
            description: 'Create and assign roles'
        },
        {
            imageUrl: 'images/assign_resources.png',
            title: 'Assign Resources',
            description: 'Create and assign resources'
        },
        {
            imageUrl: 'images/create_users_and_groups.png',
            title: 'Create Users and Groups',
            description: 'Create users or groups in your Identity Manager system'
        },
        {
            imageUrl: 'images/manage_roles.png',
            title: 'Manage Roles',
            description: 'Create roles and map them to resources or other roles'
        },
        {
            imageUrl: 'images/manage_resources.png',
            title: 'Manage Resources',
            description: 'Create resources and map them to entitlements.'
        },
        {
            imageUrl: 'images/navigation_and_access.png',
            title: 'Navigation and Access',
            description: 'Manage access to User Application administration'
        },
        {
            imageUrl: 'images/identity_reporting.png',
            title: 'Identity Reporting',
            description: 'Create, schedule and view identity reports'
        }
    ];

    static $inject = [];
    constructor() {}
}
