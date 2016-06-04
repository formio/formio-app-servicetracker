angular.module('servicetracker')
  .provider('ContractorResource', function() {
    return {
      $get: function() { return null; },
      parent: 'dealer',
      base: 'dealer.'
    };
  });
