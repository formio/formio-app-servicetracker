/**
 *  The following shows an example resource provider.
 *
 *  This allows you to hook into the CRUD operations for a single Form.io
 *  resource as it is being indexed, viewed, deleted, created, updated, etc. By
 *  providing your logic here, you can control how Form.io behaves within your
 *  application.
 */
angular.module('serviceTracker')
  .provider('CustomerResource', function() {
    return {
      $get: function() { return null; },

      /**
       * Allow for nested resources by setting the parent to another resource.
       */
      parent: 'dealer',
      base: 'dealer.',

      /**
       * Allow you to change the template for any view of this resource.
       */
      templates: {
        index: '',
        abstract: 'views/customer/customer.html',
        view: 'views/customer/view.html',
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
        }],
        create: ['$scope', function($scope) {
          $scope.$on('formSubmission', function(err, submission) {
            // A submission has been made... Do something...
            console.log(submission);
          });
        }],
        edit: ['$scope', function($scope) {
          $scope.$on('formSubmission', function(err, submission) {
            // A submission was updated... Do something...
            console.log(submission);
          });
        }],
        delete: ['$scope', '$stateParams', function($scope, $stateParams) {
          $scope.$on('delete', function(err) {
            // A submission was deleted.
            console.log('Submission Deleted');
          });
        }]
      }
    };
  });