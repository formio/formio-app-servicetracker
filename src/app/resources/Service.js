angular.module('servicetracker')
  .provider('ServiceResource', function() {
    return {
      $get: function() { return null; },
      parent: 'appointment',
      base: 'dealer.customer.appointment.',
      templates: {
        view: 'views/service/view.html'
      }
    };
  });
