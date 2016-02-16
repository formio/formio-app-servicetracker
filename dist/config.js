var APP_URL = 'https://yourapp.form.io';
var API_URL = 'https://api.form.io';

// Parse query string
var query = {};
location.search.substr(1).split("&").forEach(function(item) {
  query[item.split("=")[0]] = item.split("=")[1] && decodeURIComponent(item.split("=")[1]);
});

angular.module('formioServiceTrackerApp').constant('AppConfig', {
  appUrl: query.appUrl || APP_URL,
  apiUrl: query.apiUrl || API_URL,
  company: query.company || 'Service Tracker',
  icon: query.icon || '/assets/images/logo.png',
  dealerLoginForm: APP_URL + '/dealer/login',
  adminLoginForm: APP_URL + '/admin/login',
  contractorLoginForm: APP_URL + '/contractor/login',
  contractorForm: APP_URL + '/contractor',
  timeclockForm: APP_URL + '/contractor/timeclock',
  customerForm: APP_URL + '/customer',
  equipmentForm: APP_URL + '/customer/equipment',
  dealerForm: APP_URL + '/dealer',
  appointmentForm: APP_URL + '/appointment',
  serviceForm: APP_URL + '/appointment/service',
  forms: [
    {
      title: 'Agreement',
      name: 'agreement',
      form: APP_URL + '/agreement'
    },
    {
      title: 'Survey',
      name: 'survey',
      form: APP_URL + '/survey'
    }
  ]
});
