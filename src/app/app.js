(function() {
  /* global _, navigator, console */
  'use strict';

  /**
   * @ngdoc overview
   * @name formioServiceTrackerApp
   * @description
   * # formioServiceTrackerApp
   *
   * Main module of the application.
   */

  angular
    .module('formioServiceTrackerApp', [
      'formio',
      'ngFormioHelper',
      'ui.router',
      'ngMap',
      'bgf.paginateAnything',
      'angularMoment'
    ])
    .config([
      'FormioProvider',
      'FormioAuthProvider',
      'FormioResourceProvider',
      '$stateProvider',
      '$urlRouterProvider',
      'AppConfig',
      function(
        FormioProvider,
        FormioAuthProvider,
        FormioResourceProvider,
        $stateProvider,
        $urlRouterProvider,
        AppConfig
      ) {

        // Set the base url for formio.
        FormioProvider.setBaseUrl(AppConfig.apiUrl);
        FormioAuthProvider.setStates('auth.contractorLogin', 'home');
        FormioAuthProvider.setForceAuth(true);
        FormioAuthProvider.register('dealerLogin', 'dealer', 'dealer');
        FormioAuthProvider.register('adminLogin', 'admin', 'admin');
        FormioAuthProvider.register('contractorLogin', 'contractor', 'contractor');

        // Add the home state.
        $stateProvider
          .state('home', {
            url: '',
            templateUrl: 'views/main.html',
          })
          .state('appointments', {
            url: '/appointments',
            parent: 'home',
            templateUrl: 'views/appointments.html',
            params: {
              filter: {},
              startDate: moment().startOf('day').toDate(),
              endDate: moment().endOf('day').add(7, 'days').toDate(),
              time_filter: {},
              time_startDate: moment().startOf('day').toDate(),
              time_endDate: moment().endOf('day').add(7, 'days').toDate(),
            },
            controller: ['$scope', '$rootScope', '$stateParams', 'Formio',
              function($scope, $rootScope, $params, Formio) {
                $scope.appointments = [];
                $scope.appointmentsUrl = AppConfig.appointmentForm + '/submission';
                $scope.filter = $params.filter;
                $scope.minDate = moment().startOf('day').toDate();
                $scope.startDate = $params.startDate;
                $scope.endDate = $params.endDate;
                if(!$rootScope.isRole('admin')) {
                  $scope.filter['customer.data.dealer._id'] = $rootScope.getDealer()._id;
                }
                if($rootScope.isRole('contractor') && !$scope.filter['assignedContractor._id']) {
                  $scope.filter['assignedContractor._id'] = $rootScope.user._id;
                }
                $scope.urlParams = $rootScope.getUrlParams($scope.filter);
                $scope.urlParams.sort = 'data.appointmentTime';
                $scope.urlParams['data.appointmentTime__gte'] = $scope.startDate.toISOString();
                $scope.urlParams['data.appointmentTime__lte'] = $scope.endDate.toISOString();

                $scope.timeclocks = [];
                $scope.timeclocksUrl = AppConfig.timeclockForm + '/submission';
                $scope.time_filter = $params.time_filter;
                $scope.time_startDate = $params.time_startDate;
                $scope.time_endDate = $params.time_endDate;
                if($rootScope.isRole('contractor')) {
                  $scope.time_filter['appointment.data.assignedContractor._id'] = $rootScope.user._id;
                }
                if($rootScope.isRole('dealer')) {
                  $scope.time_filter['appointment.data.assignedContractor.data.dealer._id'] = $rootScope.getDealer()._id;
                }

                $scope.time_urlParams = $rootScope.getUrlParams($scope.time_filter);
                $scope.time_urlParams.sort = 'data.time';
                $scope.time_urlParams['data.time__gte'] = $scope.time_startDate.toISOString();
                $scope.time_urlParams['data.time__lte'] = $scope.time_endDate.toISOString();

                $scope.refreshContractors = function(input) {
                  var params = {};
                  if(!$rootScope.isRole('admin')) {
                    params = {
                      'data.dealer._id': $rootScope.getDealer()._id
                    };
                  }
                  if(input) {
                    params['data.name__regex'] = '/' + _.escapeRegExp(input) + '/i';
                  }
                  new Formio(AppConfig.contractorForm)
                    .loadSubmissions({params: params})
                    .then(function(contractors) {
                      $scope.contractors = contractors;
                    });
                };
              }
            ]
          })
          .state('myforms', {
            url: '/forms',
            parent: 'home',
            templateUrl: 'views/myforms.html',
          });

        var hideFields = function($scope, FormioUtils, components) {
          var changedComponents = [];
          var deregister = $scope.$on('formLoad', function(event, form) {
            FormioUtils.eachComponent(form.components, function (component) {
              for (var i in components) {
                var key = components[i];
                if (component.key === key) {
                  changedComponents.push({
                    component: component,
                    originalType: component.type
                  });
                  component.type = 'hidden';
                }
              }
            });
          });

          // Restore hidden fields
          $scope.$on('$destroy', function() {
            deregister();
            angular.forEach(changedComponents, function(c) {
              c.component.type = c.originalType;
            });
          });
        };

        // Register the resources.
        FormioResourceProvider.register('contractor', AppConfig.contractorForm, {
          parent: 'home',
          templates: {
            index: 'views/contractor/index.html'
          },
          params: {
            index: {
              filter: {}
            }
          },
          index: ['$scope', '$rootScope', '$stateParams',
            function($scope, $rootScope, $params) {
              $scope.contractors = [];
              $scope.contractorsUrl = AppConfig.contractorForm + '/submission';
              $scope.filter = $params.filter;
              if(!$rootScope.isRole('admin')) {
                var dealer = $rootScope.getDealer();
                if (dealer) {
                  $scope.filter['dealer._id'] = dealer._id;
                }
              }

              $scope.urlParams = $rootScope.getUrlParams($scope.filter);
            }
          ],
          create: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              if(!$rootScope.isRole('admin')) {
                $scope.submission.data = {
                  dealer: $rootScope.getDealer()
                };
                hideFields($scope, FormioUtils, [
                  'dealer'
                ]);
              }
            }
          ],
          view: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              var hiddenFields = ['password', 'submit'];
              if(!$rootScope.isRole('admin')) {
                hiddenFields.push('dealer');
              }
              hideFields($scope, FormioUtils, hiddenFields);
            }
          ],
          edit: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              if(!$rootScope.isRole('admin')) {
                hideFields($scope, FormioUtils, [
                  'dealer'
                ]);
              }
            }
          ]
        });

        FormioResourceProvider.register('customer', AppConfig.customerForm, {
          parent: 'home',
          templates: {
            view: 'views/customer/view.html',
            index: 'views/customer/index.html'
          },
          params: {
            index: {
              filter: {},
              showInactive: false
            }
          },
          abstract: ['$scope', '$rootScope',
            function($scope, $rootScope) {
              if(!$rootScope.isRole('admin')) {
                $scope.hideDelete = true;
              }
            }
          ],
          index: ['$scope', '$rootScope', '$stateParams',
            function($scope, $rootScope, $params) {
              $scope.customers = [];
              $scope.customersUrl = AppConfig.customerForm + '/submission';
              $scope.filter = $params.filter;
              $scope.showInactive = $params.showInactive;
              if(!$rootScope.isRole('admin')) {
                $scope.filter['dealer._id'] = $rootScope.getDealer()._id;
              }
              $scope.urlParams = $rootScope.getUrlParams($scope.filter);

              if(!$scope.showInactive) {
                $scope.urlParams['data.inactive'] = false;
              }
            }
          ],
          create: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              if(!$rootScope.isRole('admin')) {
                $scope.submission.data = {
                  dealer: $rootScope.getDealer()
                };
                hideFields($scope, FormioUtils, [
                  'dealer'
                ]);
              }
            }
          ],
          view: ['$scope', '$rootScope', '$state', '$stateParams', 'Formio',
            function($scope, $rootScope, $state, $stateParams, Formio) {
              $scope.position = {lat: '40.74', lng: '-74.18'};
              $scope.urlParams = {
                'data.customer._id': $stateParams.customerId
              };
              $scope.$watch('currentResource.resource.data.address.geometry.location', function(location) {
                if(!location) {
                  return;
                }
                $scope.position.lat = location.lat;
                $scope.position.lng = location.lng;
              });

              $scope.equipment = [];
              $scope.equipmentUrl = AppConfig.equipmentForm + '/submission';
              $scope.appointments = [];
              $scope.appointmentsUrl = AppConfig.appointmentForm + '/submission';
              $scope.forms = AppConfig.forms;
              $scope.formSubmissions = {};
              $scope.gotoSubmission = function(form, submission) {
                var params = {};
                params[form.name + 'Id'] = submission._id;
                params.customerId = submission.data.customer._id;
                $state.go(form.name + '.view', params);
              };

              angular.forEach($scope.forms, function(form) {
                $scope.formSubmissions[form.name] = [];
                new Formio(form.form).loadSubmissions({params: {
                  'data.customer._id': $stateParams.customerId
                }}).then(function(subs) {
                  $scope.formSubmissions[form.name] = subs;
                });
              });
            }
          ],
          edit: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              if(!$rootScope.isRole('admin')) {
                hideFields($scope, FormioUtils, [
                  'dealer'
                ]);
              }
            }
          ]
        });

        FormioResourceProvider.register('dealer', AppConfig.dealerForm, {
          parent: 'home',
          templates: {
            index: 'views/dealer/index.html'
          },
          params: {
            index: {
              filter: {}
            }
          },
          index: ['$scope', '$rootScope', '$stateParams', 'FormioUtils',
            function($scope, $rootScope, $params, FormioUtils) {
              if(!$rootScope.isRole('admin')) {
                var dealer = $rootScope.getDealer();
                if (dealer) {
                  $scope.dealerUrl = AppConfig.dealerForm + '/submission/' + dealer._id;
                  if(!$rootScope.isRole('dealer')) {
                    hideFields($scope, FormioUtils, ['password']);
                  }
                }
              }
              else {
                $scope.dealers = [];
                $scope.dealersUrl = AppConfig.dealerForm + '/submission';
                $scope.filter = $params.filter;
                $scope.urlParams = $rootScope.getUrlParams($scope.filter);
              }

            }
          ],
          create: ['$scope', '$rootScope', '$state',
            function($scope, $rootScope, $state) {
              if(!$rootScope.isRole('admin')) { $state.go('home'); }
            }
          ],
          view: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              hideFields($scope, FormioUtils, [
                'password',
                'submit'
              ]);
            }
          ],
          edit: ['$scope', '$rootScope', '$state',
            function($scope, $rootScope, $state) {
              if(!$rootScope.isRole('admin')) { $state.go('home'); }
            }
          ],
          delete: ['$scope', '$rootScope', '$state',
            function($scope, $rootScope, $state) {
              if(!$rootScope.isRole('admin')) { $state.go('home'); }
            }
          ]
        });

        FormioResourceProvider.register('appointment', AppConfig.appointmentForm, {
          parent: 'customer',
          templates: {
            view: 'views/appointment/view.html'
          },
          params: {
            create: {
              customer: null
            }
          },
          create: ['$scope', '$rootScope', '$stateParams', 'FormioUtils',
            function($scope, $rootScope, $params, FormioUtils) {
              $scope.submission = {data: {}};
              $scope.$watch('customer.resource', function(customer) {
                if (!customer || !customer.data) { return; }
                $scope.submission.data.customer = customer;
                hideFields($scope, FormioUtils, ['customer']);
              });

              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var customerComponent = FormioUtils.getComponent(form.components, 'customer');
                  var contractorComponent = FormioUtils.getComponent(form.components, 'assignedContractor');
                  // Filter resource components to only show resources under dealer
                  var params = {'data.dealer._id': $rootScope.getDealer()._id};
                  customerComponent.params = params;
                  contractorComponent.params = params;
                });
              }

              if($rootScope.isRole('contractor')) {
                $scope.submission.data.assignedContractor = $rootScope.user;
              }
            }
          ],
          view: ['$scope', '$rootScope', '$stateParams',
            function($scope, $rootScope, $params) {
              $scope.timeclocks = [];
              $scope.timeclocksUrl = AppConfig.timeclockForm + '/submission';
              $scope.urlParams = {sort: 'data.time'};
              $scope.services = [];
              $scope.servicesUrl = AppConfig.serviceForm + '/submission';
              $scope.serviceUrlParams = {
                'data.appointment._id': $params.appointmentId,
                sort: 'created'
              };
            }
          ],
          edit: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var customerComponent = FormioUtils.getComponent(form.components, 'customer');
                  var contractorComponent = FormioUtils.getComponent(form.components, 'assignedContractor');
                  // Filter resource components to only show resources under dealer
                  var params = {'data.dealer._id': $rootScope.getDealer()._id};
                  customerComponent.params = params;
                  contractorComponent.params = params;
                });
              }
            }
          ]
        });

        FormioResourceProvider.register('timeclock', AppConfig.timeclockForm, {
          parent: 'appointment',
          params: {
            create: {
              appointmentId: null
            }
          },
          templates: {
            view: 'views/timeclock/view.html'
          },
          create: ['$scope', '$rootScope', '$stateParams', 'Formio', 'FormioUtils',
            function($scope, $rootScope, $params, Formio, FormioUtils) {
              $scope.submission = {data: {}};
              $scope.$watch('appointment.resource', function(appointment) {
                if (!appointment || !appointment.data) { return; }
                $scope.submission.data.appointment = appointment;
                hideFields($scope, FormioUtils, ['appointment']);
              });

              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var appointmentComponent = FormioUtils.getComponent(form.components, 'appointment');
                  // Filter resource components to only show resources under dealer
                  var params;
                  if($rootScope.isRole('dealer')) {
                    params = {'data.customer.data.dealer._id': $rootScope.getDealer()._id};
                  }
                  if($rootScope.isRole('contractor')) {
                    params = {'data.assignedContractor._id': $rootScope.user._id};
                  }
                  appointmentComponent.params = params;
                });
              }
              $scope.$on('formSubmit', function($event, submission) {
                submission.owner = submission.data.appointment.data.assignedContractor._id;
              });

              // Add geolocation data if available
              if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                  $scope.submission.data.gpsLatitude = position.coords.latitude;
                  $scope.submission.data.gpsLongitude = position.coords.longitude;
                }, function() {
                  console.warn("Unable to retrieve location");
                });
              }
              else {
                console.warn("Geolocation is not supported. Cannot add GPS data to this time entry.");
              }
            }
          ],
          edit: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var appointmentComponent = FormioUtils.getComponent(form.components, 'appointment');
                  // Filter resource components to only show resources under dealer
                  var params;
                  if($rootScope.isRole('dealer')) {
                    params = {'data.customer.data.dealer._id': $rootScope.getDealer()._id};
                  }
                  if($rootScope.isRole('contractor')) {
                    params = {'data.assignedContractor._id': $rootScope.user._id};
                  }
                  appointmentComponent.params = params;
                });
              }
              $scope.$on('formSubmit', function($event, submission) {
                submission.owner = submission.data.appointment.data.assignedContractor._id;
              });
            }
          ],
          delete: ['$scope', '$rootScope', '$state',
            function($scope, $rootScope, $state) {
              $scope.$on('delete', function() {
                $state.go('appointment.view', {appointmentId: $scope.currentResource.resource.data.appointment._id});
              });
              return true;
            }
          ]
        });

        FormioResourceProvider.register('equipment', AppConfig.equipmentForm, {
          parent: 'customer',
          params: {
            create: {
              customerId: null
            }
          },
          templates: {
            view: 'views/equipment/view.html'
          },
          create: ['$scope', '$rootScope', '$stateParams', 'Formio', 'FormioUtils',
            function($scope, $rootScope, $params, Formio, FormioUtils) {
              $scope.submission = {data: {}};
              $scope.$watch('customer', function(customer) {
                if (!customer.resource || !customer.resource.data) { return; }
                $scope.submission.data.customer = customer.resource;
              }, true);
              hideFields($scope, FormioUtils, ['customer']);

              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var customerComponent = FormioUtils.getComponent(form.components, 'customer');
                  // Filter resource components to only show customer under dealer
                  var params = {'data.dealer._id': $rootScope.getDealer()._id};
                  customerComponent.params = params;
                });
              }
            }
          ],
          edit: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              hideFields($scope, FormioUtils, [
                'customer'
              ]);
              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var customerComponent = FormioUtils.getComponent(form.components, 'customer');
                  // Filter resource components to only show customer under dealer
                  var params = {'data.dealer._id': $rootScope.getDealer()._id};
                  customerComponent.params = params;
                });
              }
            }
          ]
        });

        FormioResourceProvider.register('service', AppConfig.serviceForm, {
          parent: 'appointment',
          templates: {
            view: 'views/service/view.html'
          },
          create: ['$scope', '$rootScope', '$stateParams', 'Formio', 'FormioUtils',
            function($scope, $rootScope, $params, Formio, FormioUtils) {
              $scope.submission = {data: {}};
              $scope.$watch('appointment', function(appointment) {
                if (!appointment || !appointment.resource) { return; }
                $scope.submission.data.appointment = appointment.resource;
              }, true);
              hideFields($scope, FormioUtils, ['appointment']);

              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var appointmentComponent = FormioUtils.getComponent(form.components, 'appointment');
                  // Filter resource components to only show appointment under dealer
                  var params;
                  if($rootScope.isRole('dealer')) {
                    params = {'data.customer.data.dealer._id': $rootScope.getDealer()._id};
                  }
                  if($rootScope.isRole('contractor')) {
                    params = {'data.assignedContractor._id': $rootScope.user._id};
                  }
                  appointmentComponent.params = params;
                });
              }
            }
          ],
          edit: ['$scope', '$rootScope', 'FormioUtils',
            function($scope, $rootScope, FormioUtils) {
              hideFields($scope, FormioUtils, [
                'appointment'
              ]);
              if(!$rootScope.isRole('admin')) {
                $scope.$on('formLoad', function($event, form) {
                  var appointmentComponent = FormioUtils.getComponent(form.components, 'appointment');
                  // Filter resource components to only show appointment under dealer
                  var params;
                  if($rootScope.isRole('dealer')) {
                    params = {'data.customer.data.dealer._id': $rootScope.getDealer()._id};
                  }
                  if($rootScope.isRole('contractor')) {
                    params = {'data.assignedContractor._id': $rootScope.user._id};
                  }
                  appointmentComponent.params = params;
                });
              }
            }
          ]
        });

        // Register each of the forms.
        angular.forEach(AppConfig.forms, function(form) {
          FormioResourceProvider.register(form.name, form.form, {
            parent: 'customer',
            params: {
              create: {
                customerId: null
              }
            },
            create: ['$scope', '$rootScope', '$state', '$stateParams', 'Formio', 'FormioUtils',
              function($scope, $rootScope, $state, $params, Formio, FormioUtils) {
                $scope.submission = {data: {}};
                $scope.$watch('customer', function(customer) {
                  if (!customer.resource || !customer.resource.data) { return; }
                  $scope.submission.data.customer = customer.resource;
                }, true);
                hideFields($scope, FormioUtils, ['customer']);
                $scope.$on('formSubmission', function() {
                  $state.go('customer.view');
                });
                return {handle: true};
              }
            ]
          });
        });

        $urlRouterProvider.otherwise('/appointment');
      }
    ])
    .directive('resourcePanel', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          index: '&',
          title: '=',
          queryId: '='
        },
        templateUrl: 'views/resource/panel.html'
      };
    })
    .factory('GoogleAnalytics', ['$window', '$state', function($window, $state) {
      // Recursively build the whole state url
      // This gets the url without substitutions, to send
      // to Google Analytics
      var getFullStateUrl = function(state) {
        if(state.parent) {
          return getFullStateUrl($state.get(state.parent)) + state.url;
        }
        return state.url;
      };

      return {
        sendPageView: function() {
          $window.ga('set', 'page', getFullStateUrl($state.current));
          $window.ga('send', 'pageview');
        },

        sendEvent: function(category, action, label, value) {
          $window.ga('send', 'event', category, action, label, value);
        }
      };
    }])
    .run([
      '$rootScope',
      '$state',
      '$stateParams',
      'Formio',
      'FormioAlerts',
      'FormioAuth',
      'AppConfig',
      'GoogleAnalytics',
      function(
        $rootScope,
        $state,
        $stateParams,
        Formio,
        FormioAlerts,
        FormioAuth,
        AppConfig,
        GoogleAnalytics
      ) {
        // Set the company name.
        $rootScope.company = AppConfig.company;
        $rootScope.icon = AppConfig.icon;

        // Set the forms
        $rootScope.baseUrl = AppConfig.apiUrl;
        $rootScope.dealerLoginForm = AppConfig.dealerLoginForm;
        $rootScope.adminLoginForm = AppConfig.adminLoginForm;
        $rootScope.contractorLoginForm = AppConfig.contractorLoginForm;
        FormioAuth.init();

        $rootScope.getUrlParams = function(filter) {
          return _(filter || {})
          .mapValues(function(value) {
            return '/' + _.escapeRegExp(value) + '/i';
          })
          .mapKeys(function(value, key) {
            return 'data.' + key + '__regex';
          })
          .value();
        };

        $rootScope.getDealer = function() {
          if ($rootScope.isRole('dealer')) {
            return $rootScope.user;
          }
          if ($rootScope.isRole('contractor')) {
            return $rootScope.user.data.dealer;
          }
          return {_id: ''};
        };

        $rootScope.getUserName = function() {
          if (!$rootScope.user || !$rootScope.user.data) {
            return '';
          }

          return $rootScope.user.data.name ||
            $rootScope.user.data.firstName + ' ' + $rootScope.user.data.lastName;
        };

        $rootScope.isActive = function(state) {
          return $state.current.name.indexOf(state) !== -1;
        };

        // Ensure they are logged.
        $rootScope.$on('$stateChangeStart', function(event, toState) {
          if((_.startsWith(toState.name, 'contractor') || _.startsWith(toState.name, 'dealer')) && $rootScope.isRole('contractor')) {
            event.preventDefault();
            $state.go('home', null, {reload: true});
          }
          if (toState.name === 'home') {
            event.preventDefault();
            $state.go('appointments', null, {reload: true});
          }
        });

        $rootScope.$on('$stateChangeSuccess', function() {
          GoogleAnalytics.sendPageView();
        });

        $rootScope.$state = $state;
      }
    ]);
})();
