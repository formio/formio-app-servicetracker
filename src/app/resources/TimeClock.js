/**
 *  The following shows an example resource provider.
 *
 *  This allows you to hook into the CRUD operations for a single Form.io
 *  resource as it is being indexed, viewed, deleted, created, updated, etc. By
 *  providing your logic here, you can control how Form.io behaves within your
 *  application.
 */
angular.module('serviceTracker')
  .provider('TimeClockResource', function() {
    return {
      $get: function() { return null; },

      /**
       * Allow for nested resources by setting the parent to another resource.
       */
      parent: 'appointment',
      base: 'dealer.customer.appointment.',

      /**
       * Allow you to change the template for any view of this resource.
       */
      templates: {
        index: '',
        view: 'views/timeclock/view.html',
        create: '',
        edit: '',
        delete: ''
      },

      /**
       * Provide customer parameters to each of the operations for this resource.
       */
      params: {
        index: {},
        view: {},
        create: {},
        edit: {},
        delete: {}
      },

      /**
       * Provide custom controllers for each operation on a resource.
       */
      controllers: {
        index: null,
        abstract: null,
        view: null,
        create: ['$scope', 'Geolocation', function($scope, Geolocation) {
          Geolocation.getCurrentPosition()
          .then(function(data) {
            if (!data || !data.coords || !data.coords.longitude || !data.coords.latitude) return;
            $scope.submission.data.location = [data.coords.latitude, data.coords.longitude];
          })
          .catch(function(err) {
            console.log(err);
            $scope.submission.data.location = [0, 0];
          });
        }],
        edit: null,
        delete: null
      }
    };
  });