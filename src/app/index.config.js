(function() {
  'use strict';

  angular
    .module('servicetracker')
    .config(config);

  /** @ngInject */
  function config(
    toastrConfig,
    FormioProvider,
    FormioAuthProvider,
    AppConfig
  ) {
    // Set the base url for formio.
    FormioProvider.setBaseUrl(AppConfig.apiUrl);
    FormioProvider.setAppUrl(AppConfig.appUrl);

    // Initialize our FormioAuth provider states.
    FormioAuthProvider.setStates('auth.login', 'home');
    FormioAuthProvider.setForceAuth(true);
    FormioAuthProvider.register('login', 'user');

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }
})();
