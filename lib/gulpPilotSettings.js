var cwd = process.cwd();
/**
 * This callback is executed for a property path that matches.
 * It's up to you what ever merge implementation you choose for a specific config property.
 *
 * @callback GulpPilot~MergerCallback
 * @param {Object} config - The custom config object.
 * @param {Object} defaultConfig - The default config object.
 */

/**
 * A hash of property paths who's values are functions implementing a custom merge behavior.
 *
 * @typedef {Object.<string, GulpPilot~MergerCallback>} MergerHash
 * @example
 * // your default config => <package.name>.conf.{js,json}
 * {
 *  "foo": {
 *      "a": 1,
 *      "b": 2
 *  },
 *  "bar": "baz"
 * }
 *
 * // custom config
 * {
 *  "foo": {
 *      "b": 4
 *  }
 * }
 *
 * // your .pilotrc file
 * {
 *  "merger": {
 *      "foo": function(config, defaultConfig) { ... }
 *  }
 * }
 */

/**
 * The default GulpPilot settings.
 *
 * You can overwrite those with a .pilotrc file in your root project folder.
 *
 * **Note:** Your default config is always in your root folder called <package.name>.conf.{js,json}
 *
 * @typedef {Object} GulpPilot~Settings
 * @property {string} [directory=gulp] - The directory where all gulp tasks will be implemented.
 * @property {string} [packageJSON=package.json] - The name of your projects package.json file.
 * @property {boolean} [mergeDefaultConfig=true] - Whether or not to merge custom config with your default config.
 * @property {MergerHash} [merger={}] - A hash of property paths who's value are functions implementing a custom merge behavior.
 */

/**
 * @type {GulpPilot~Settings}
 */
var settings = {
    directory: 'gulp',
    packageJSON: 'package.json',
    mergeDefaultConfig: true,
    merger: {}
};

try {
    var customSettings = require(cwd + '/.pilotrc');

    Object.assign(settings, customSettings);
} catch(e) {}

module.exports = settings;