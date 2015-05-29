#模块
$This post outlines the various ways to organize your code using modules in TypeScript. We'll be covering internal and external modules and we'll discuss when each is appropriate and how to use them. We'll also go over some advanced topics of how to use external modules, and address some common pitfalls when using modules in TypeScript.
$$本部分将概述TypeScript中的各种用模块组织代码的方式。内容不仅会覆盖内部模块和外部模块，我们还将讨论每种模块应当在何时使用以及如何使用。同时我们也会对如何使用外部模块，以及在TypeScript中使用模块可能会产生的隐患等进阶话题进行讨论。

###第一步
$Let's start with the program we'll be using as our example throughout this page. We've written a small set of simplistic string validators, like you might use when checking a user's input on a form in a webpage or checking the format of an externally-provided data file.
$$我们首先从下面这段程序讲起，我们通篇都会用到它。我们写了一些非常简单的字符串验证方法，你平时可能也会用这些方法来检查网页用户在表单上的输入，或是用它们检查来自外部的数据的格式。

**写在一个文件中的验证器**

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

###加入模块
$As we add more validators, we're going to want to have some kind of organization scheme so that we can keep track of our types and not worry about name collisions with other objects. Instead of putting lots of different names into the global namespace, let's wrap up our objects into a module.
$$当我们添加了更多的验证方法以后，我们会想要以某种方式来组织我们的代码，好让我们能够追踪我们创建的这类类型，同时也不用担心它们与其他对象发生命名冲突。我们应该把所创建的对象包裹进一个模块中，而不在全局环境给它们取一堆不同的名字。

$In this example, we've moved all the Validator-related types into a module called Validation. Because we want the interfaces and classes here to be visible outside the module, we preface them with export. Conversely, the variables lettersRegexp and numberRegexp are implementation details, so they are left unexported and will not be visible to code outside the module. In the test code at the bottom of the file, we now need to qualify the names of the types when used outside the module, e.g. Validation.LettersOnlyValidator.
$$在这个例子中，我们已经把所有和验证相关的类型都放进了一个名为'Validation'的模块中。为了使这里的接口和类对模块外部可见，我们在开头用export关键词修饰它们。相反的，变量'lettersRegexp'和'numberRegexp'都是验证中的细节部分，我们将保持它们的非输出的状态，使其在外部不可见。由下面例子后面的测试代码我们可以知道，当在模块外面使用时，我们需要指定验证类型，如：Validation.LettersOnlyValidator。

**模块化后的验证器**

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

##分割成多个文件
$As our application grows, we'll want to split the code across multiple files to make it easier to maintain.
$$随着应用规模的逐渐扩大，我们需要将代码分割成多个文件，以使其更易维护。

$Here, we've split our Validation module across many files. Even though the files are separate, they can each contribute to the same module and can be consumed as if they were all defined in one place. Because there are dependencies between files, we've added reference tags to tell the compiler about the relationships between the files. Our test code is otherwise unchanged.
$$在这里，我们将验证模块分成了多个文件。尽管这些文件是分散开的，但它们都像是定义在同一个地方一样，作用于同一个模块中。因为这些文件之间互有依赖关系，所以我们添加了引用标签来告诉编译器这些文件之间的关系。测试代码并没有变化。

###多文件的内部模块
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

$Once there are multiple files involved, we'll need to make sure all of the compiled code gets loaded. There are two ways of doing this.
$$当项目涉及到多个文件时，我们就必须保证所有编译后的代码都能被加载进来。我们有两种方法来实现这一点。

$First, we can use concatenated output using the --out flag to compile all of the input files into a single JavaScript output file:
$$第一种方法是通过--out flag来将输入的所有文件内容连接起来，并将结果输出到单个JavaScript文件中：

```
tsc --out sample.js Test.ts
```

$The compiler will automatically order the output file based on the reference tags present in the files. You can also specify each file individually:
$$编译器将会根据在文件中出现的引用标签自动地排序输出文件的内容。但你也可以手动指定每个文件的输出顺序：

```
tsc --out sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

$Alternatively, we can use per-file compilation (the default) to emit one JavaScript file for each input file. If multiple JS files get produced, we'll need to use &lt;script&gt; tags on our webpage to load each emitted file in the appropriate order, for example:
$$另外，我们也可以使用分别输出每个文件的编译方式（这是默认选项）。生成多个JS文件以后，我们需要在网页上用&lt;script&gt;标签按恰当的顺序加载每个文件，像是下面的例子：

**MyTestPage.html (部分代码)**

```html
    <script src="Validation.js" type="text/javascript" />
    <script src="LettersOnlyValidator.js" type="text/javascript" />
    <script src="ZipCodeValidator.js" type="text/javascript" />
    <script src="Test.js" type="text/javascript" />
```

##使用外部代码

$TypeScript also has the concept of an external module. External modules are used in two cases: node.js and require.js. Applications not using node.js or require.js do not need to use external modules and can best be organized using the internal module concept outlined above.
$$TypeScript同样也有外部模块的概念。在用到node.js或require.js时我们需要使用外部模块。对于没有用到node.js或require.js的应用则不需要使用外部模块，因为前面讲到的内部模块就能够很好地组织起这类应用的代码。

$In external modules, relationships between files are specified in terms of imports and exports at the file level. In TypeScript, any file containing a top-level import or export is considered an external module.
$$在外部模块中，文件之间的关系是通过文件级别的输入和输出来指定的。在TypeSciprt中，任何包含顶级import和export关键字的文件都被认为是外部模块。

$Below, we have converted the previous example to use external modules. Notice that we no longer use the module keyword – the files themselves constitute a module and are identified by their filenames.
$$在下面的例子中，我们将前面的例子转换成了使用外部模块的形式。注意这里我们不再使用module关键字，文件本身就构成了一个模块。我们通过它们的文件名来识别它们。

$The reference tags have been replaced with import statements that specify the dependencies between modules. The import statement has two parts: the name that the module will be known by in this file, and the require keyword that specifies the path to the required module:
$$这里我们用import声明替代了引用标签，import指定了模块间的依赖关系。import声明由两部分构成：require关键字用来指定当前文件所依赖的模块的路径，import后面指定的输入的模块在这个文件中的名称。

```js
import someMod = require('someModule');
```

$We specify which objects are visible outside the module by using the export keyword on a top-level declaration, similarly to how export defined the public surface area of an internal module.
$$与我们用export定义一个内部模块的公共部分相似，这里我们在顶级声明上用export关键字来指定哪些对象对外部是可见的。

$To compile, we must specify a module target on the command line. For node.js, use --module commonjs; for require.js, use --module amd. For example:
$$编译时，我们需要在命令行上指定该模块的编译类型。对于node.js来说，要用 --module commonjs；对于require.js来说，要用--module amd。来看下面的例子：

```
tsc --module commonjs Test.ts
```

$When compiled, each external module will become a separate .js file. Similar to reference tags, the compiler will follow import statements to compile dependent files.
$$编译以后，每个外部模块都会变成一个分离的.js文件。类似引用标签，编译器会根据import声明来编译相互依赖的文件。

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

###外部模块代码生成
$Depending on the module target specified during compilation, the compiler will generate appropriate code for either node.js (commonjs) or require.js (AMD) module-loading systems. For more information on what the define and require calls in the generated code do, consult the documentation for each module loader.
$$编译器会根据编译时指定的类型，为node.js (commonjs)和require.js (AMD)的模块加载系统生成合适的代码。你可以查看每个模块加载器的文档来了解生成代码中的define和require到底做了什么。

$This simple example shows how the names used during importing and exporting get translated into the module loading code.
$$下面这个例子展示了import和export语句是如何转换成模块加载代码的。

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
$In the previous example, when we consumed each validator, each module only exported one value. In cases like this, it's cumbersome to work with these symbols through their qualified name when a single identifier would do just as well.
$$在前面的例子中，我们使用validator时，每个模块都只输出一个值。在这种情况下，虽然我们用一个标识符就可以了，但我们仍需要一个限定名。这样的做法显得很繁重。

$The export = syntax specifies a single object that is exported from the module. This can be a class, interface, module, function, or enum. When imported, the exported symbol is consumed directly and is not qualified by any name.
$$而"export ="句法可以指定模块要输出的单一对象。这个对象可以是类，接口，模块，函数或枚举类型。每当这个模块被输入时，其输出的东西就可以被直接使用，而不需要再在模块上加上任何名称。

$Below, we've simplified the Validator implementations to only export a single object from each module using the export = syntax. This simplifies the consumption code – instead of referring to 'zip.ZipCodeValidator', we can simply refer to 'zipValidator'.
$$在下面的例子中，我们用"export ="句法简化了前面Validator的实现，每个模块只会输出一个对象。这种做法简化了使用模块的代码——我们可以直接引用'zipValidator'而不需要用'zip.ZipCodeValidator'。

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

##别名（Alias）
$Another way that you can simplify working with either kind of module is to use import q = x.y.z to create shorter names for commonly-used objects. Not to be confused with the import x = require('name') syntax used to load external modules, this syntax simply creates an alias for the specified symbol. You can use these sorts of imports (commonly referred to as aliases) for any kind of identifier, including objects created from external module imports.
$$另一种简化我们工作的做法是用"import q = x.y.z"来为常用对象创建短一些的名称。"import q = x.y.z"和用于加载外部模块的"import x = require('name')"是不一样的，它只会为指定的符号创建一个别名。我们可以将这类import（通常只是用作别名）用于任何类型标识符上，包括输入的外部模块所创建的对象。

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

$Notice that we don't use the require keyword; instead we assign directly from the qualified name of the symbol we're importing. This is similar to using var, but also works on the type and namespace meanings of the imported symbol. Importantly, for values, import is a distinct reference from the original symbol, so changes to an aliased var will not be reflected in the original variable.
$$注意这里我们没有使用require关键字，而是import的右侧赋值为我们导入对象的限定名。它的用法和var相似，但它同时也对导入对象的类型以及命名空间起作用。更重要的是，import的值是独立于原对象的一个引用，所以对别名变量的修改不会作用在原变量上。

##可选模块加载和其它一些特殊的加载情景
$In some cases, you may want to only load a module under some conditions. In TypeScript, we can use the pattern shown below to implement this and other advanced loading scenarios to directly invoke the module loaders without losing type safety.
$$在某些场景下，你可能需要在某些条件成立的情况下才加载一个模块。在TypeScript中，我们可以用后面展示的一些使用模式，来在保障数据类型安全的前提下触发模块加载器，以满足这种需求及其他特殊的模块加载场景。

$The compiler detects whether each module is used in the emitted JavaScript. For modules that are only used as part of the type system, no require calls are emitted. This culling of unused references is a good performance optimization, and also allows for optional loading of those modules.
$$编译器会检测在生成的JavaScript中，一个模块到底有没有被使用。对于那些只会被用在类型系统上的模块来说，我们不需要调用require。这种挑选出被引用但却未被使用的模块的做法对性能大有脾益，同时也使加载可选模块成为了可能。

$The core idea of the pattern is that the import id = require('...') statement gives us access to the types exposed by the external module. The module loader is invoked (through require) dynamically, as shown in the if blocks below. This leverages the reference-culling optimization so that the module is only loaded when needed. For this pattern to work, it's important that the symbol defined via import is only used in type positions (i.e. never in a position that would be emitted into the JavaScript).
$$这一模式的核心思想在于我们可以通过import id = require('...')获取外部模块暴露出来的类型。就像下面的if语句块那样，模块加载器会被（require）动态触发，
使得我们可以筛选（reference-culling）优化，从而使模块可以按需加载。让这种模式起作用的关键在于保证我们通过import定义标识符只会发生在类型上（即编译时不会生成JavaScript代码）。

$To maintain type safety, we can use the typeof keyword. The typeof keyword, when used in a type position, produces the type of a value, in this case the type of the external module.
$$我们可以用typeof关键字来保证类型的安全。用在类型位置上的typeof关键字会生成值所对应的类型，在这个例子中所对应的是外部模块的类型。

**node.js中的动态模块加载**

```js
declare var require;
import Zip = require('./ZipCodeValidator');
if (needZipValidation) {
    var x: typeof Zip = require('./ZipCodeValidator');
    if (x.isAcceptable('.....')) { /* ... */ }
}
```

**require.js中的动态模块加载**

```js
declare var require;
import Zip = require('./ZipCodeValidator');
if (needZipValidation) {
    require(['./ZipCodeValidator'], (x: typeof Zip) => {
        if (x.isAcceptable('...')) { /* ... */ }
    });
}
```

##使用其他的JavaScript代码库
$To describe the shape of libraries not written in TypeScript, we need to declare the API that the library exposes. Because most JavaScript libraries expose only a few top-level objects, modules are a good way to represent them. We call declarations that don't define an implementation "ambient". Typically these are defined in .d.ts files. If you're familiar with C/C++, you can think of these as .h files or 'extern'. Let's look at a few examples with both internal and external examples.
$$我们需要声明非TypeScript代码库所暴露出来的API，才能描述代码库中的数据类型和结构。用模块的形式来表示这些库是很合适的，因为大多数JavaScript的代码库都只会暴露出一些顶层的对象。我们的声明并没有实现环境，通常这些定义都写在在.d.ts的文件中。如果你对C/C++很熟悉的话，你可以把它们当作是.h文件或是"extern" 。接下来让我们来看一些内部模块和外部模块的例子。

###包裹成内部模块
$The popular library D3 defines its functionality in a global object called 'D3'. Because this library is loaded through a script tag (instead of a module loader), its declaration uses internal modules to define its shape. For the TypeScript compiler to see this shape, we use an ambient internal module declaration. For example:
$$代码库D3把它的功能都定义在了一个名为'D3'的全局对象中。由于这个库是通过script标签加载的（而不是通过模块加载器），我们可以使用内部模块来定义它的结构。我们用一个ambient内部模块声明来让TypeScript的编译器可以了解它的结构。举个例子：

**D3.d.ts (简要代码)**

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

###包裹成外部模块
$In node.js, most tasks are accomplished by loading one or more modules. We could define each module in its own .d.ts file with top-level export declarations, but it's more convenient to write them as one larger .d.ts file. To do so, we use the quoted name of the module, which will be available to a later import. For example:
$$node.js中的大多数的任务是通过加载多个模块来完成的。虽然我们可以在每个模块对应的.d.ts文件中用顶层的输出声明来定义这个模块，但把它们写成一个大的.d.ts文件会更加方便。我们会使用模块的引用名称来实现这一点，这个名称可以在后面的import中使用。举个例子：

**node.d.ts (简要代码)**

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

$Now we can /// <reference> node.d.ts and then load the modules using e.g. import url = require('url');.
$$现在我们可以用"/// <reference>"来引用node.d.ts，并且我们可以用类似import url = require('url')的语句来加载相应模块。

```js
///<reference path="node.d.ts"/>
import url = require("url");
var myUrl = url.parse("http://www.typescriptlang.org");
```


##模块使用中的一些问题
$In this section we'll describe various common pitfalls in using internal and external modules, and how to avoid them.
$$我们将在这一部分讲述使用内部模块和外部模块时会碰到的一些常见的陷阱，以及如何避免它们。

###/// <reference> to an external module
$A common mistake is to try to use the /// <reference> syntax to refer to an external module file, rather than using import. To understand the distinction, we first need to understand the three ways that the compiler can locate the type information for an external module.
$$一种常见的错误是用"/// <reference>"句法来引用一个外部模块文件（应该用import）。为了理解它们之间的差异，我们首先需要了解编译器定位外部模块信息的三种方式。

$The first is by finding a .ts file named by an import x = require(...); declaration. That file should be an implementation file with top-level import or export declarations.
$$第一种方式是通过"import x = require(...);"声明查找对应的.ts文件。这个文件应该是带有顶层import或export声明的实现文件。

$The second is by finding a .d.ts file, similar to above, except that instead of being an implementation file, it's a declaration file (also with top-level import or export declarations).
$$第二种方式是查找一个.d.ts文件。这种做法与第一种做法相似，但这个文件是个声明文件（同样有顶层的import或export声明），而并没有具体的实现的代码。

$The final way is by seeing an "ambient external module declaration", where we 'declare' a module with a matching quoted name.
$$最后一种方式是利用"ambient外部模块声明"。对于这种方式，我们需要根据代码库来'声明'一个模块。
**myModules.d.ts**

```js
// In a .d.ts file or .ts file that is not an external module:
declare module "SomeModule" {
    export function fn(): string;
}
```

**myOtherModule.ts**

```js
/// <reference path="myModules.d.ts" />
import m = require("SomeModule");
```

$The reference tag here allows us to locate the declaration file that contains the declaration for the ambient external module. This is how the node.d.ts file that several of the TypeScript samples use is consumed, for example.
$$这里的引用标签允许我们定位包含ambient外部模块的声明的声明文件。这同时也是不少TypeScript样例中的node.d.ts文件的用法。

###冗余命名空间
$If you're converting a program from internal modules to external modules, it can be easy to end up with a file that looks like this:
$$如果你想把一个程序从内部模块转换成外部模块，你很有可能会把文件写成这个样子：

**shapes.ts**

```js
export module Shapes {
    export class Triangle { /* ... */ }
    export class Square { /* ... */ }
}
```

$The top-level module here Shapes wraps up Triangle and Square for no reason. This is confusing and annoying for consumers of your module:
$$这个例子用顶层模块Shapes无缘无故地包裹起了Triangle和Square。这么做会让该模块的使用者感到很费解和麻烦：

**shapeConsumer.ts**

```js
import shapes = require('./shapes');
var t = new shapes.Shapes.Triangle(); // shapes.Shapes?
```

$A key feature of external modules in TypeScript is that two different external modules will never contribute names to the same scope. Because the consumer of an external module decides what name to assign it, there's no need to proactively wrap up the exported symbols in a namespace.  
$$TypeScript中的外部模块有一个重要的特性，即两个不同的外部模块永远都不会把名称附着到同一个作用域上。因为外部模块的用户可以决定使用这个模块时的名称。所以你没有必要事先把要暴露出来的标识用一个命名空间包裹起来。

$To reiterate why you shouldn't try to namespace your external module contents, the general idea of namespacing is to provide logical grouping of constructs and to prevent name collisions. Because the external module file itself is already a logical grouping, and its top-level name is defined by the code that imports it, it's unnecessary to use an additional module layer for exported objects.
$$这里重申一下为什么我们不应该把外部模块放在命名空间里。命名空间是为了提供一个有逻辑意义的分组结构，并防止命名冲突。因为外部模块文件本身就已经是逻辑分组，并且它的顶层名称是由引入（import）它的代码所定义的，所以我们没有必要用额外的模块层来包裹这些输出对象。

$Revised Example:
$$修改后的例子：

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

###外部模块的一些副作用
$Just as there is a one-to-one correspondence between JS files and modules, TypeScript has a one-to-one correspondence between external module source files and their emitted JS files. One effect of this is that it's not possible to use the --out compiler switch to concatenate multiple external module source files into a single JavaScript file.
$$就像每个JS文件和每个模块之间有一一对应的关系一样，TypeScript的外部模块的源码文件和它们生成的JS文件之间也有一一对应的关系。这种做法会产生一个副作用，即我们不可能用--out编译器开关把多个外部文件源码编译连接进同一个JavaScript文件中去。
