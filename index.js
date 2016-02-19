var cwd = process.cwd();
var settings = require('./lib/gulpPilotSettings');
var gulpDir = cwd + '/' + settings.directory + '/';

var yargs = require('yargs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./loadConfig')(gulp, $);

/**
 * GulpPilot helps you to manage you build tasks in separate, well structured files.
 *
 * **Peer-Dependencies:** This plugins requires your package to use gulp, gulp-util and gulp-load-plugins.
 *
 * **Note:** Your default config is always in your root folder called <package.name>.conf.{js,json}
 *
 * **CLI-Options:**
 * 
 * | Flag | Description | Type |
 * | --- | --- | --- |
 * | --help | Show help | `boolean` |
 * | --config, -c | Load a config file by path - for relative paths see CWD and __dirname below | `string` |
 * | --merge-default-config, -m | Just use this flag to merge supplied config with default config | `boolean` |
 * | --ignore-default-config, -i | Just use this flag to ignore default config (no merging) | `boolean` |
 *
 * @constructor GulpPilot
 */
function GulpPilot() {}

GulpPilot.prototype = {
    constructor: GulpPilot,
    task: task,
    get: get
};

/**
 * The complete name of the task. Subtasks are separated by a colon (:).
 * @typedef {string} TaskToken
 * @example
 * 'foo'
 * 'foo:sub'
 * 'foo:sub1:sub2'
 *
 * 'foo/bar'
 * 'foo/bar:sub'
 */

/**
 * Will add a new gulp task by grabbing the task's function implementation
 * automatically from a JS file with the gulp/ folder.
 *
 * @memberOf GulpPilot#
 * @param {TaskToken} name - The name of the task.
 * @param {Array} [dependencies] - An array of task names to be executed and completed before your task will run.
 * @returns {GulpPilot} Returns itself to enable method chaining.
 * @example
 * // example folder structure:
 * //
 * // |-dist/
 * // |-node_modules/
 * // |-src/
 * // |  |-...
 * // |-gulp/
 * // |  |- foo.js
 * // |  |- bar.js
 * // |-gulpfile.js
 * // |-package.json
 * // |-README.md
 *
 * // in your gulpfile.js
 * var pilot = require('gulp-pilot');
 *
 * // will load from gulp/foo.js
 * pilot.task('foo');
 * // will load from gulp/bar.js with dependency 'foo'
 * pilot.task('bar', ['foo']);
 */
function task(name, dependencies) {
    var task = get(name);

    // add gulp task
    if(Array.isArray(dependencies)) {
        gulp.task(name, dependencies, task);
    } else {
        gulp.task(name, task);
    }

    // allow chaining
    return this;
}

/**
 * Get a task's function implementation by name.
 *
 * @memberOf GulpPilot#
 * @param {TaskToken} name - The name of the task.
 * @returns {Function} Returns the function that implements the task.
 * @example
 * // example folder structure:
 * //
 * // |-dist/
 * // |-node_modules/
 * // |-src/
 * // |  |-...
 * // |-gulp/
 * // |  |- foo.js
 * // |  |- bar.js
 * // |-gulpfile.js
 * // |-package.json
 * // |-README.md
 *
 * // in your gulpfile.js
 * var gulp = require('gulp');
 * var pilot = require('gulp-pilot');
 *
 * // will load from gulp/foo.js
 * gulp.task('foo', pilot.get('foo'));
 * // will load from gulp/bar.js with dependency 'foo'
 * gulp.task('bar', ['foo'], pilot.get('foo'));
 */
function get(name) {
    var log = $.util.log;
    var chalk = $.util.colors;
    var path;

    // split name by colon :
    name = name.split(':');

    try {
        path = gulpDir + name.shift();

        // get the task module by first item
        var task = require(path);

        // if it not exeutable -> exit
        if(typeof task !== 'function') {
            log(chalk.red('Task file does not return a factory function at: ' + chalk.magenta(path) + '!'));
            process.exit(1);
        }

        // call task factory
        task = task(gulp, $, config);

        try {
            // if type of task is a hash -> traverse path
            // if it is a function -> call it
            for (var i = 0, l = name.length; i < l; i++) {
                if (typeof task === 'function') {
                    task = task.apply(null, name);
                    break;
                }
                task = task[name.shift()];
            }
        } catch(e) {
            log(chalk.red('Can\' get task function: ' + chalk.magenta(path) + '!'));
            log(e);

            process.exit(1);
        }
    } catch(e) {
        log(chalk.red('Task file does not exist at: ' + chalk.magenta(path) + '!'));
        log(e);

        process.exit(1);
    }

    // a task always needs to be a function
    if(typeof task !== 'function') {
        log(chalk.red('Expected returned value to be a function: ' + chalk.magenta(path) + '!'));
        process.exit(1);
    }

    return task;
}

// single instance
var instance = new GulpPilot();

// export GulpPilot singleton
module.exports = instance;