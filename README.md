# Installation

Install `gulp-pilot` as a development dependency:

```shell
npm install --save-dev gulp-pilot
```

# Usage

After you have installed this plugin you can utilize it in your gulpfile.js.

Basically tasks are just javascript modules, though you can also group tasks
and have multiple tasks defined in one module (subtasks).

Let's assume the following folder structure:

|-- dist/
|-- node_modules/
|-- src/
    |-- ...
|-- gulp/
    |-- foo.js
    |-- bar.js
|-- gulpfile.js
|-- package.json
|-- README.md

## Task implementation factories

Those are just functions you would export out of your module, who return a function that implements the task.
Each factory gets invoked with *3 parameters*:

- gulp - The gulp instance
- $ - The gulp-load-plugins instance hash.
- [config] - The default config, a specified config, or a merged version of both (optional).

> gulp/foo.js

````javascript
module.exports = function(gulp, $, config) {
    return function() {
        return gulp.src('Yours glob pattern here')
            .pipe('...')
            .pipe(gulp.dest('your path here');
    };
}
````

> gulp/bar.js

````javascript
module.exports = function(gulp, $, config) {
    return function() {
        return gulp.src('Another glob pattern here')
            .pipe('...')
            .pipe(gulp.dest('Another path here');
    };
}
````

> gulpfile.js

````javascript
var gulp = require('gulp');
var pilot = require('gulp-pilot');

pilot.task('foo');

pilot.task('bar', ['foo'])
````


## Subtasks

Those are just functions you would export out of your module, who return plain object literals.
Who's Properties represent one subtask's implementation.

Each subtask is selected by the color (:) delimiter in your name, e.g. `"filename:subtask"`.
Nesting is possible like `"filename:namespace:subtask"`.

Even paths are supported, like `"path/filename"`, `"path/filename:subtask"` or `"path/filename:namespace:subtask"`

> gulp/foo.js

````javascript
module.exports = function(gulp, $, config) {
    return {
        sub1: function() {
            return gulp.src('Yours glob pattern here')
                .pipe('...')
                .pipe(gulp.dest('your path here');
        },

        sub2: function() {
            return gulp.src('Yours glob pattern here')
                .pipe('...')
                .pipe(gulp.dest('your path here');
        }
    };
}
````

> gulp/bar.js

````javascript
module.exports = function(gulp, $, config) {
    return function() {
        gulp.src('Another glob pattern here')
            .pipe('...')
            .pipe(gulp.dest('Another path here');
    };
}
````

> gulpfile.js

````javascript
var gulp = require('gulp');
var pilot = require('gulp-pilot');

pilot.task('foo:sub1');
pilot.task('foo:sub2');

gulp.task('foo', ['foo:sub1', 'foo:sub2']]);

pilot.task('bar', ['foo'])
````

# API Documentation
## Classes

<dl>
<dt><a href="#GulpPilot">GulpPilot</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#settings">settings</a> : <code><a href="#GulpPilot..Settings">Settings</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TaskToken">TaskToken</a> : <code>string</code></dt>
<dd><p>The complete name of the task. Subtasks are separated by a colon (:).</p>
</dd>
<dt><a href="#MergerHash">MergerHash</a> : <code>Object.&lt;string, GulpPilot~MergerCallback&gt;</code></dt>
<dd><p>A hash of property paths who&#39;s values are functions implementing a custom merge behavior.</p>
</dd>
</dl>

<a name="GulpPilot"></a>
## GulpPilot
**Kind**: global class  

* [GulpPilot](#GulpPilot)
    * [new GulpPilot()](#new_GulpPilot_new)
    * _instance_
        * [.task(name, [dependencies])](#GulpPilot+task) ⇒ <code>[GulpPilot](#GulpPilot)</code>
        * [.get(name)](#GulpPilot+get) ⇒ <code>function</code>
    * _inner_
        * [~MergerCallback](#GulpPilot..MergerCallback) : <code>function</code>
        * [~Settings](#GulpPilot..Settings) : <code>Object</code>

<a name="new_GulpPilot_new"></a>
### new GulpPilot()
GulpPilot helps you to manage you build tasks in separate, well structured files.

**Usage:** Every task's factory function is invoked with the following 3 parameters:
- gulp - The gulp instance
- $ - The gulp-load-plugins instance hash.
- [config] - The default config, a specified config, or a merged version of both (optional).

**Peer-Dependencies:** This plugins requires your package to use gulp, gulp-util and gulp-load-plugins.

**Note:** Your default config is always in your root folder called <package.name>.conf.{js,json}

**CLI-Options:**

| Flag | Description | Type |
| --- | --- | --- |
| --help | Show help | `boolean` |
| --config, -c | Load a config file by path - for relative paths see CWD and __dirname below | `string` |
| --merge-default-config, -m | Just use this flag to merge supplied config with default config | `boolean` |
| --ignore-default-config, -i | Just use this flag to ignore default config (no merging) | `boolean` |

<a name="GulpPilot+task"></a>
### gulpPilot.task(name, [dependencies]) ⇒ <code>[GulpPilot](#GulpPilot)</code>
Will add a new gulp task by grabbing the task's function implementation
automatically from a JS file with the gulp/ folder.

**Kind**: instance method of <code>[GulpPilot](#GulpPilot)</code>  
**Returns**: <code>[GulpPilot](#GulpPilot)</code> - Returns itself to enable method chaining.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>[TaskToken](#TaskToken)</code> | The name of the task. |
| [dependencies] | <code>Array</code> | An array of task names to be executed and completed before your task will run. |

**Example** *(Utilizing task factories)*  
```js

// example folder structure:
//
// |-dist/
// |-node_modules/
// |-src/
// |  |-...
// |-gulp/
// |  |- foo.js
// |  |- bar.js
// |-gulpfile.js
// |-package.json
// |-README.md

// in your gulpfile.js
var pilot = require('gulp-pilot');

// will load from gulp/foo.js
pilot.task('foo');
// will load from gulp/bar.js with dependency 'foo'
pilot.task('bar', ['foo']);
```
**Example** *(Utilizing sub tasks)*  
```js

// in your gulpfile.js
var pilot = require('gulp-pilot');

// will load from gulp/foo.js
pilot.task('foo:sub');
// will load from gulp/bar.js with dependency 'foo:sub'
pilot.task('bar', ['foo:sub']);
```
<a name="GulpPilot+get"></a>
### gulpPilot.get(name) ⇒ <code>function</code>
Get a task's function implementation by name.

**Note:** This is handy if you want your task name being different from your implementation factory file.

**Important:** If you supply a deeper subtask nesting than you object literal return by your factory can handle,
your task implementing function will have the rest of name applied as it's arguments.

**Kind**: instance method of <code>[GulpPilot](#GulpPilot)</code>  
**Returns**: <code>function</code> - Returns the function that implements the task.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>[TaskToken](#TaskToken)</code> | The name of the task. |

**Example** *(Utilizing task factories)*  
```js

// example folder structure:
//
// |-dist/
// |-node_modules/
// |-src/
// |  |-...
// |-gulp/
// |  |- foo.js
// |  |- bar.js
// |-gulpfile.js
// |-package.json
// |-README.md

// in your gulpfile.js
var gulp = require('gulp');
var pilot = require('gulp-pilot');

// will load from gulp/foo.js
gulp.task('foo', pilot.get('foo'));
// will load from gulp/bar.js with dependency 'foo'
gulp.task('bar', ['foo'], pilot.get('bar'));
```
**Example** *(Utilizing sub tasks)*  
```js

// in your gulpfile.js
var gulp = require('gulp');
var pilot = require('gulp-pilot');

// will load from gulp/foo.js
gulp.task('foo', pilot.get('foo:sub'));
// will load from gulp/bar.js with dependency 'foo'
gulp.task('bar', ['foo'], pilot.get('bar'));
```
<a name="GulpPilot..MergerCallback"></a>
### GulpPilot~MergerCallback : <code>function</code>
This callback is executed for a property path that matches.
It's up to you what ever merge implementation you choose for a specific config property.

**Kind**: inner typedef of <code>[GulpPilot](#GulpPilot)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The custom config object. |
| defaultConfig | <code>Object</code> | The default config object. |

<a name="GulpPilot..Settings"></a>
### GulpPilot~Settings : <code>Object</code>
The default GulpPilot settings.

**Note:** You can overwrite those with a .pilotrc file in your root project folder.

**Note:** Your default config is always in your root folder called <package.name>.conf.{js,json}

**Kind**: inner typedef of <code>[GulpPilot](#GulpPilot)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| directory | <code>string</code> | <code>&quot;gulp&quot;</code> | The directory where all gulp tasks will be implemented. |
| packageJSON | <code>string</code> | <code>&quot;package.json&quot;</code> | The name of your projects package.json file. |
| mergeDefaultConfig | <code>boolean</code> | <code>true</code> | Whether or not to merge custom config with your default config. |
| merger | <code>[MergerHash](#MergerHash)</code> | <code>{}</code> | A hash of property paths who's value are functions implementing a custom merge behavior. |

<a name="settings"></a>
## settings : <code>[Settings](#GulpPilot..Settings)</code>
**Kind**: global variable  
<a name="TaskToken"></a>
## TaskToken : <code>string</code>
The complete name of the task. Subtasks are separated by a colon (:).

**Kind**: global typedef  
**Example**  
```js
'foo'
'filename:subtask'
'filename:namespace:subtask'

'path/bar'
'path/filename:subtask'
```
<a name="MergerHash"></a>
## MergerHash : <code>Object.&lt;string, GulpPilot~MergerCallback&gt;</code>
A hash of property paths who's values are functions implementing a custom merge behavior.

**Kind**: global typedef  
**Example**  
```js
// your default config => <package.name>.conf.{js,json}
{
 "foo": {
     "a": 1,
     "b": 2
 },
 "bar": "baz"
}

// custom config
{
 "foo": {
     "b": 4
 }
}

// your .pilotrc file
{
 "merger": {
     "foo": function(config, defaultConfig) { ... }
 }
}
```
