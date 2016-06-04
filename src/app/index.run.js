(function() {
  'use strict';

  angular
    .module('servicetracker')
    .run(runBlock);

  /** @ngInject */
  function runBlock(
    $log,
    $rootScope,
    AppConfig,
    FormioAuth
  ) {
    // Initialize the Form.io authentication system.
    FormioAuth.init();

    // Allow the app to have access to configurations.
    $rootScope.config = AppConfig;

    // Add the forms to the root scope.
    angular.forEach(AppConfig.forms, function(url, form) {
      $rootScope[form] = url;
    });

    $log.debug('runBlock end');
  }

})();
