var cwd = process.cwd() + '/';
var settings = require('./gulpPilotSettings');
var complement = require('./complement');
var yargs = require('yargs');
var argv = yargs.alias('config', 'c')
    .describe('c', 'Load a config file by path - for relative paths see CWD and __dirname below')
    .alias('merge-default-config', 'm')
    .boolean('m')
    .describe('m', 'Just use this flag to merge supplied config with default config')
    .alias('ignore-default-config', 'i')
    .boolean('i')
    .describe('i', 'Just use this flag to ignore default config (no merging)')
    .epilog('Copyright 2016 Andreas Deuschlinger (MIT Licensed)')
    .help()
    .argv;

// add usage information for initiating gulp task (utilize argv._ array for task name and $0 interpolation)
yargs.usage('Usage: $0 ' + argv._[0] + ' --config [config]');

// export config
module.exports = loadConfig;

function loadConfig(gulp, $) {
    var config;
    var defaultConfig;

    // try load custom config by --config argument
    config = loadCustomConfig($);

    defaultConfig = loadDefaultConfig($, config);

    // if no config given -> just override with default config
    if(!config) {
        config = defaultConfig;

        // init config
        initConfig(config);
    }
    // else -> merge them
    else if (defaultConfig) {
        complement(config, defaultConfig, settings.merger);
    } else {
        // init config
        initConfig(config);
    }

    return config;
}

function initConfig(config) {
    var init = settings.init;
    var keys = Object.keys(init);
    var initializer;
    var initializerType;
    var path;
    var pathKey;
    var i=0, l = keys.length;
    var j, k;
    var configObject = config;

    // loop through all initializers
    for(;i<l; i++) {
        path = keys[i];
        initializer = init[path];

        path = path.split('.');

        // traverse path to find matching property path
        // if found -> execute initializer
        for(j=0, k=path.length; j<k; j++) {
            pathKey = path[j];

            if(!(pathKey in configObject))
                break;

            if(j<k-1) {
                configObject = configObject[pathKey];
                continue;
            }

            // last run -> initialize it
            initializerType = typeof initializer;

            if(initializerType === 'function') {
                // custom initialization
                initializer(configObject);
            }
            else if(initializerType === 'string') {
                // try loading merger plugin
                try {
                    initializer = require(initializer);

                    if(typeof initializer === 'function') {
                        initializer(configObject);
                    } else {
                        initializer.init(configObject);
                    }
                } catch(e) {
                    console.log(chalk.red('FAILED loading init plugin: "') +
                        chalk.magenta(init[path.join('.')]) +
                        chalk.red('" for "') +
                        chalk.magenta(pathKey) +
                        chalk.red('"'));
                    console.log(e);
                    process.exit(1);
                }
            }
        }
    }
}

function loadCustomConfig($) {
    var path;
    var config;
    var log = $.util.log;
    var chalk = $.util.colors;

    // try load config by --config argument
    if(argv.config) {
        try {
            path = argv.config;
            config = require(path);
        } catch(e) {
            // if not found try in root dir of project
            try {
                path = cwd + argv.config;
                config = require(path);
            } catch(e) {
                yargs.showHelp();

                log(chalk.red('Can\'t find ' + chalk.magenta(path) + '! Please make sure that your path is correct.'));

                log(chalk.yellow('CWD: ') + chalk.magenta(process.cwd()));
                log(chalk.yellow('__dirname: ') + chalk.magenta(__dirname));

                log(e);

                process.exit(1);
            }
        }

        log(chalk.green('Load custom config from: ' + chalk.magenta( path )));
    }

    return config;
}

function loadDefaultConfig($, config) {
    var path;
    var log = $.util.log;
    var chalk = $.util.colors;
    var packageJson;
    var defaultConfig;
    var forceMerge = argv.m || (settings.mergeDefaultConfig) && !argv.i;

    // get default config by package.json name property
    if(!config || forceMerge) {
        try {
            packageJson = require(cwd + settings.packageJSON);

            try {
                path = cwd + packageJson.name + '.conf';
                defaultConfig = require(path);
            } catch(e) {
                log(chalk.red('You have no default config file! Expected ' + chalk.magenta(path + '.(json|js)') + ' in root directory of the package.'));
                log(e);

                // if we have a config and merge is true -> exit
                // else config is not a must
                if(config && forceMerge)
                    process.exit(1);
            }
        } catch(e) {
            log(chalk.red('Can\'t find package.json file! No config loaded'));
            log(e);

            // if we have a config and merge is true -> exit
            // else config is not a must
            if(config && forceMerge)
                process.exit(1);
        }

        log(chalk.green('Load default config from: ' + chalk.magenta( path )));
    }

    return defaultConfig;
}