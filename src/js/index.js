window.$ = window.jQuery = require('jquery');
require('mapbox.js');
require('leaflet.markercluster');
L.mapbox.accessToken = 'pk.eyJ1IjoibWlndWVscGVpeGUiLCJhIjoiVlc0WWlrQSJ9.pIPkSx25w7ossO6rZH9Tcw';
window.angular = require('angular');
window._ = require('underscore');
window.moment = require('moment');
require('moment/locale/pt-br');
moment.locale('pt-br');
require('intl-tel-input/build/js/intlTelInput');

require('angular-simple-logger');

require('angular-animate');
require('angular-leaflet-directive');
require('angular-google-chart');
require('angular-ui-router');
require('angular-resource');
require('angular-cookies');
require('angular-gettext');
require('ng-dialog');
require('angular-pickadate/src/angular-pickadate');
require('international-phone-number/releases/international-phone-number');

var app = angular.module('rede', [
	'ui.router',
	'ngCookies',
	'ngAnimate',
	'ngResource',
	'ngDialog',
	'googlechart',
	'leaflet-directive',
	'pickadate',
	'internationalPhoneNumber',
	'gettext'
]);

app
.value('googleChartApiConfig', {
	version: '1.1',
	optionalSettings: {
		packages: ['line', 'bar'],
		language: 'en'
	}
})
.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	'$httpProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		$locationProvider.hashPrefix('!');

		$stateProvider
		.state('home', {
			url: '/',
			controller: 'HomeCtrl',
			templateUrl: '/views/home.html',
			resolve: {
				SensorsData: [
					'RedeService',
					function(Rede) {
						return Rede.sensors.query().$promise;
					}
				]
			}
<<<<<<< HEAD
		})
=======
		}
>>>>>>> 3fd327b91d21414f40613266151f96ec97d42ae2
		.state('about', {
			url: '/sobre/',
			templateUrl: '/views/pages/about.html'
		})
		.state('monitoring', {
			url: '/monitoring/',
			templateUrl: '/views/pages/monitoring.html'
		})
		.state('equipment', {
			url: '/equipamento/',
			templateUrl: '/views/pages/equipment.html'
		})
		.state('login', {
			url: '/login/',
			templateUrl: '/views/login.html',
			controller: [
				'$state',
				'$scope',
				'RedeAuth',
				'MessageService',
				function($state, $scope, Auth, Message) {

					if(Auth.getToken()) {
						$state.go('home');
						Message.add('Você já está logado.');
					}

					var fromState;
					$scope.$on('$stateStateSuccess', function(ev, to, toParams, from) {
						fromState = from;
					});
					$scope.return = function() {
						$state.go(fromState || 'home');
					}
				}
			]
		})
		.state('account', {
			url: '/account/',
			templateUrl: '/views/account.html',
			controller: 'AccountCtrl'
		})
		.state('account.sensors', {
			url: 'sensors/',
			templateUrl: '/views/account-sensors.html'
		})
		.state('sensor', {
			url: '/sensors/:sensorId/',
			controller: 'SensorCtrl',
			templateUrl: '/views/sensor.html',
			resolve: {
				SensorData: [
					'RedeService',
					'$stateParams',
					function(Rede, $stateParams) {
						return Rede.sensors.get({id: $stateParams.sensorId}).$promise;
					}
				],
				ParametersData: [
					'RedeService',
					function(Rede) {
						return Rede.getParameters();
					}
				],
				AddressData: [
					'RedeService',
					'SensorData',
					function(Rede, Sensor) {
						var coords = Sensor.geometry.coordinates
						return Rede.geocode(coords[1], coords[0]);
					}
				]
			}
		})
		.state('sensor.subscribe', {
			url: 'subscribe/',
			controller: 'SensorSubscription',
			templateUrl: '/views/sensor/subscribe.html'
		})
		.state('sensor.report', {
			url: 'report/?from&to',
			controller: 'SensorReport',
			templateUrl: '/views/sensor/report.html'
		})
		.state('lab', {
			url: '/lab/',
			controller: 'LabCtrl',
			templateUrl: '/views/lab.html'
		})
		.state('lab.form', {
			url: 'form/',
			templateUrl: '/views/lab-form.html'
		})
		.state('admin', {
			url: '/admin/',
			controller: 'AdminCtrl',
			templateUrl: '/views/admin/index.html'
		})
		.state('admin.broadcast', {
			url: 'broadcast/',
			templateUrl: '/views/admin/broadcast.html'
		})
		.state('admin.sensors', {
			url: 'sensors/?page',
			templateUrl: '/views/admin/sensors.html',
			controller: 'AdminSensorCtrl',
			resolve: {
				SensorsData: [
					'RedeService',
					'$stateParams',
					function(Rede, $stateParams) {
						return Rede.sensors.query().$promise;
					}
				]
			}
		})
		.state('admin.sensors.new', {
			url: 'new/',
			controller: 'AdminEditSensorCtrl',
			templateUrl: '/views/admin/sensors-edit.html'
		})
		.state('admin.sensors.edit', {
			url: ':sensorId/edit/',
			controller: 'AdminEditSensorCtrl',
			templateUrl: '/views/admin/sensors-edit.html'
		})
		.state('admin.sensors.measurements', {
			url: ':sensorId/measurements/?parameter_id&measurement_page',
			controller: 'AdminEditMeasurementCtrl',
			templateUrl: '/views/admin/sensors-measurements.html',
			resolve: {
				SensorData: [
					'RedeService',
					'$stateParams',
					function(Rede, $stateParams) {
						return Rede.sensors.get({id: $stateParams.sensorId}).$promise;
					}
				],
				ParametersData: [
					'RedeService',
					function(Rede) {
						return Rede.getParameters();
					}
				],
			}
		})
		.state('admin.sensors.broadcast', {
			url: ':sensorId/broadcast/',
			controller: 'AdminEditSensorCtrl',
			templateUrl: '/views/admin/sensors-broadcast.html'
		})
		.state('admin.users', {
			url: 'users/',
			controller: 'AdminUserCtrl',
			templateUrl: '/views/admin/users.html',
			resolve: {
				UsersData: [
					'RedeService',
					function(Rede) {
						return Rede.users.query().$promise;
					}
				]
			}
		})
		.state('admin.users.new', {
			url: 'new/',
			controller: 'AdminEditUserCtrl',
			templateUrl: '/views/admin/users-edit.html'
		})
		.state('admin.users.edit', {
			url: ':userId/edit/',
			controller: 'AdminEditUserCtrl',
			templateUrl: '/views/admin/users-edit.html'
		});

		/*
		* Trailing slash rule
		*/
		$urlRouterProvider.rule(function($injector, $location) {
			var path = $location.path(),
			search = $location.search(),
			params;

			// check to see if the path already ends in '/'
			if (path[path.length - 1] === '/') {
				return;
			}

			// If there was no search string / query params, return with a `/`
			if (Object.keys(search).length === 0) {
				return path + '/';
			}

			// Otherwise build the search string and return a `/?` prefix
			params = [];
			angular.forEach(search, function(v, k){
				params.push(k + '=' + v);
			});

			return path + '/?' + params.join('&');
		});
	}
])
.run([
	'$rootScope',
	'$location',
	'$window',
	function($rootScope, $location, $window) {
		$rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {
			if($window._gaq && fromState.name) {
				$window._gaq.push(['_trackPageview', $location.path()]);
			}
			if(fromState.name) {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			}
		});
	}
])
.factory('authInterceptor', [
	'$rootScope',
	'$window',
	'$q',
	function($rootScope, $window, $q) {

		if(typeof $ !== 'undefined' || typeof jQuery !== 'undefined') {
			$.ajaxSetup({
				beforeSend: function(req) {
					if($window.auth)
						req.setRequestHeader('Authorization', 'Bearer ' + $window.auth.accessToken);
				}
			});
		}

		return {
			request: function(config) {
				config.headers = config.headers || {};
				if($window.auth)
					config.headers['Authorization'] = 'Bearer ' + $window.auth.accessToken;
				return config || $q.when(config);
			}
		};
	}
])
.config([
	'$httpProvider',
	function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}
]);

require('./translations');

require('./messages');

require('./service');
require('./directives');
require('./controllers');

angular.module('rede').run([
	'$rootScope',
	'gettextCatalog',
	function ($rootScope, gettextCatalog) {

		var userLang = navigator.language || navigator.userLanguage;
		if(userLang == 'pt-BR' || userLang == 'pt' || userLang == 'pt_BR' || userLang == 'pt_PT' || userLang == 'pt-PT')
			gettextCatalog.setCurrentLanguage('pt_BR');
		else
			gettextCatalog.setCurrentLanguage('en');

		$rootScope.$watch(function() {
			return gettextCatalog.getCurrentLanguage();
		}, function(lang) {
			if(lang == 'pt_BR')
				moment.locale('pt-br');
			else
				moment.locale('en');
		});
	}
]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['rede']);
});
