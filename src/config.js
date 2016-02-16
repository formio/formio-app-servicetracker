var APP_URL = 'https://yourapp.form.io';
var API_URL = 'https://api.form.io';

// Parse query string
var query = {};
location.search.substr(1).split("&").forEach(function(item) {
  query[item.split("=")[0]] = item.split("=")[1] && decodeURIComponent(item.split("=")[1]);
});

var appUrl = query.appUrl || APP_URL;
var apiUrl = query.apiUrl || API_URL;

angular.module('formioServiceTrackerApp').constant('AppConfig', {
  appUrl: appUrl,
  apiUrl: query.apiUrl || API_URL,
  company: query.company || 'Service Tracker',
  icon: query.icon || '/assets/images/logo.png',
  dealerLoginForm: appUrl + '/dealer/login',
  adminLoginForm: appUrl + '/admin/login',
  contractorLoginForm: appUrl + '/contractor/login',
  contractorForm: appUrl + '/contractor',
  timeclockForm: appUrl + '/contractor/timeclock',
  customerForm: appUrl + '/customer',
  equipmentForm: appUrl + '/customer/equipment',
  dealerForm: appUrl + '/dealer',
  appointmentForm: appUrl + '/appointment',
  serviceForm: appUrl + '/appointment/service',
  forms: [
    {
      title: 'Agreement',
      name: 'agreement',
      form: appUrl + '/agreement'
    },
    {
      title: 'Survey',
      name: 'survey',
      form: appUrl + '/survey'
    }
  ]
});
