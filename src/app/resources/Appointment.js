angular.module('servicetracker')
  .provider('AppointmentResource', function() {
    return {
      $get: function() { return null; },
      parent: 'customer',
      base: 'dealer.customer.',
      templates: {
        abstract: 'views/appointment/appointment.html',
        view: 'views/appointment/view.html'
      }
    };
  });
