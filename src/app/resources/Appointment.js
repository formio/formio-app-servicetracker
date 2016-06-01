/**
 *  The following shows an example resource provider.
 *
 *  This allows you to hook into the CRUD operations for a single Form.io
 *  resource as it is being indexed, viewed, deleted, created, updated, etc. By
 *  providing your logic here, you can control how Form.io behaves within your
 *  application.
 */
angular.module('serviceTracker')
  .provider('AppointmentResource', function() {
    return {
      $get: function() { return null; },

      /**
       * Allow for nested resources by setting the parent to another resource.
       */
      parent: 'customer',
      base: 'dealer.customer.',

      /**
       * Allow you to change the template for any view of this resource.
       */
      templates: {
        index: '',
        abstract: 'views/appointment/appointment.html',
        view: 'views/appointment/view.html',
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
        create: null,
        edit: null,
        delete: null
      }
    };
  });