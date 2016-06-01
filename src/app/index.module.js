(function () {
  'use strict';
  angular
    .module('serviceTracker', [
      'formio',
      'ngFormioHelper',
      'ui.router',
      'ngMap',
      'angularMoment'
    ])
    .factory('Geolocation', ['$q', '$window', function($q, $window) {
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
      }
    }]);
})();