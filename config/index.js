
var apiPrefix = '/api/v1';
var path = require('path');
var rootPath = path.resolve(__dirname + '../..');
var parameters = {
  "PM10": {
    "_id": "PM10",
    "name": {
      "en": "Particulate matter 10 µm or less",
      "pt": "Material particulado até 10 µm"
    },
    "abbreviations": ["PM10"],
    "defaultUnit": "µg/m3"
  },
  "PM25": {
    "_id": "PM25",
    "name": {
      "en": "Particulate matter 2.5 µm or less",
      "pt": "Material particulado até 2,5 µm"
    },
    "abbreviations": ["PM25"],
    "defaultUnit": "µg/m3"
  },
  "atmospheric_pressure": {
    "_id": "atmospheric_pressure",
    "name": {
        "en": "Atmospheric pressure",
        "pt": "Pressão atmosférica",
    },
    "abbreviations": ["AP"],
    "defaultUnit": "Pa",
    "wikipedia": "https://en.wikipedia.org/wiki/Atmospheric_pressure"
  },
  "electrical_conductivity": {
    "_id": "electrical_conductivity",
    "name": {
      "en": "Electrical conductivity",
      "pt": "Condutividade elétrica",
    },
    "abbreviations": ["EC"],
    "defaultUnit": "S/m",
    "wikipedia": "https://en.wikipedia.org/wiki/Electrical_resistivity_and_conductivity",
    "qualityWeight": 0.09
  },
  "ph": {
    "_id": "ph",
    "name": {
      "en": "pH",
      "pt": "pH"
    },
    "abbreviations": ["pH"],
    "wikipedia": "https://en.wikipedia.org/wiki/PH",
    "qualityWeight": 0.11
  },
  "oxi-reduction_potential": {
    "_id": "oxi-reduction_potential",
    "name": {
      "en": "Oxi-reduction potential",
      "pt": "Potencial de oxi-redução"
    },
    "abbreviations": ["ORP"],
    "defaultUnit": "V",
    "wikipedia": "https://en.wikipedia.org/wiki/Reduction_potential",
    "qualityWeight": 0.08
  },
  "water_temperature": {
    "_id": "water_temperature",
    "name": {
      "en": "Water temperature",
      "pt": "Temperatura da água"
    },
    "abbreviations": ["Tw"],
    "defaultUnit": "C",
    "qualityWeight": 0.10
  },
  "equipment_temperature": {
    "_id": "equipment_temperature",
    "name": {
      "en": "Equipment temperature",
      "pt": "Temperatura do equipamento"
    },
    "abbreviations": ["Ta"],
    "defaultUnit": "C"
  }
};

/**
* Expose config
*/

module.exports = {
	development: {
		rootPath: rootPath,
		apiPrefix: apiPrefix,
		parameters: parameters,
		db: 'mongodb://localhost/rede_dev'
	},
	test: {
		rootPath: rootPath,
		apiPrefix: apiPrefix,
		parameters: parameters,
		db: 'mongodb://localhost/rede_test'
	},
	production: {
		rootPath: rootPath,
		apiPrefix: apiPrefix,
		parameters: parameters,
		db: process.env.MONGO_URI || 'mongodb://localhost/rede_production'
	}
}
