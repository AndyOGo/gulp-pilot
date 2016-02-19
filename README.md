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

**Example**  
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
<a name="GulpPilot+get"></a>
### gulpPilot.get(name) ⇒ <code>function</code>
Get a task's function implementation by name.

**Kind**: instance method of <code>[GulpPilot](#GulpPilot)</code>  
**Returns**: <code>function</code> - Returns the function that implements the task.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>[TaskToken](#TaskToken)</code> | The name of the task. |

**Example**  
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
gulp.task('bar', ['foo'], pilot.get('foo'));
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

You can overwrite those with a .pilotrc file in your root project folder.

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
'foo:sub'
'foo:sub1:sub2'

'foo/bar'
'foo/bar:sub'
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
