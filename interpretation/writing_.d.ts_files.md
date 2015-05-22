#Writing .d.ts files
$When using an external JavaScript library, or new host API, you'll need to use a declaration file (.d.ts) to describe the shape of that library. This guide covers a few high-level concepts specific to writing definition files, then proceeds with a number of examples that show how to transcribe various concepts to their matching definition file descriptions.
$$当我们在使用一个外部的JavaScript库或是新的API时，我们需要用一个声明文件（.d.ts）来描述这个库的结构。本节指引将会涵盖我们在写这种定义文件（definition files）时会涉及到的一些高级理念，并辅以一些例子，来展示这些理念是如何通过定义文件中对应的描述实现的。

##Guidelines and Specifics
###Workflow
$The best way to write a .d.ts file is to start from the documentation of the library, not the code. Working from the documentation ensures the surface you present isn't muddied with implementation details, and is typically much easier to read than JS code. The examples below will be written as if you were reading documentation that presented example calling code.
$$写.d.ts文件最好的方式不是根据代码来写，而是根据文档来写。根据文档来写代码能够保证你要表达的东西不会被实现细节所影响。而且文档通常也比JS代码要容易理解。所以我们后面的例子都会通过以你正在读一个用文档来表达由代码组成的例子的情景来写。

###Namespacing
$When defining interfaces (for example, "options" objects), you have a choice about whether to put these types inside a module or not. This is largely a judgement call -- if the consumer is likely to often declare variables or parameters of that type, and the type can be named without risk of colliding with other types, prefer placing it in the global namespace. If the type is not likely to be referenced directly, or can't be named with a reasonably unique name, do use a module to prevent it from colliding with other types.
$$当你在定义接口时（比如说"options"对象），你可以决定是否要把这些类型放到一个模块中。你需要根据具体情况来做这个决定 -- 如果用户很可能会时常需要声明这个类型的变量或参数，并且需要它的命名不与其他类型冲突的话，那你大可把它放到一个全局命名空间中。如果这个类型很可能不需要被直接引用，或是不太适合以一个独特的名字来命名的话，那你应该把它放在模块内以避免与其他类型发生冲突。

###Callbacks
$Many JavaScript libraries take a function as a parameter, then invoke that function later with a known set of arguments. When writing the function signatures for these types, do not mark those parameters as optional. The right way to think of this is "What parameters will be provided?", not "What parameters will be consumed?". While TypeScript 0.9.7 and above does not enforce that the optionality, bivariance on argument optionality might be enforced by an external linter.
$$很多JavaScript的库会事先把一个函数作为参数，并在之后用获取到的参数来调用它。当我们在写这种类型的函数签名（function signatures）时，我们不应该把它们当作是可选参数。我们需要认真考虑"我们需要传入什么参数"而不是"我们要用什么参数"。虽然TypeScript 从0.9.7版本开始不再限制我们传入函数作为可选参数，我们仍旧可以通过外部工具来对参数的可选性强制进行双向协变（bivariance）。

###Extensibility and Declaration Merging
When writing definition files, it's important to remember TypeScript's rules for extending existing objects. You might have a choice of declaring a variable using an anonymous type or an interface type:

**Anonymously-typed var**

```js
declare var MyPoint: { x: number; y: number; };
```

**Interfaced-typed var**

```js
interface SomePoint { x: number; y: number; }
declare var MyPoint: SomePoint;
```

From a consumption side these declarations are identical, but the type SomePoint can be extended through interface merging:

```js
interface SomePoint { z: number; }
MyPoint.z = 4; // OK
```

Whether or not you want your declarations to be extensible in this way is a bit of a judgement call. As always, try to represent the intent of the library here.

###Class Decomposition
Classes in TypeScript create two separate types: the instance type, which defines what members an instance of a class has, and the constructor function type, which defines what members the class constructor function has. The constructor function type is also known as the "static side" type because it includes static members of the class.

While you can reference the static side of a class using the typeof keyword, it is sometimes useful or necessary when writing definition files to use the decomposed class pattern which explicitly separates the instance and static types of class.

As an example, the following two declarations are nearly equivalent from a consumption perspective:

**Standard**

```js
class A {
    static st: string;
    inst: number;
    constructor(m: any) {}
}
```

**Decomposed**

```js
interface A_Static {
    new(m: any): A_Instance;
    st: string;
}
interface A_Instance {
    inst: number;
}
declare var A: A_Static;
```

The trade-offs here are as follows:
Standard classes can be inherited from using extends; decomposed classes cannot. This might change in later version of TypeScript if arbitrary extends expressions are allowed.
It is possible to add members later (through declaration merging) to the static side of both standard and decomposed classes
It is possible to add instance members to decomposed classes, but not standard classes
You'll need to come up with sensible names for more types when writing a decomposed class

###Naming Conventions
In general, do not prefix interfaces with I (e.g. IColor). Because the concept of an interface in TypeScript is much more broad than in C# or Java, the IFoo naming convention is not broadly useful.

##Examples
Let's jump in to the examples section. For each example, sample usage of the library is provided, followed by the definition code that accurately types the usage. When there are multiple good representations, more than one definition sample might be listed.

###Options Objects
**Usage**

```js
animalFactory.create("dog");
animalFactory.create("giraffe", { name: "ronald" });
animalFactory.create("panda", { name: "bob", height: 400 });
// Invalid: name must be provided if options is given
animalFactory.create("cat", { height: 32 });
```

**Typing**

```js
module animalFactory {
    interface AnimalOptions {
        name: string;
        height?: number;
        weight?: number;
    }
    function create(name: string, animalOptions?: AnimalOptions): Animal;
}
```

###Functions with Properties
**Usage**

```js
zooKeeper.workSchedule = "morning";
zooKeeper(giraffeCage);
```

**Typing**

```js
// Note: Function must precede module
function zooKeeper(cage: AnimalCage);
module zooKeeper {
    var workSchedule: string;
}
```

###New + callable methods
**Usage**

```js
var w = widget(32, 16);
var y = new widget("sprocket");
// w and y are both widgets
w.sprock();
y.sprock();
```

**Typing**

```js
interface Widget {
    sprock(): void;
}

interface WidgetFactory {
    new(name: string): Widget;
    (width: number, height: number): Widget;
}

declare var widget: WidgetFactory;
```

###Global / External-agnostic Libraries
**Usage**

```js
// Either
import x = require('zoo');
x.open();
// or
zoo.open();
```

**Typing**

```js
module zoo {
  function open(): void;
}

declare module "zoo" {
    export = zoo;
}
```

###Single Complex Object in External Modules

**Usage**

```js
// Super-chainable library for eagles
import eagle = require('./eagle');
// Call directly
eagle('bald').fly();
// Invoke with new
var eddie = new eagle(1000);
// Set properties
eagle.favorite = 'golden';
```

**Typing**

```js
// Note: can use any name here, but has to be the same throughout this file
declare function eagle(name: string): eagle;
declare module eagle {
    var favorite: string;
    function fly(): void;
}
interface eagle {
    new(awesomeness: number): eagle;
}

export = eagle;
```

###Callbacks
**Usage**

```js
addLater(3, 4, (x) => console.log('x = ' + x));
```

**Typing**

```js
// Note: 'void' return type is preferred here
function addLater(x: number, y: number, (sum: number) => void): void;
```
