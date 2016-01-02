# 模块
本部分将概述TypeScript中的各种用模块组织代码的方式。内容不仅会覆盖内部模块和外部模块，我们还将讨论每种模块应当在何时使用以及如何使用。同时我们也会对如何使用外部模块，以及在TypeScript中使用模块可能会产生的隐患等进阶话题进行讨论。

### 第一步
我们首先从下面这段程序讲起，我们通篇都会用到它。我们写了一些非常简单的字符串验证方法，你平时可能也会用这些方法来检查网页用户在表单上的输入，或是用它们检查来自外部的数据的格式。

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

### 加入模块
当我们添加了更多的验证方法以后，我们会想要以某种方式来组织我们的代码，好让我们能够追踪我们创建的这类类型，同时也不用担心它们与其他对象发生命名冲突。我们应该把所创建的对象包裹进一个模块中，而不在全局环境给它们取一堆不同的名字。

在这个例子中，我们已经把所有和验证相关的类型都放进了一个名为'Validation'的模块中。为了使这里的接口和类对模块外部可见，我们在开头用export关键词修饰它们。相反的，变量'lettersRegexp'和'numberRegexp'都是验证中的细节部分，我们将保持它们的非输出的状态，使其在外部不可见。由下面例子后面的测试代码我们可以知道，当在模块外面使用时，我们需要指定验证类型，如：Validation.LettersOnlyValidator。

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

## 分割文件
随着应用规模的逐渐扩大，我们需要将代码分割成多个文件，以使其更易维护。

在这里，我们将验证模块分成了多个文件。尽管这些文件是分散开的，但它们都像是定义在同一个地方一样，作用于同一个模块中。因为这些文件之间互有依赖关系，所以我们添加了引用标签来告诉编译器这些文件之间的关系。测试代码并没有变化。

### 多文件的内部模块
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

当项目涉及到多个文件时，我们就必须保证所有编译后的代码都能被加载进来。我们有两种方法来实现这一点。

第一种方法是通过--out flag来将输入的所有文件内容连接起来，并将结果输出到单个JavaScript文件中：

```
tsc --out sample.js Test.ts
```

编译器将会根据在文件中出现的引用标签自动地排序输出文件的内容。但你也可以手动指定每个文件的输出顺序：

```
tsc --out sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

另外，我们也可以使用分别输出每个文件的编译方式（这是默认选项）。生成多个JS文件以后，我们需要在网页上用&lt;script&gt;标签按恰当的顺序加载每个文件，像是下面的例子：

**MyTestPage.html (部分代码)**

```html
    <script src="Validation.js" type="text/javascript" />
    <script src="LettersOnlyValidator.js" type="text/javascript" />
    <script src="ZipCodeValidator.js" type="text/javascript" />
    <script src="Test.js" type="text/javascript" />
```

## 使用外部代码

TypeScript同样也有外部模块的概念。在用到node.js或require.js时我们需要使用外部模块。对于没有用到node.js或require.js的应用则不需要使用外部模块，因为前面讲到的内部模块就能够很好地组织起这类应用的代码。

在外部模块中，文件之间的关系是通过文件级别的输入和输出来指定的。在TypeSciprt中，任何包含顶级import和export关键字的文件都被认为是外部模块。

在下面的例子中，我们将前面的例子转换成了使用外部模块的形式。注意这里我们不再使用module关键字，文件本身就构成了一个模块。我们通过它们的文件名来识别它们。

这里我们用import声明替代了引用标签，import指定了模块间的依赖关系。import声明由两部分构成：require关键字用来指定当前文件所依赖的模块的路径，import后面指定的输入的模块在这个文件中的名称。

```js
import someMod = require('someModule');
```

与我们用export定义一个内部模块的公共部分相似，这里我们在顶级声明上用export关键字来指定哪些对象对外部是可见的。

编译时，我们需要在命令行上指定该模块的编译类型。对于node.js来说，要用 --module commonjs；对于require.js来说，要用--module amd。来看下面的例子：

```
tsc --module commonjs Test.ts
```

编译以后，每个外部模块都会变成一个分离的.js文件。类似引用标签，编译器会根据import声明来编译相互依赖的文件。

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

### 外部模块代码生成
编译器会根据编译时指定的类型，为node.js (commonjs)和require.js (AMD)的模块加载系统生成合适的代码。你可以查看每个模块加载器的文档来了解生成代码中的define和require到底做了什么。

下面这个例子展示了import和export语句是如何转换成模块加载代码的。

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

## Export =
在前面的例子中，我们使用validator时，每个模块都只输出一个值。在这种情况下，虽然我们用一个标识符就可以了，但我们仍需要一个限定名。这样的做法显得很繁重。

而"export ="句法可以指定模块要输出的单一对象。这个对象可以是类，接口，模块，函数或枚举类型。每当这个模块被输入时，其输出的东西就可以被直接使用，而不需要再在模块上加上任何名称。

在下面的例子中，我们用"export ="句法简化了前面Validator的实现，每个模块只会输出一个对象。这种做法简化了使用模块的代码——我们可以直接引用'zipValidator'而不需要用'zip.ZipCodeValidator'。

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

## 别名（Alias）
另一种简化我们工作的做法是用"import q = x.y.z"来为常用对象创建短一些的名称。"import q = x.y.z"和用于加载外部模块的"import x = require('name')"是不一样的，它只会为指定的符号创建一个别名。我们可以将这类import（通常只是用作别名）用于任何类型标识符上，包括输入的外部模块所创建的对象。

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

注意这里我们没有使用require关键字，而是import的右侧赋值为我们导入对象的限定名。它的用法和var相似，但它同时也对导入对象的类型以及命名空间起作用。更重要的是，import的值是独立于原对象的一个引用，所以对别名变量的修改不会作用在原变量上。

## 可选模块加载和其它一些特殊的加载情景
在某些场景下，你可能需要在某些条件成立的情况下才加载一个模块。在TypeScript中，我们可以用后面展示的一些使用模式，来在保障数据类型安全的前提下触发模块加载器，以满足这种需求及其他特殊的模块加载场景。

编译器会检测在生成的JavaScript中，一个模块到底有没有被使用。对于那些只会被用在类型系统上的模块来说，我们不需要调用require。这种挑选出被引用但却未被使用的模块的做法对性能大有脾益，同时也使加载可选模块成为了可能。

这一模式的核心思想在于我们可以通过import id = require('...')获取外部模块暴露出来的类型。就像下面的if语句块那样，模块加载器会被（require）动态触发，
使得我们可以筛选（reference-culling）优化，从而使模块可以按需加载。让这种模式起作用的关键在于保证我们通过import定义标识符只会发生在类型上（即编译时不会生成JavaScript代码）。

我们可以用typeof关键字来保证类型的安全。用在类型位置上的typeof关键字会生成值所对应的类型，在这个例子中所对应的是外部模块的类型。

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

## 使用其他的JavaScript代码库
我们需要声明非TypeScript代码库所暴露出来的API，才能描述代码库中的数据类型和结构。用模块的形式来表示这些库是很合适的，因为大多数JavaScript的代码库都只会暴露出一些顶层的对象。我们的声明并没有实现环境，通常这些定义都写在在.d.ts的文件中。如果你对C/C++很熟悉的话，你可以把它们当作是.h文件或是"extern" 。接下来让我们来看一些内部模块和外部模块的例子。

###包裹成内部模块
代码库D3把它的功能都定义在了一个名为'D3'的全局对象中。由于这个库是通过script标签加载的（而不是通过模块加载器），我们可以使用内部模块来定义它的结构。我们用一个ambient内部模块声明来让TypeScript的编译器可以了解它的结构。举个例子：

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
node.js中的大多数的任务是通过加载多个模块来完成的。虽然我们可以在每个模块对应的.d.ts文件中用顶层的输出声明来定义这个模块，但把它们写成一个大的.d.ts文件会更加方便。我们会使用模块的引用名称来实现这一点，这个名称可以在后面的import中使用。举个例子：

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

现在我们可以用"/// <reference>"来引用node.d.ts，并且我们可以用类似import url = require('url')的语句来加载相应模块。

```js
///<reference path="node.d.ts"/>
import url = require("url");
var myUrl = url.parse("http://www.typescriptlang.org");
```


## 模块使用中的一些问题
我们将在这一部分讲述使用内部模块和外部模块时会碰到的一些常见的陷阱，以及如何避免它们。

###/// <reference> to an external module
一种常见的错误是用"/// <reference>"句法来引用一个外部模块文件（应该用import）。为了理解它们之间的差异，我们首先需要了解编译器定位外部模块信息的三种方式。

第一种方式是通过"import x = require(...);"声明查找对应的.ts文件。这个文件应该是带有顶层import或export声明的实现文件。

第二种方式是查找一个.d.ts文件。这种做法与第一种做法相似，但这个文件是个声明文件（同样有顶层的import或export声明），而并没有具体的实现的代码。

最后一种方式是利用"ambient外部模块声明"。对于这种方式，我们需要根据代码库来'声明'一个模块。
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

这里的引用标签允许我们定位包含ambient外部模块的声明的声明文件。这同时也是不少TypeScript样例中的node.d.ts文件的用法。

### 冗余命名空间
如果你想把一个程序从内部模块转换成外部模块，你很有可能会把文件写成这个样子：

**shapes.ts**

```js
export module Shapes {
    export class Triangle { /* ... */ }
    export class Square { /* ... */ }
}
```

这个例子用顶层模块Shapes无缘无故地包裹起了Triangle和Square。这么做会让该模块的使用者感到很费解和麻烦：

**shapeConsumer.ts**

```js
import shapes = require('./shapes');
var t = new shapes.Shapes.Triangle(); // shapes.Shapes?
```

TypeScript中的外部模块有一个重要的特性，即两个不同的外部模块永远都不会把名称附着到同一个作用域上。因为外部模块的用户可以决定使用这个模块时的名称。所以你没有必要事先把要暴露出来的标识用一个命名空间包裹起来。

这里重申一下为什么我们不应该把外部模块放在命名空间里。命名空间是为了提供一个有逻辑意义的分组结构，并防止命名冲突。因为外部模块文件本身就已经是逻辑分组，并且它的顶层名称是由引入（import）它的代码所定义的，所以我们没有必要用额外的模块层来包裹这些输出对象。

修改后的例子：

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

### 外部模块的一些副作用
就像每个JS文件和每个模块之间有一一对应的关系一样，TypeScript的外部模块的源码文件和它们生成的JS文件之间也有一一对应的关系。这种做法会产生一个副作用，即我们不可能用--out编译器开关把多个外部文件源码编译连接进同一个JavaScript文件中去。
