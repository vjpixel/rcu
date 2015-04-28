require('mapbox.js');
L.mapbox.accessToken = 'pk.eyJ1IjoibWlndWVscGVpeGUiLCJhIjoiVlc0WWlrQSJ9.pIPkSx25w7ossO6rZH9Tcw';
window.angular = require('angular');
window._ = require('underscore');
window.moment = require('moment');

require('angular-google-chart');
require('angular-ui-router');
require('angular-resource');

var app = angular.module('rede', [
	'ui.router', 
	'ngResource',
	'googlechart'
]);

app
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
				templateUrl: '/views/home.html'
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
		/*
		 * Analytics
		 */
		$rootScope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {
			if($window._gaq && fromState.name) {
				$window._gaq.push(['_trackPageview', $location.path()]);
			}
			if(fromState.name) {
				if($(window).width() <= 770) {
					$('html,body').animate({
						scrollTop: 0
					}, '200');
				}
			}
		});
	}
]);

require('./service');
require('./directives');
require('./controllers');

angular.element(document).ready(function() {
	angular.bootstrap(document, ['rede']);
});