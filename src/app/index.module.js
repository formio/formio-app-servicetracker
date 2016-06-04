(function() {
  'use strict';
  angular
    .module('servicetracker', [
      'ngSanitize',
      'ngAria',
      'ui.router',
      'ui.bootstrap',
      'toastr',
      'ngMap',
      'formio',
      'ngFormioHelper'
    ])
    .factory('Geolocation', Geolocation);

  /** @ngInject */
  function Geolocation($q, $window) {
    return {
      getCurrentPosition: function() {
        var deferred = $q.defer();

        if (!$window.navigator.geolocation) {
          return deferred.reject('Geolocation not supported.');
        }

        $window.navigator.geolocation.getCurrentPosition(
          function(position) {
            deferred.resolve(position);
          },
          function(err) {
            deferred.reject(err);
          }
        );

        return deferred.promise;
      }
    };
  }
})();
