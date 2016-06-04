{% if domain %}
var APP_URL = '{{ domain }}';
var API_URL = '{{ domain }}';
{% else %}
var APP_URL = '{{ protocol }}://{{ path }}.{{ host }}';
var API_URL = '{{ protocol }}://api.{{ host }}';
{% endif %}

// Parse query string
var query = {};
location.search.substr(1).split("&").forEach(function(item) {
  query[item.split("=")[0]] = item.split("=")[1] && decodeURIComponent(item.split("=")[1]);
});

var appUrl = query.appUrl || APP_URL;
var apiUrl = query.apiUrl || API_URL;
angular.module('servicetracker').constant('AppConfig', {
  appUrl: appUrl,
  apiUrl: apiUrl,
  company: query.company || 'Service Tracker',
  icon: query.icon || 'assets/images/logo.png',
  forms: {
    userForm: appUrl + '/user',
    userLoginForm: appUrl + '/user/login',
    appointmentForm: appUrl + '/appointment'
  },
  roles: [
    'Contractor',
    'Dealer'
  ],
  resources: {
    dealer: {
      form: appUrl + '/dealer',
      resource: 'DealerResource'
    },
    customer: {
      form: appUrl + '/customer',
      resource: 'CustomerResource'
    },
    contractor: {
      form: appUrl + '/contractor',
      resource: 'ContractorResource'
    },
    appointment: {
      form: appUrl + '/appointment',
      resource: 'AppointmentResource'
    },
    timeclock: {
      form: appUrl + '/timeclock',
      resource: 'TimeClockResource'
    },
    equipment: {
      form: appUrl + '/equipment',
      resource: 'EquipmentResource'
    },
    service: {
      form: appUrl + '/service',
      resource: 'ServiceResource'
    }
  }
});
