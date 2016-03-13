var cwd = process.cwd();
/**
 * This callback is executed for a property path that matches.
 * It's up to you what ever initialization implementation you choose for a specific config property.
 *
 * @callback GulpPilot~InitCallback
 * @param {Object} config - The default or custom config object.
 */

/**
 * This string is the name of a NPM package which returns a `GulpPilot~InitCallback` function either directly
 * or as an object literal by init property.
 * It's name format is `"gulp-pilot-init-..."`
 *
 * So far there exist the following plugins:
 * - [Preprocess Merger](https://www.npmjs.com/package/gulp-pilot-merger-preprocess) (`"gulp-pilot-merger-preprocess"`)
 * - [Preprocess Topo Merger](https://www.npmjs.com/package/gulp-pilot-merger-preprocess-topo) (`"gulp-pilot-merger-preprocess-topo"`)
 *
 * You can also search for plugins by `gulp-pilot-init` keyword.
 * [https://www.npmjs.com/search?q=gulp-pilot-merger](https://www.npmjs.com/search?q=gulp-pilot-merger)
 *
 * @typedef {string} GulpPilot~InitPlugin
 */

/**
 * A hash of property paths who's values are functions implementing a custom initialization behavior.
 *
 * @typedef {Object.<string, (GulpPilot~InitCallback|GulpPilot~InitPlugin)>} InitHash
 * @example <caption>Custom init callback</caption>
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
 * // your pilotrc file
 * {
 *  "init": {
 *      "foo": function(config) { ... }
 *  }
 * }
 * @example <caption>Init Plugin</caption>
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
 * // your pilotrc file
 * {
 *  "init": {
 *      "foo": "gulp-pilot-init-<name of merger plugin here...>"
 *  }
 * }
 */

/**
 * This callback is executed for a property path that matches.
 * It's up to you what ever merge implementation you choose for a specific config property.
 *
 * @callback GulpPilot~MergerCallback
 * @param {Object} config - The custom config object.
 * @param {Object} defaultConfig - The default config object.
 */

/**
 * This string is the name of a NPM package which returns a `GulpPilot~MergerCallback` function either directly
 * or as an object literal by merger property.
 * It's name format is `"gulp-pilot-merger-..."`
 *
 * So far there exist the following plugins:
 * - [Preprocess Merger](https://www.npmjs.com/package/gulp-pilot-merger-preprocess) (`"gulp-pilot-merger-preprocess"`)
 * - [Preprocess Topo Merger](https://www.npmjs.com/package/gulp-pilot-merger-preprocess-topo) (`"gulp-pilot-merger-preprocess-topo"`)
 *
 * You can also search for plugins by `gulp-pilot-merger` keyword.
 * [https://www.npmjs.com/search?q=gulp-pilot-merger](https://www.npmjs.com/search?q=gulp-pilot-merger)
 *
 * @typedef {string} GulpPilot~MergerPlugin
 */

/**
 * A hash of property paths who's values are functions implementing a custom merge behavior.
 *
 * @typedef {Object.<string, (GulpPilot~MergerCallback|GulpPilot~MergerPlugin)>} MergerHash
 * @example <caption>Custom merger callback</caption>
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
 * // your pilotrc file
 * {
 *  "merger": {
 *      "foo": function(config, defaultConfig) { ... }
 *  }
 * }
 * @example <caption>Merger Plugin</caption>
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
 * // your pilotrc file
 * {
 *  "merger": {
 *      "foo": "gulp-pilot-merger-<name of merger plugin here...>"
 *  }
 * }
 */

/**
 * The default GulpPilot settings.
 *
 * **Note:** You can overwrite those with a `pilotrc` file in your root project folder.
 *
 * **Note:** Your default config is always in your root folder called <package.name>.conf.{js,json}
 *
 * @typedef {Object} GulpPilot~Settings
 * @property {string} [directory=gulp] - The directory where all gulp tasks will be implemented.
 * @property {string} [packageJSON=package.json] - The name of your projects package.json file.
 * @property {boolean} [mergeDefaultConfig=true] - Whether or not to merge custom config with your default config.
 * @property {InitHash} [init={}] - A hash of property paths who's value are functions implementing a custom initialization behavior.
 * @property {MergerHash} [merger={}] - A hash of property paths who's value are functions implementing a custom merge behavior.
 */

/**
 * @type {GulpPilot~Settings}
 */
var settings = {
    directory: 'gulp',
    packageJSON: 'package.json',
    mergeDefaultConfig: true,
    init: {},
    merger: {}
};

try {
    var customSettings = require(cwd + '/pilotrc');

    Object.assign(settings, customSettings);
} catch(e) {}

module.exports = settings;