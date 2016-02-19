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
    .epilog('copyright 2016')
    .argv;

// add usage information for initiating gulp task (utilize argv._ array for task name and $0 interpolation)
yargs.usage('Usage: $0 ' + argv._[0] + ' --config [config]');

// export config
module.exports = loadConfig;

function loadConfig(gulp, $) {
    var path;
    var config;
    var defaultConfig;
    var log = $.util.log;
    var chalk = $.util.colors;

    // try load custom config by --config argument
    config = loadCustomConfig();

    defaultConfig = loadDefaultConfig(config);

    // if no config given -> just override with default config
    if(!config) {
        config = defaultConfig;
    }
    // else -> merge them
    else if (defaultConfig) {
        complement(config, defaultConfig, settings.merger);
    }

    return config;
}

function loadCustomConfig() {
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

function loadDefaultConfig(config) {
    var path;
    var log = $.util.log;
    var chalk = $.util.colors;
    var packageJson;
    var defaultConfig;

    // get default config by package.json name property
    if(!config || argv.m || (settings.mergeDefaultConfig) && !argv.i) {
        try {
            packageJson = require(cwd + settings.packageJSON);

            try {
                path = cwd + packageJson.name + '.conf';
                defaultConfig = require(path);
            } catch(e) {
                log(chalk.red('You have no default config file! Expected ' + chalk.magenta(path + '.(json|js)') + ' in root directory of the package.'));
                log(e);

                process.exit(1);
            }
        } catch(e) {
            log(chalk.red('Can\'t find package.json file! No config loaded'));
            log(e);

            process.exit(1);
        }

        log(chalk.green('Load default config from: ' + chalk.magenta( path )));
    }

    return defaultConfig;
}