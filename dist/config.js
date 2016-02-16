var appUrl = 'http://tpxemjrzfhrhqaz.localhost:3000';
var apiUrl = 'http://api.localhost:3000';
angular.module('formioServiceTrackerApp').constant('AppConfig', {
  appUrl: appUrl,
  apiUrl: apiUrl,
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
  company: 'Watsco',
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
