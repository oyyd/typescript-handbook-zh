#Modules
This post outlines the various ways to organize your code using modules in TypeScript. We'll be covering internal and external modules and we'll discuss when each is appropriate and how to use them. We'll also go over some advanced topics of how to use external modules, and address some common pitfalls when using modules in TypeScript.
本部分将概述在TypeScript中，用模块来组织代码的各种方式。内容不仅会覆盖内部模块和外部模块，我们还将讨论每种方式应当在何时使用以及如何使用。同时我们也会对如何使用外部模块，以及在TypeScript中使用模块可能会产生的隐患等进阶话题进行讨论。

###First steps
Let's start with the program we'll be using as our example throughout this page. We've written a small set of simplistic string validators, like you might use when checking a user's input on a form in a webpage or checking the format of an externally-provided data file.
首先让我们从下面这个会被我们通篇使用的程序讲起。我们已经写了一些最简单的字符串验证方法，你平时可能也会用这类方法来检查用户在网页表单上的输入，或是用来检查外部提供的数据的格式。

**Validators in a single file**

```js
interface StringValidator {
    isAcceptable(s: string): boolean;
}

var lettersRegexp = /^[A-Za-z]+$/;
var numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}

class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

// Some samples to try
var strings = ['Hello', '98052', '101'];
// Validators to use
var validators: { [s: string]: StringValidator; } = {};
validators['ZIP code'] = new ZipCodeValidator();
validators['Letters only'] = new LettersOnlyValidator();
// Show whether each string passed each validator
strings.forEach(s => {
    for (var name in validators) {
        console.log('"' + s + '" ' + (validators[name].isAcceptable(s) ? ' matches ' : ' does not match ') + name);
    }
});
```

###Adding Modularity
As we add more validators, we're going to want to have some kind of organization scheme so that we can keep track of our types and not worry about name collisions with other objects. Instead of putting lots of different names into the global namespace, let's wrap up our objects into a module.
当我们添加验证方法时，我们会想要有某种组织我们的代码的方式，好让我们能够追踪我们创建的类型，同时也不用担心与其他对象在命名上有冲突。我们将把我们的对象包裹进一个模块中，而非将它们放在全局环境，取一堆不同的名字。

In this example, we've moved all the Validator-related types into a module called Validation. Because we want the interfaces and classes here to be visible outside the module, we preface them with export. Conversely, the variables lettersRegexp and numberRegexp are implementation details, so they are left unexported and will not be visible to code outside the module. In the test code at the bottom of the file, we now need to qualify the names of the types when used outside the module, e.g. Validation.LettersOnlyValidator.
在这个例子中，我们已经把所有和验证相关的类型都放进了一个称做'Validation'的模块中。为了让这里的接口和类在模块外部也是可见的，我们将export它们。相反的，变量'lettersRegexp'和'numberRegexp'都是验证实现的细节部分，我们将保持它们的非输出的状态，使其在外部不可见。在文件最后的测试代码中，我们在这个模块的外部测试了模块输出的变量和类型，如：Validation.LettersOnlyValidator。

**Modularized Validators**

```js
module Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    var lettersRegexp = /^[A-Za-z]+$/;
    var numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

// Some samples to try
var strings = ['Hello', '98052', '101'];
// Validators to use
var validators: { [s: string]: Validation.StringValidator; } = {};
validators['ZIP code'] = new Validation.ZipCodeValidator();
validators['Letters only'] = new Validation.LettersOnlyValidator();
// Show whether each string passed each validator
strings.forEach(s => {
    for (var name in validators) {
        console.log('"' + s + '" ' + (validators[name].isAcceptable(s) ? ' matches ' : ' does not match ') + name);
    }
});
```

##分割成多个文件(Splitting Across Files)
As our application grows, we'll want to split the code across multiple files to make it easier to maintain.
当我们的应用变大时，我们会想要将代码分割成多个文件，好使其更容易维护。

Here, we've split our Validation module across many files. Even though the files are separate, they can each contribute to the same module and can be consumed as if they were all defined in one place. Because there are dependencies between files, we've added reference tags to tell the compiler about the relationships between the files. Our test code is otherwise unchanged.
在这里，我们将验证模块分成了多个文件。尽管这些文件是分散开的，但他们都会像是定义在同一个地方上的代码一样，作用于同一个模块中。因为这些文件之间互有依赖关系，所以我们添加了引用标签来告诉编译器不同文件之间的关系。测试代码没有变化。

###Multi-file internal modules
**Validation.ts**

```js
module Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
```
**LettersOnlyValidator.ts**

```js
/// <reference path="Validation.ts" />
module Validation {
    var lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```

**ZipCodeValidator.ts**

```js
/// <reference path="Validation.ts" />
module Validation {
    var numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```

**Test.ts**

```js
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
var strings = ['Hello', '98052', '101'];
// Validators to use
var validators: { [s: string]: Validation.StringValidator; } = {};
validators['ZIP code'] = new Validation.ZipCodeValidator();
validators['Letters only'] = new Validation.LettersOnlyValidator();
// Show whether each string passed each validator
strings.forEach(s => {
    for (var name in validators) {
        console.log('"' + s + '" ' + (validators[name].isAcceptable(s) ? ' matches ' : ' does not match ') + name);
    }
});
```

Once there are multiple files involved, we'll need to make sure all of the compiled code gets loaded. There are two ways of doing this.
当项目有多个文件参与进来时，我们就必须保证所有被编译后的代码都能被加载进来。我们有两种方法来实现这一点。

First, we can use concatenated output using the --out flag to compile all of the input files into a single JavaScript output file:
第一中方法是通过--out flag来将所有输入的文件内容连接起来，并将结果输出到单个JavaScript文件中：


```
tsc --out sample.js Test.ts
```

The compiler will automatically order the output file based on the reference tags present in the files. You can also specify each file individually:
编译器将会根据出现在文件中的引用标签自动地排序输出文件中的内容。而你也可以手动指定每个文件的顺序：

```
tsc --out sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

Alternatively, we can use per-file compilation (the default) to emit one JavaScript file for each input file. If multiple JS files get produced, we'll need to use <script> tags on our webpage to load each emitted file in the appropriate order, for example:
另外，我们也可以使用每个文件分别输出的编译方式（这是默认选项）。生成多个JS文件以后，我们需要在网页上用<script>标签按恰当的顺序加载每个文件，像是下面的例子：

**MyTestPage.html (excerpt)**

```html
    <script src="Validation.js" type="text/javascript" />
    <script src="LettersOnlyValidator.js" type="text/javascript" />
    <script src="ZipCodeValidator.js" type="text/javascript" />
    <script src="Test.js" type="text/javascript" />
```

##Going External

TypeScript also has the concept of an external module. External modules are used in two cases: node.js and require.js. Applications not using node.js or require.js do not need to use external modules and can best be organized using the internal module concept outlined above.
TypeScript同样也有外部模块的概念。我们会在node.js和require.js的中使用到外部文件。而不使用node.js和require.js的应用则不需要使用外部模块，前面讲述过的内部模块的概念就能够很好地组织起我们的应用。

In external modules, relationships between files are specified in terms of imports and exports at the file level. In TypeScript, any file containing a top-level import or export is considered an external module.
在外部模块中，文件之间的关系是通过文件级别的输入和输出来指定的。在TypeSciprt中，任何包含顶级import和export的文件都被认为是外部模块。

Below, we have converted the previous example to use external modules. Notice that we no longer use the module keyword – the files themselves constitute a module and are identified by their filenames.
下面的例子中，我们将前面的例子转换成了使用外部模块的形式。注意这里我们不再使用module关键字，文件本身就构成了一个模块，并由它们的文件名进行定义。

The reference tags have been replaced with import statements that specify the dependencies between modules. The import statement has two parts: the name that the module will be known by in this file, and the require keyword that specifies the path to the required module:
引用标签被指定了依赖的import声明所替代。引用标签由两部分构成：这个模块在这个文件中的名称和用来指定依赖文件路径的require关键字部分。

```js
import someMod = require('someModule');
```

We specify which objects are visible outside the module by using the export keyword on a top-level declaration, similarly to how export defined the public surface area of an internal module.
与我们是如何用export定义一个内部模块的公共部分相似，这里我们在顶级声明上用export关键字来指定哪些对象是外部可见的。

To compile, we must specify a module target on the command line. For node.js, use --module commonjs; for require.js, use --module amd. For example:
编译时，我们必须在命令行上指定一个模块。对于node.js来说，要用 --module commonjs；对于require.js来说，要用--module amd。来看下面的例子：

```
tsc --module commonjs Test.ts
```

When compiled, each external module will become a separate .js file. Similar to reference tags, the compiler will follow import statements to compile dependent files.
编译以后，每个外部模块都会变成一个分离的.js文件。和引用标签相似，编译器会根据import声明来编译相互依赖的文件。

**Validation.ts**

```js
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```


**LettersOnlyValidator.ts**

```js
import validation = require('./Validation');
var lettersRegexp = /^[A-Za-z]+$/;
export class LettersOnlyValidator implements validation.StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}
```

**ZipCodeValidator.ts**

```js
import validation = require('./Validation');
var numberRegexp = /^[0-9]+$/;
export class ZipCodeValidator implements validation.StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
```

**Test.ts**

```js
import validation = require('./Validation');
import zip = require('./ZipCodeValidator');
import letters = require('./LettersOnlyValidator');

// Some samples to try
var strings = ['Hello', '98052', '101'];
// Validators to use
var validators: { [s: string]: validation.StringValidator; } = {};
validators['ZIP code'] = new zip.ZipCodeValidator();
validators['Letters only'] = new letters.LettersOnlyValidator();
// Show whether each string passed each validator
strings.forEach(s => {
    for (var name in validators) {
        console.log('"' + s + '" ' + (validators[name].isAcceptable(s) ? ' matches ' : ' does not match ') + name);
    }
});
```

###Code Generation for External Modules
Depending on the module target specified during compilation, the compiler will generate appropriate code for either node.js (commonjs) or require.js (AMD) module-loading systems. For more information on what the define and require calls in the generated code do, consult the documentation for each module loader.
编译器会根据编译时指定的模块，而为node.js (commonjs)或require.js (AMD)生成合适的，用于模块加载系统的代码。如果想要了解更多这些生成的，用于定义和依赖的代码到底做了什么的话，你可以查看每个模块加载器的文档。

This simple example shows how the names used during importing and exporting get translated into the module loading code.
下面这个例子展示了在import和export阶段所使用的名称是如何被翻译成其他模块加载其的代码的。

**SimpleModule.ts**

```js
import m = require('mod');
export var t = m.something + 1;
```

**AMD / RequireJS SimpleModule.js:**

```js
define(["require", "exports", 'mod'], function(require, exports, m) {
    exports.t = m.something + 1;
});
```


**CommonJS / Node SimpleModule.js:**

```js
var m = require('mod');
exports.t = m.something + 1;
```

##Export =
In the previous example, when we consumed each validator, each module only exported one value. In cases like this, it's cumbersome to work with these symbols through their qualified name when a single identifier would do just as well.
在前面的例子中，每次我们输出一个validator时，每个模块都只暴露出一个值。而实际上对于这种一个模块只要输出一个值情况，这样的做法是十分笨重的。

The export = syntax specifies a single object that is exported from the module. This can be a class, interface, module, function, or enum. When imported, the exported symbol is consumed directly and is not qualified by any name.
"export ="的句法可以指定一个模块要输出的一个对象。这个对象可以是个类，也可以是接口，模块，函数或是枚举类型。而当这个模块被输入时，模块输出的内容就可以被直接使用，而不需要再加上任何（模块）名称。

Below, we've simplified the Validator implementations to only export a single object from each module using the export = syntax. This simplifies the consumption code – instead of referring to 'zip.ZipCodeValidator', we can simply refer to 'zipValidator'.
下面的例子中，我们用"export ="句法简化了前面Validator的实现，每个模块只会输出一个对象。这样的做法简化了使用模块的代码——我们可以直接引用'zipValidator'而不需要用'zip.ZipCodeValidator'。

**Validation.ts**

```js
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```


**LettersOnlyValidator.ts**

```js
import validation = require('./Validation');
var lettersRegexp = /^[A-Za-z]+$/;
class LettersOnlyValidator implements validation.StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}
export = LettersOnlyValidator;
```

**ZipCodeValidator.ts**

```js
import validation = require('./Validation');
var numberRegexp = /^[0-9]+$/;
class ZipCodeValidator implements validation.StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export = ZipCodeValidator;
```

**Test.ts**

```js
import validation = require('./Validation');
import zipValidator = require('./ZipCodeValidator');
import lettersValidator = require('./LettersOnlyValidator');

// Some samples to try
var strings = ['Hello', '98052', '101'];
// Validators to use
var validators: { [s: string]: validation.StringValidator; } = {};
validators['ZIP code'] = new zipValidator();
validators['Letters only'] = new lettersValidator();
// Show whether each string passed each validator
strings.forEach(s => {
    for (var name in validators) {
        console.log('"' + s + '" ' + (validators[name].isAcceptable(s) ? ' matches ' : ' does not match ') + name);
    }
});
```

##Alias
Another way that you can simplify working with either kind of module is to use import q = x.y.z to create shorter names for commonly-used objects. Not to be confused with the import x = require('name') syntax used to load external modules, this syntax simply creates an alias for the specified symbol. You can use these sorts of imports (commonly referred to as aliases) for any kind of identifier, including objects created from external module imports.
另一种用模块简化我们工作的方式是用"import q = x.y.z"来为对象创建短一些的名称。"import q = x.y.z"和用于加载外部模块的"import x = require('name')"是不一样的，它只会为指定的符号创建一个别名。我们可以将这类import（通常只是被引用作为别名）用于任何类型标识符上，包括从外部模块的输入中创建的对象。

**Basic Aliasing**

```js
module Shapes {
    export module Polygons {
        export class Triangle { }
        export class Square { }
    }
}

import polygons = Shapes.Polygons;
var sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
```

Notice that we don't use the require keyword; instead we assign directly from the qualified name of the symbol we're importing. This is similar to using var, but also works on the type and namespace meanings of the imported symbol. Importantly, for values, import is a distinct reference from the original symbol, so changes to an aliased var will not be reflected in the original variable.
注意我们不使用require关键字，而是直接赋值为我们输入的限定名的符号。这和变量的使用方式相似，但它同时也对数据类型以及起命名空间作用的输入符号起作用。

##Optional Module Loading and Other Advanced Loading Scenarios
In some cases, you may want to only load a module under some conditions. In TypeScript, we can use the pattern shown below to implement this and other advanced loading scenarios to directly invoke the module loaders without losing type safety.
在某些场景下，你可能需要在某些条件成立的情况下再加载某一个模块。在TypeScript中，我们可以用后面展示的方式，在保障数据类型保持安全的前提下，直接触发模块加载器，以满足这种需求及其他特殊的模块加载场景。

The compiler detects whether each module is used in the emitted JavaScript. For modules that are only used as part of the type system, no require calls are emitted. This culling of unused references is a good performance optimization, and also allows for optional loading of those modules.
编译器会检测在生成的JavaScript中，是否每个模块都被用到了。对于那些只会作用于类型系统的模块来说，我们并不需要调用require。这种挑选出未被使用的引用的做法对性能大有脾益，并且也允许我们加载这些可选的模块（?）。

The core idea of the pattern is that the import id = require('...') statement gives us access to the types exposed by the external module. The module loader is invoked (through require) dynamically, as shown in the if blocks below. This leverages the reference-culling optimization so that the module is only loaded when needed. For this pattern to work, it's important that the symbol defined via import is only used in type positions (i.e. never in a position that would be emitted into the JavaScript).
这一模式的核心思想在于用import id = require('...')获取外部模块暴露出来的类型。就像下面的if语句块那样，模块加载器会被（require）动态触发/


To maintain type safety, we can use the typeof keyword. The typeof keyword, when used in a type position, produces the type of a value, in this case the type of the external module.

**Dynamic Module Loading in node.js**

```js
declare var require;
import Zip = require('./ZipCodeValidator');
if (needZipValidation) {
    var x: typeof Zip = require('./ZipCodeValidator');
    if (x.isAcceptable('.....')) { /* ... */ }
}
```

**Sample: Dynamic Module Loading in require.js**

```js
declare var require;
import Zip = require('./ZipCodeValidator');
if (needZipValidation) {
    require(['./ZipCodeValidator'], (x: typeof Zip) => {
        if (x.isAcceptable('...')) { /* ... */ }
    });
}
```

##Working with Other JavaScript Libraries
To describe the shape of libraries not written in TypeScript, we need to declare the API that the library exposes. Because most JavaScript libraries expose only a few top-level objects, modules are a good way to represent them. We call declarations that don't define an implementation "ambient". Typically these are defined in .d.ts files. If you're familiar with C/C++, you can think of these as .h files or 'extern'. Let's look at a few examples with both internal and external examples.

###Ambient Internal Modules
The popular library D3 defines its functionality in a global object called 'D3'. Because this library is loaded through a script tag (instead of a module loader), its declaration uses internal modules to define its shape. For the TypeScript compiler to see this shape, we use an ambient internal module declaration. For example:

**D3.d.ts (simplified excerpt)**

```js
declare module D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        };
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}

declare var d3: D3.Base;
```

###Ambient External Modules
In node.js, most tasks are accomplished by loading one or more modules. We could define each module in its own .d.ts file with top-level export declarations, but it's more convenient to write them as one larger .d.ts file. To do so, we use the quoted name of the module, which will be available to a later import. For example:

**node.d.ts (simplified excerpt)**

```js
declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export var sep: string;
}
```

Now we can /// <reference> node.d.ts and then load the modules using e.g. import url = require('url');.

```js
///<reference path="node.d.ts"/>
import url = require("url");
var myUrl = url.parse("http://www.typescriptlang.org");
```


##Pitfalls of Modules
In this section we'll describe various common pitfalls in using internal and external modules, and how to avoid them.
###/// <reference> to an external module
A common mistake is to try to use the /// <reference> syntax to refer to an external module file, rather than using import. To understand the distinction, we first need to understand the three ways that the compiler can locate the type information for an external module.

The first is by finding a .ts file named by an import x = require(...); declaration. That file should be an implementation file with top-level import or export declarations.

The second is by finding a .d.ts file, similar to above, except that instead of being an implementation file, it's a declaration file (also with top-level import or export declarations).

The final way is by seeing an "ambient external module declaration", where we 'declare' a module with a matching quoted name.
**myModules.d.ts**

```js
// In a .d.ts file or .ts file that is not an external module:
declare module "SomeModule" {
    export function fn(): string;
}
myOtherModule.ts
/// <reference path="myModules.d.ts" />
import m = require("SomeModule");
```

The reference tag here allows us to locate the declaration file that contains the declaration for the ambient external module. This is how the node.d.ts file that several of the TypeScript samples use is consumed, for example.

###Needless Namespacing
If you're converting a program from internal modules to external modules, it can be easy to end up with a file that looks like this:

**shapes.ts**

```js
export module Shapes {
    export class Triangle { /* ... */ }
    export class Square { /* ... */ }
}
```

The top-level module here Shapes wraps up Triangle and Square for no reason. This is confusing and annoying for consumers of your module:
**shapeConsumer.ts**

```js
import shapes = require('./shapes');
var t = new shapes.Shapes.Triangle(); // shapes.Shapes?
```

A key feature of external modules in TypeScript is that two different external modules will never contribute names to the same scope. Because the consumer of an external module decides what name to assign it, there's no need to proactively wrap up the exported symbols in a namespace.

To reiterate why you shouldn't try to namespace your external module contents, the general idea of namespacing is to provide logical grouping of constructs and to prevent name collisions. Because the external module file itself is already a logical grouping, and its top-level name is defined by the code that imports it, it's unnecessary to use an additional module layer for exported objects.

Revised Example:
**shapes.ts**

```js
export class Triangle { /* ... */ }
export class Square { /* ... */ }
```

**shapeConsumer.ts**

```js
import shapes = require('./shapes');
var t = new shapes.Triangle(); 
```

###Trade-offs for External Modules
Just as there is a one-to-one correspondence between JS files and modules, TypeScript has a one-to-one correspondence between external module source files and their emitted JS files. One effect of this is that it's not possible to use the --out compiler switch to concatenate multiple external module source files into a single JavaScript file.
