#TypeScript 1.5
##ES6模块
TypeScript 1.5支持ECMAScript 6 （ES6）模块（modules）。你可以把ES6模块当作是带着新语法的TypeScript外部模块（external modules）：ES6的模块是被零散载入的源码文件，它们可以输入（import）其他的模块，也可以输出内容供外部使用（exports）。ES6模块给import和export声明提供了一些新的特性。虽然TypeScript并不强制要求在项目使用ES6模块，但我们还是推荐你在库和应用上使用这种新的模块语法，并更新原来的模块。ES6模块的和TypeScript原来的内部模块和外部模块是可以共存的。你甚至可以按你的意愿来构造并混合它们。

__Export声明__

除了TypeScript现有的export装饰声明（decorating declarations）外，我们也可以零散地用export声明来输出模块中的成员。我们甚至可以用子句（clauses）来给export中的内容替换名称。

```js
interface Stream { ... }
function writeToStream(stream: Stream, data: string) { ... }
export { Stream, writeToStream as write };  // writeToStream exported as write
```

import声明也可以使用子句来给import后面的内容指定用于本地的名称。举例来说：

```js
import { read, write, standardOutput as stdout } from "./inout";
var s = read(stdout);
write(stdout, s);
```

除了独立的import外，我们也可以通过导入命名空间来导入一整个模块：

```js
import * as io from "./inout";
var s = io.read(io.standardOutput);
io.write(io.standardOutput, s);
Re-exporting
```

通过使用from子句，一个模块可以复制给定的模块所输出的内容到当前模块中，而不需要生成用于本地的名称。

```js
export { read, write, standardOutput as stdout } from "./inout";
```

export \* 常被用在将一个模块的输出再次进行输出。在创建专门用来聚集其他模块输出的模块时，这种方式非常有用。

```js
export function transform(s: string): string { ... }
export * from "./mod1";
export * from "./mod2";
```

__Default Export__

export default声明是用来指定一个表达式的。这个表达式的内容会成为模块默认的输出内容：

```js
export default class Greeter {
    sayHello() {
        console.log("Greetings!");
    }
}
```

对应的，我们可以用default imports导入这些内容：

```js
import Greeter from "./greeter";
var g = new Greeter();
g.sayHello();
```

__Bare Import__

我们可以用"bare import"导入一个模块，以获得导入这个模块时所带来的附加作用（side-effects）。

```js
import "./polyfills";
```

你可以通过查阅ES6 module的支持说明来了解更多关于模块的信息。

##声明和赋值时的解构

TypeScript 1.5添加了对ES6中的解构声明和解构赋值（destructuring declarations and assignments）的支持。

__声明__

解构声明会把从对象的属性（或数组的元素）中抽取出来的值，赋值给一个或多个变量。

举例来说，下面的例子声明了x, y, z变量，并将他们的值分别初始化为getSomeObject().x，getSomeObject().y和getSomeObject().z。

```js
var { x, y, z} = getSomeObject();
```

我们同样可以在数组上使用解构声明来抽取出数组中的值：

```js
var [x, y, z = 10] = getSomeArray();
```

同样的，解构也可以被用在函数参数的声明上：

```js
function drawText({ text = "", location: [x, y] = [0, 0], bold = false }) {
    // Draw text
}

// Call drawText with an object literal
var item = { text: "someText", location: [1,2,3], style: "italics" };
drawText(item);
```

__赋值__

解构的模式也可以用在通常的赋值表达式上。举个例子，我们可以用一个解构赋值来实现交换两个变量的值：

```js
var x = 1;
var y = 2;
[x, y] = [y, x];
```

##支持`let`和`const`

现在我们也可以在ES3和ES5上使用`let`和`const`声明了。

__常量__

```js
const MAX = 100;

++MAX; // Error: The operand of an increment or decrement
       //        operator cannot be a constant.
```

__块级作用域__

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

##支持for..of

你现在可以在TypeScript 1.5的ES3/ES5数组上使用ES6 for..of循环了。同时它也完整支持ES6上的迭代器接口（Iterator interfaces）。

__例子:__

当我们让TypeScript支持ES3/ES5时，编译器会将使用for..of的数组转换成我们惯用的ES3/ES5代码：

```js
for (var v of expr) { }
```

将会被转换成：

```js
for (var _i = 0, _a = expr; _i < _a.length; _i++) {
    var v = _a[_i];
}
```

##装饰器(Decorators)

TypeScript装饰器（decorator）是基于ES7的装饰器提案实现的。

装饰器是：

* 一个表达式
* 它会作为一个函数执行
* 它把目标，名称，属性描述（property descriptor）作为参数
* 它可以返回一个属性描述，以作用在目标对象上

你可以查阅Decorators提案来获取更多信息。

__例子:__

`readonly`和`enumerable(false)`这两个装饰器会在method属性被放置在类`C`上之前作用于method。装饰器会改变属性和方法的实现。比如在这个例子中，method的属性会被添加writable: false和enumerable: false两项属性描述。

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

##动态计算的属性

如果你想在初始化对象时给对象添加一些动态的属性的话，可能会碰上些小麻烦。举下面的例子来说：

```js
type NeighborMap = { [name: string]: Node };
type Node = { name: string; neighbors: NeighborMap;}

function makeNode(name: string, initialNeighbor: Node): Node {
    var neighbors: NeighborMap = {};
    neighbors[initialNeighbor.name] = initialNeighbor;
    return { name: name, neighbors: neighbors };
}
```

我们需要先为neighbor-map创建一个对象变量，然后才能动态初始化它。在TypeScript 1.5中，我们可以让编译器替我们完成这类工作：

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

##字符串中的Unicode编码点转义

ES6引入了escapes，使得用户仅需要使用一次escape就能表示一个Unicode编码点（codepoint）。

举例来说，假设我们需要转义一个包含UTF-16/UCS2字符'𠮷'的字符串。其中'𠮷'由一个代理对（surrogate pair）来表示，这就是说它是由一对16比特的编码单元——`0xD842`和`0xDFB7`来表示的。这意味着你必须转义`"\uD842\uDFB7"`，但实际上我们很难辨别这是两个独立的字符还是一个代理对。

通过ES6的编码点转义，你可以通过像`"\u{20bb7}"`这样的转义来清楚地表达字符串或字符串模板中的字符表达的到底是什么。TypeScript会把这个字符串转换成ES3/ES5中的`"\uD842\uDFB7"`。

##在ES3/ES5中实现加标记的模板字符串

在TypeScript 1.4中，我们添加了对字符串模板的支持（ES3/ES5/ES6），以及对ES6中的标记模板（tagged templates）的支持。这里要感谢@ivogabe为我们提供的一些深思熟虑的想法和工作，使得我们在ES3和ES5中也可以使用标记模板。

当我们想要将代码转换成ES3/ES5时，下面的代码：

```js
function oddRawStrings(strs: TemplateStringsArray, n1, n2) {
    return strs.raw.filter((raw, index) => index % 2 === 1);
}

oddRawStrings `Hello \n${123} \t ${456}\n world`
```

会变成：

```js
function oddRawStrings(strs, n1, n2) {
    return strs.raw.filter(function (raw, index) {
        return index % 2 === 1;
    });
}
(_a = ["Hello \n", " \t ", "\n world"], _a.raw = ["Hello \\n", " \\t ", "\\n world"], oddRawStrings(_a, 123, 456));
var _a;
```

##可选给AMD依赖添加名称

`/// <amd-dependency path="x" />`会告诉编译器，由于当前模块的调用，有一个非TS模块的依赖需要被注入。然而TS代码并不能使用这些代码。

而新添加的`amd-dependency name`属性则允许我们给一个amd依赖命名。

```js
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA:MyType
moduleA.callStuff()
```

上面的代码生成的JS代码是：

```js
define(["require", "exports", "legacy/moduleA"], function (require, exports, moduleA) {
    moduleA.callStuff()
});
```

##支持用tsconfig.json配置项目

我们可以给一个文件夹添加一个`tsconfig.json`文件来表示当前文件夹是一个TypeScript项目的根目录。通过tsconfig.json，我们可以指定根文件（root files）以及编译选项。每个项目对会以下面的方式之一进行编译：

* 如果我们使用tsc指令但是不指定输入文件，编译器会就会从当前文件夹开始，向上寻找tsconfig.json文件。
* 如果我们使用tsc指令但是不指定输入文件，那我们可以使用-project（或 -p）命令行选项来指定包含tsconfig.json文件的文件夹。

__例子:__

```js
{
    "compilerOptions": {
        "module": "commonjs",
        "noImplicitAny": true,
        "sourceMap": true,
    }
}
```

你可以查看tsconfig.json的维基页面获取详细信息。

##`--rootDir`命令行

在进行输出文件时使用`--outDir`选项会根据输入文件的路径结构来进行。编译器会以根目录下的文件的路径作为所有输入文件的最长路径截点（即路径不会超过根目录），使用每个输入文件的路径来放置输出文件。

但有时候我们并不希望这样。比如我们输入`FolderA\FolderB\1.ts`和`FolderA\FolderB\2.ts`，则输出文件都会出现在一个`FolderA\FolderB\`这样的镜像结构的文件中。如果我们再增加一个`FolderA\3.ts`作为输入文件，则这个文件对应的输出文件就会出现在一个`FolderA\`文件中。

而`--rootDir`允许我们指定那些输出时，其路径要被镜像的文件夹，来代替计算输出路径。
