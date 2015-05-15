#TypeScript 1.5
##ES6 Modules

$TypeScript 1.5 supports ECMAScript 6 (ES6) modules. ES6 modules are effectively TypeScript external modules with a new syntax: ES6 modules are separately loaded source files that possibly import other modules and provide a number of externally accessible exports. ES6 modules feature several new export and import declarations. It is recommended that TypeScript libraries and applications be updated to use the new syntax, but this is not a requirement. The new ES6 module syntax coexists with TypeScript's original internal and external module constructs and the constructs can be mixed and matched at will.
$$TypeScript 1.5支持ECMAScript 6 （ES6）模块（modules）。ES6模块可以认为是带着新语法的TypeScript外部模块（external modules）：ES6的模块是被零散地载入的源码文件，它们可以引入（import）其他的模块，也可以提供一些内容供外部使用（exports）。ES6的模块提供了一些新的import和export声明的特性。虽然TypeScript并不强制要求项目使用ES6模块，但我们还是推荐你在库和应用上使用新的模块语法，并更新原来的模块。ES6模块的和TypeScript原来的内部模块和外部模块是可以共存的。你甚至可以按你的意愿来构造并混合它们。

__Export Declarations__

$In addition to the existing TypeScript support for decorating declarations with export, module members can also be exported using separate export declarations, optionally specifying different names for exports using as clauses.
$$除了现有TypeScript支持的export的装饰模式的声明（decorating declarations）外，我们也可以用零散的export声明来输出模块中的成员。我们甚至可以用子句（clauses）来给export的内容指定不同的名称。

```js
interface Stream { ... }
function writeToStream(stream: Stream, data: string) { ... }
export { Stream, writeToStream as write };  // writeToStream exported as write
```

$Import declarations, as well, can optionally use as clauses to specify different local names for the imports. For example:
$$import声明同样也可以选择使用子句来给import的内容指定其他的，用于本地的名称。举例来说：

```js
import { read, write, standardOutput as stdout } from "./inout";
var s = read(stdout);
write(stdout, s);
```

$As an alternative to individual imports, a namespace import can be used to import an entire module:
$$除了独立的import外，我们也可以通过导入命名空间来导入一整个模块：

```js
import * as io from "./inout";
var s = io.read(io.standardOutput);
io.write(io.standardOutput, s);
Re-exporting
```

$Using from clause a module can copy the exports of a given module to the current module without introducing local names.
$$通过使用from子句，一个模块可以复制给定模块中导出的内容到这个模块中，而不需要生成新的，用于本地的名称。

```js
export { read, write, standardOutput as stdout } from "./inout";
```

$export \* can be used to re-export all exports of another module. This is useful for creating modules that aggregate the exports of several other modules.
$$export \*被用在将一个模块的导出再次导出时。在创建专门用来聚集其他模块的导出类型的模块时，这种方式会非常有用。

```js
export function transform(s: string): string { ... }
export * from "./mod1";
export * from "./mod2";
```

__Default Export__

$An export default declaration specifies an expression that becomes the default export of a module:
$$export default声明是用来指定一个表达式的。这个表达式的内容会成为模块默认的导出内容：

```js
export default class Greeter {
    sayHello() {
        console.log("Greetings!");
    }
}
```

$Which in tern can be imported using default imports:
$$对应的，我们可以用default imports导入这些内容：

```js
import Greeter from "./greeter";
var g = new Greeter();
g.sayHello();
```

__Bare Import__

$A "bare import" can be used to import a module only for its side-effects.
$$"bare import"在导入一个模块时，只是为了导入这个模块时所带来的附加作用（side-effects）。

```js
import "./polyfills";
```

$For more information about module, please see the ES6 module support spec.
$$你可以通过查阅ES6 module的支持说明来了解更多关于模块的信息。

##Destructuring in declarations and assignments

$TypeScript 1.5 adds support to ES6 destructuring declarations and assignments.
$$TypeScript 1.5中添加了对ES6中的解构声明和解构赋值（destructuring declarations and assignments）的支持。

__Declarations__

$A destructuring declaration introduces one or more named variables and initializes them with values extracted from properties of an object or elements of an array.
$$解构声明会通过从对象中的属性或数组中的元素中抽取出来的值，来引入一个或多个变量，并给它们赋上对应值。

$For example, the following sample declares variables x, y, and z, and initializes them to getSomeObject().x, getSomeObject().y and getSomeObject().z respectively:
$$举例来说，下面的例子声明了x, y, z变量，并将他们的值分别初始化为getSomeObject().x，getSomeObject().y和getSomeObject().z。

```js
var { x, y, z} = getSomeObject();
```

$Destructuring declarations also works for extracting values from arrays:
$$我们同样可以在数组上使用解构声明来抽取出数组中的值：

```js
var [x, y, z = 10] = getSomeArray();
```

$Similarly, destructuring can be used in function parameter declarations:
$$同样的，解构也可以被用在函数参数的声明上：

```js
function drawText({ text = "", location: [x, y] = [0, 0], bold = false }) {  
    // Draw text  
}

// Call drawText with an object literal
var item = { text: "someText", location: [1,2,3], style: "italics" };
drawText(item);
```

__Assignments__

$Destructuring patterns can also be used in regular assignment expressions. For instance, swapping two variables can be written as a single destructuring assignment:
$$解构的模式也可以用在通常的赋值表达式上。举个例子，我们可以用一个解构赋值来实现交换两个变量的值：

```js
var x = 1;  
var y = 2;  
[x, y] = [y, x];
```

##`let` and `const` support

$ES6 `let` and `const` declarations are now supported when targeting ES3 and ES5.
$$现在在ES3和ES5上，我们也可以使用`let`和`const`声明了。

__Const__

```js
const MAX = 100;

++MAX; // Error: The operand of an increment or decrement 
       //        operator cannot be a constant.
```

__Block scoped__

```js
if (true) {
  let a = 4;
  // use a
}
else {
  let a = "string";
  // use a
}

alert(a); // Error: a is not defined in this scope
```

##for..of support

$TypeScript 1.5 adds support to ES6 for..of loops on arrays for ES3/ES5 as well as full support for Iterator interfaces when targetting ES6.
$$TypeScript 1.5新增了在ES3/ES5数组上使用ES6 for..of循环的支持。同时它也完整地支持ES6上的迭代器接口（Iterator interfaces）。

__Example:__

$The TypeScript compiler will transpile for..of arrays to idiomatic ES3/ES5 JavaScript when targeting those versions:
$$当我们想要TypeScript支持ES3/ES5时，编译器会将使用for..of的数组转换成我们惯用的ES3/ES5代码：

```js
for (var v of expr) { }
```

$will be emitted as:
$$将会被转换成：

```js
for (var _i = 0, _a = expr; _i < _a.length; _i++) {
    var v = _a[_i];
}
```

##Decorators

$TypeScript decorator is based on the ES7 decorator proposal.
$$TypeScript装饰器（decorator）是基于ES7装饰器提案实现的。

$A decorator is:
$$装饰器是：

* $an expression$$一个表达式
* $that evaluates to a function$$它会作为一个函数执行
* $that takes the target, name, and property descriptor as arguments$$它把目标，名称，属性描述（property descriptor）作为参数
* $and optionally returns a property descriptor to install on the target object$$它可以返回一个属性描述，以作用在目标对象上

$For more information, please see the Decorators proposal.
$$你可以查阅Decorators提案来获取更多信息。

__Example:__

$Decorators `readonly` and `enumerable(false)` will be applied to the property method before it is installed on class `C`. This allows the decorator to change the implementation, and in this case, augment the descriptor to be writable: false and enumerable: false.
$$`readonly`和`enumerable(false)`这两个装饰器会在method属性被放置在类`C`上之前，作用于method。装饰器会改变属性，方法的实现。比如在这个例子中，method的属性描述会添加writable: false和enumerable: false两项。

```js
class C {
  @readonly
  @enumerable(false)
  method() { }
}

function readonly(target, key, descriptor) {
    descriptor.writable = false;
}

function enumerable(value) {
  return function (target, key, descriptor) {
     descriptor.enumerable = value;
  }
}
```

##Computed properties

$Initializing an object with dynamic properties can be a bit of a burden. Take the following example:
$$想要在初始化对象时，带上一些动态的属性可能会很麻烦。举下面的例子来说：

```js
type NeighborMap = { [name: string]: Node };
type Node = { name: string; neighbors: NeighborMap;}

function makeNode(name: string, initialNeighbor: Node): Node {
    var neighbors: NeighborMap = {};
    neighbors[initialNeighbor.name] = initialNeighbor;
    return { name: name, neighbors: neighbors };
}
```

$Here we need to create a variable to hold on to the neighbor-map so that we can initialize it. With TypeScript 1.5, we can let the compiler do the heavy lifting:
$$这里我们需要先为neighbor-map创建一个对象变量，然后再初始化它。在TypeScript 1.5中，我们可以让编译器替我们完成这类工作：

```js
function makeNode(name: string, initialNeighbor: Node): Node {
    return {
        name: name,
        neighbors: {
            [initialNeighbor.name] = initialNeighbor
        }
    }
}
```

##Unicode codepoint escapes in strings

$ES6 introduces escapes that allow users to represent a Unicode codepoint using just a single escape.
$$ES6引入了escapes来使用户仅需要使用一次escape就能表示一个Unicode编码点（codepoint）。

$As an example, consider the need to escape a string that contains the character '𠮷'. In UTF-16/UCS2, '𠮷' is represented as a surrogate pair, meaning that it's encoded using a pair of 16-bit code units of values, specifically `0xD842` and `0xDFB7`. Previously this meant that you'd have to escape the codepoint as `"\uD842\uDFB7"`. This has the major downside that it’s difficult to discern two independent characters from a surrogate pair.
$$举例来说，假设我们需要转义一个包含UTF-16/UCS2字符'𠮷'的字符串。其中'𠮷'由一个代理对（surrogate pair）来表示，这就是说它是由一对16比特的编码单元——`0xD842`和`0xDFB7`来表示的。这意味着你必须转义`"\uD842\uDFB7"`，但实际上我们很难辨别这是两个独立的字符还是一个代理对。

$With ES6’s codepoint escapes, you can cleanly represent that exact character in strings and template strings with a single escape: `"\u{20bb7}"`. TypeScript will emit the string in ES3/ES5 as `"\uD842\uDFB7"`.
$$通过ES6的编码点转义，你可以通过像`"\u{20bb7}"`这样的转义来清楚地表达字符串或字符串模板中的字符表达的到底是什么。TypeScript会把这个字符串转换成ES3/ES5中的`"\uD842\uDFB7"`。

##Tagged template strings in ES3/ES5

$In TypeScript 1.4, we added support for template strings for all targets, and tagged templates for just ES6. Thanks to some considerable work done by @ivogabe, we bridged the gap for for tagged templates in ES3 and ES5.
$$在TypeScript 1.4中，我们添加了对字符串模板的支持（ES3/ES5/ES6），以及对ES6中的标记模板（tagged templates）的支持。这里要感谢@ivogabe为我们提供的一些深思熟虑的想法和工作，使得我们在ES3和ES5中也可以使用标记模板。

$When targeting ES3/ES5, the following code
$$当我们想要将代码转换成ES3/ES5时，下面的代码：

```js
function oddRawStrings(strs: TemplateStringsArray, n1, n2) {
    return strs.raw.filter((raw, index) => index % 2 === 1);
}

oddRawStrings `Hello \n${123} \t ${456}\n world`
```

$will be emitted as
$$会变成：

```js
function oddRawStrings(strs, n1, n2) {
    return strs.raw.filter(function (raw, index) {
        return index % 2 === 1;
    });
}
(_a = ["Hello \n", " \t ", "\n world"], _a.raw = ["Hello \\n", " \\t ", "\\n world"], oddRawStrings(_a, 123, 456));
var _a;
```

##AMD-dependency optional names

$`/// <amd-dependency path="x" />` informs the compiler about a non-TS module dependency that needs to be injected in the resulting module's require call; however, there was no way to consume this module in the TS code.
$$`/// <amd-dependency path="x" />`会告诉编译器，由于当前模块的调用，有一个非TS模块的依赖需要被注入。然而TS代码并不能使用这些代码。

$The new `amd-dependency name` property allows passing an optional name for an amd-dependency:
$$而新添加的`amd-dependency name`属性则允许我们给一个amd依赖命名。

```js
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA:MyType
moduleA.callStuff()
```

$Generated JS code:
$$上面的代码生成的JS代码是：

```js
define(["require", "exports", "legacy/moduleA"], function (require, exports, moduleA) {
    moduleA.callStuff()
});
```

##Project support through tsconfig.json

$Adding a `tsconfig.json` file in a directory indicates that the directory is the root of a TypeScript project. The tsconfig.json file specifies the root files and the compiler options required to compile the project. A project is compiled in one of the following ways:
$$给一个文件夹添加一个`tsconfig.json`文件可以表示当前文件夹是一个TypeScript项目的根目录。通过tsconfig.json，我们可以指定根文件（root files）以及编译选项。每个项目对会以下面的一种方式进行编译：

* $By invoking tsc with no input files, in which case the compiler searches for the tsconfig.json file starting in the current directory and continuing up the parent directory chain.$$如果我们使用tsc指令但是不指定输入文件，编译器会就会从当前文件夹开始，向上寻找tsconfig.json文件。
* $By invoking tsc with no input files and a -project (or just -p) command line option that specifies the path of a directory containing a tsconfig.json file.$$如果我们使用tsc指令但是不指定输入文件，那我们可以使用-project（或 -p）命令行选项来指定包含tsconfig.json文件的文件夹。

__Example:__

```js
{
    "compilerOptions": {
        "module": "commonjs",
        "noImplicitAny": true,
        "sourceMap": true,
    }
}
```

$See the tsconfig.json wiki page for more details.
$$你可以查看tsconfig.json的维基页面获取详细信息。

##`--rootDir` command line option

$Option `--outDir` duplicates the input hierarchy in the output. The compiler computes the root of the input files as the longest common path of all input files; and then uses that to replicate all its substructure in the output.
$$`--outDir`选项在进行输出文件时会根据输入文件的路径结构来进行。编译器会以根目录下的文件的路径作为所有输入文件的最长路径截点（即路径不会超过根目录），使用每个输入文件的路径来放置输出文件。

$Sometimes this is not desirable, for instance inputs `FolderA\FolderB\1.ts` and `FolderA\FolderB\2.ts` would result in output structure mirroring `FolderA\FolderB\`. now if a new file `FolderA\3.ts` is added to the input, the output structure will pop out to mirror `FolderA\`.
$$但有时候我们并不希望这样。比如我们输入`FolderA\FolderB\1.ts`和`FolderA\FolderB\2.ts`，则输出文件都会出现在一个`FolderA\FolderB\`这样的镜像结构的文件中。如果我们再增加一个`FolderA\3.ts`作为输入文件，则这个文件对应的输出文件就会出现在一个`FolderA\`文件中。

$`--rootDir` specifies the input directory to be mirrored in output instead of computing it.
$$而`--rootDir`允许我们指定那些输出时，其路径要被镜像的文件夹，来代替计算输出路径。
