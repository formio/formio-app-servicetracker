angular.module('servicetracker')
  .provider('DealerResource', function() {
    return {
      $get: function() { return null; },
      templates: {
        abstract: 'views/dealer/dealer.html',
        view: 'views/dealer/view.html'
      }
    };
  });
