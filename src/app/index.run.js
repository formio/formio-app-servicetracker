(function() {
  /* global _, navigator, console */
  'use strict';
  angular
    .module('serviceTracker')
    .run([
      'FormioAuth',
      'AppConfig',
      '$rootScope',
      function(
        FormioAuth,
        AppConfig,
        $rootScope
      ) {
        FormioAuth.init();

        // Set the config object.
        $rootScope.config = AppConfig;

        // Add the forms to the root scope.
        angular.forEach(AppConfig.forms, function(url, form) {
          $rootScope[form] = url;
        });
      }
    ]);
})();