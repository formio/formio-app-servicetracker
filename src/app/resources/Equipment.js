angular.module('servicetracker')
  .provider('EquipmentResource', function() {
    return {
      $get: function() { return null; },
      parent: 'customer',
      base: 'dealer.customer.',
      templates: {
        view: 'views/equipment/view.html'
      }
    };
  });
