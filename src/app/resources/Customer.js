angular.module('servicetracker')
  .provider('CustomerResource', function() {
    return {
      $get: function() { return null; },
      parent: 'dealer',
      base: 'dealer.',
      templates: {
        abstract: 'views/customer/customer.html',
        view: 'views/customer/view.html'
      },
      controllers: {
        view: ['$scope', function($scope) {
          $scope.position = {lat: '40.74', lng: '-74.18'};
          $scope.customer.loadSubmissionPromise.then(function(customer) {
            if (
              customer.data.address &&
              customer.data.address.geometry &&
              customer.data.address.geometry.location
            ) {
              $scope.position.lat = customer.data.address.geometry.location.lat;
              $scope.position.lng = customer.data.address.geometry.location.lng;
            }
          });
        }]
      }
    };
  });
