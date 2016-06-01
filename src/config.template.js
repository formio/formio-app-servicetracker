var appUrl = '{{ protocol }}://{{ path }}.{{ host }}';
var apiUrl = '{{ protocol }}://api.{{ host }}';
angular.module('serviceTracker').constant('AppConfig', {
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
  company: 'Acme Inc.',
});
