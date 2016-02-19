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
 * @constructor
 */
function GulpPilot() {}

GulpPilot.prototype = {
    constructor: GulpPilot,
    task: task,
    get: get
};

// get task function
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