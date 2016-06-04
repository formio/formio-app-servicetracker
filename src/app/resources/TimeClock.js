angular.module('servicetracker')
  .provider('TimeClockResource', function() {
    return {
      $get: function() { return null; },
      parent: 'appointment',
      base: 'dealer.customer.appointment.',
      templates: {
        view: 'views/timeclock/view.html'
      },
      controllers: {
        create: ['$scope', 'Geolocation', function($scope, Geolocation) {
          Geolocation.getCurrentPosition()
            .then(function(data) {
              if (!data || !data.coords || !data.coords.longitude || !data.coords.latitude) return;
              $scope.submission.data.location = [data.coords.latitude, data.coords.longitude];
            })
            .catch(function() {
              $scope.submission.data.location = [0, 0];
            });
        }]
      }
    };
  });
