angular.module('rede')

.factory('RedeService', [
	'$resource',
	'$http',
	'$q',
	function($resource, $http, $q) {

		var apiUrl = '/api/v1';

		var measureParams;

		return {
			users: $resource(apiUrl + '/users/:id', { id: '@id' }, {
				query: {
					method: 'GET',
					isArray: false
				},
				update: {
					method: 'PUT'
				}
			}),
			sensors: $resource(apiUrl + '/sensors/:id', { id: '@id' }, {
				query: {
					method: 'GET',
					isArray: false
				},
				update: {
					method: 'PUT'
				},
				getScore: {
					url: apiUrl + '/sensors/:id/score',
					method: 'GET',
					isArray: false
				},
				subscribe: {
					url: apiUrl + '/sensors/:id/subscribe',
					method: 'POST',
					isArray: false
				},
				unsubscribe: {
					url: apiUrl + '/sensors/:id/unsubscribe',
					method: 'POST',
					isArray: false
				}
			}),
			measurements: $resource(apiUrl + '/measurements', {}, {
				query: {
					method: 'GET',
					isArray: false
				},
				update: {
					method: 'PUT'
				}
			}),
			getParameters: function() {
				var deferred = $q.defer();
				if(measureParams) {
					deferred.resolve(measureParams);
				} else {
					$http.get(apiUrl + '/parameters').success(function(data) {
						measureParams = data;
						deferred.resolve(measureParams);
					});
				}
				return deferred.promise;
			},
			geocode: function(lat, lon) {
				return $http({
					'method': 'GET',
					'url': 'http://nominatim.openstreetmap.org/reverse',
					'params': {
						'lon': lon,
						'lat': lat,
						'format': 'json',
						'address_details': 1
					}
				});
			},
			stories: $http.get('http://infoamazonia.org/?publisher=infoamazonia&posts_per_page=20&lang=pt&geojson=1'),
			data: {
				states: $http.get('http://visaguas.infoamazonia.org/api?query=estados')
			},
			sensorToGeoJSON: function(sensors) {

				var geojson = {
					type: 'FeatureCollection',
					features: []
				};
				_.each(sensors, function(sensor) {
					var feature = {type: 'Feature'};
					for(key in sensor) {
						if(key == 'geometry') {
							feature.geometry = sensor[key];
						} else {
							if(!feature.properties)
								feature.properties = {};
							feature.properties[key] = sensor[key];
						}
					}
					geojson.features.push(feature);
				});
				return geojson;
			}
		}

	}
])

.factory('RedeAuth', [
	'RedeService',
	'$q',
	'$window',
	'$cookies',
	'MessageService',
	'RedeMsgs',
	'$http',
	function(Rede, $q, $window, $cookies, Message, Msgs, $http) {

		var apiUrl = '/api/v1';

		$window.auth = '';

		try {
			$window.auth = JSON.parse($cookies.get('auth'));
		} catch(err) {
			$window.auth = false;
		}

		return {
			register: function(data) {
				var self = this;
				var deferred = $q.defer();
				Rede.users.save(data, function(user) {
					self.login({
						email: data.email,
						password: data.password
					});
					deferred.resolve(user);
				}, function(res) {
					var data = res.data;
					if(data.messages) {
						_.each(data.messages, function(msg) {
							console.log(Msgs.get(msg.text));
							Message.add(Msgs.get(msg.text));
						});
					}
					deferred.reject(data);
				});
				return deferred.promise;
			},
			login: function(credentials) {
				var self = this;
				var deferred = $q.defer();
				$http.post(apiUrl + '/login', credentials)
				.success(function(data) {
					self.setToken(data);
					deferred.resolve(data);
				})
				.error(function(data) {
					deferred.reject(data);
					if(data.messages) {
						_.each(data.messages, function(msg) {
							Message.add(Msgs.get(msg.text));
						});
					}
				});
				return deferred.promise;
			},
			logout: function() {
				var self = this;
				if(auth) {
					var deferred = $q.defer();
					$http.get(apiUrl + '/logout')
					.success(function(data) {
						self.setToken('');
						deferred.resolve(true);
					})
					.error(function() {
						self.setToken('');
						deferred.resolve(true);
					});
					return deferred.promise;
				} else {
					return false;
				}
			},
			setToken: function(data) {
				$window.auth = data;
				try {
					$cookies.put('auth', JSON.stringify(data));
				} catch(err) {
					$cookies.remove('auth');
				}
			},
			getToken: function() {
				return $window.auth;
			}
		}
	}
])

.factory('RedeMsgs', [
	function() {
		return {
			get: function(txt) {
				var msg = txt;
				switch(txt) {
					case 'mongoose.errors.areas.missing_address':
						msg = 'Você deve preencher o campo de endereço';
						break;
					case 'access_token.local.email_not_confirmed':
						msg = 'Verifique seu email para ativar sua conta.';
						break;
					case 'email_confirmed':
						msg = 'Seu email foi confirmado.';
						break;
					case 'token_expired':
						msg = 'A chave de acesso expirou.';
						break;
					case 'internal_error':
						msg = 'Ocorreu um erro interno. Pora favor, tente novamente.';
						break;
					case 'token_not_found':
						msg = 'Chave de acesso não encontrada.';
						break;
					case 'users.missing_password':
						msg = 'Preencha o campo de senha';
						break;
					case 'users.missing_email':
						msg = 'Preencha o campo de email';
						break;
				}
				return msg;
			}
		}
	}
]);
