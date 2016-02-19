var cwd = process.cwd();
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