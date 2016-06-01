(function() {
  /* global _, navigator, console */
  'use strict';
  angular
    .module('serviceTracker')
    .config([
      'FormioProvider',
      'FormioAuthProvider',
      'FormioResourceProvider',
      'FormioFormsProvider',
      '$stateProvider',
      '$urlRouterProvider',
      'AppConfig',
      '$injector',
      function(
        FormioProvider,
        FormioAuthProvider,
        FormioResourceProvider,
        FormioFormsProvider,
        $stateProvider,
        $urlRouterProvider,
        AppConfig,
        $injector
      ) {

        // Set the base url for formio.
        FormioProvider.setBaseUrl(AppConfig.apiUrl);
        FormioProvider.setAppUrl(AppConfig.appUrl);
        FormioAuthProvider.setStates('auth.login', 'home');
        FormioAuthProvider.setForceAuth(true);
        FormioAuthProvider.register('login', 'user');

        // Add the home state.
        $stateProvider
          .state('home', {
            url: '/?',
            templateUrl: 'views/home.html'
          })
          .state('appointments', {
            url: '/appointments',
            templateUrl: 'views/appointment/all.html',
            controller: ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
              $scope.$on('rowView', function(event, appointment) {
                $state.go('dealer.customer.appointment.view', {
                  dealerId: $rootScope.user.data.dealer._id,
                  customerId: appointment.data.customer._id,
                  appointmentId: appointment._id
                });
              });
            }]
          });

        // Register all of the resources.
        angular.forEach(AppConfig.resources, function(resource, name) {
          FormioResourceProvider.register(name, resource.form, $injector.get(resource.resource + 'Provider'));
        });

        // Register the form provider for the customer.
        FormioFormsProvider.register('customer', AppConfig.appUrl, {
          field: [{
            name: 'customer',
            stateParam: 'customerId'
          }],
          base: 'dealer.customer.',
          tag: 'customer'
        });

        // Otherwise go to home page.
        $urlRouterProvider.otherwise('/');
      }
    ]);
})();
