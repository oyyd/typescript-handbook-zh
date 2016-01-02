# 编写.d.ts文件
当我们要使用一个外部JavaScript库或是新的API时，我们需要用一个声明文件（.d.ts）来描述这个库的结构。本节会讲述写这种定义文件（definition files）时会涉及到的一些高级概念。之后会用一些例子，来展示这些概念所对应的定义文件描述。

## 指导与细则
### 工作流
写.d.ts文件最好的方式不是根据代码来写，而是根据文档来写。根据文档来写代码能够保证你要表达的东西不会被实现细节所影响。而且文档通常也比JS代码要容易理解。所以我们后面的例子都会假设你正在读一个解释表达代码例子的文档的情景来写。

### 命名空间
当你在定义接口时（比如说"options"对象），你可以决定是否要把这些类型放到一个模块中。你需要根据具体情况来做这个决定 -- 如果用户很可能时常需要声明这个类型的变量或参数，并且需要它的命名不与其他类型冲突的话，那你大可把它放到一个全局命名空间中。如果这个类型很可能不需要被直接引用，或是不太适合以一个独特的名字来命名的话，那你应该把它放在模块内以避免与其他类型发生冲突。

### 回调
很多JavaScript的库会事先把一个函数作为参数，并在之后用获取到的参数来调用它。当我们在写这种类型的函数签名（function signatures）时，我们不应该把它们当作是可选参数。我们需要认真考虑"我们需要传入什么参数"而不是"我们要用什么参数"。虽然TypeScript 从0.9.7版本开始不再限制我们传入函数作为可选参数，我们仍旧可以通过外部工具在参数的可选性上强制进行双向协变（bivariance）。

### 扩展性和声明合并
当我们在写定义文件时，我们需要格外注意TypeScript在扩展已有对象时的规则。你可以用匿名类型或接口来声明一个变量：

**匿名类型变量**

```js
declare var MyPoint: { x: number; y: number; };
```

**接口类型变量**

```js
interface SomePoint { x: number; y: number; }
declare var MyPoint: SomePoint;
```

从使用者的角度来说，这两中声明是等价的。但我们可以通过接口合并来扩展SomePoint类型：

```js
interface SomePoint { z: number; }
MyPoint.z = 4; // OK
```

你需要根据实际情况来决定是否允许你的声明通过这种方式被扩展。从这里也可以展示出你对这个库的想法。

### 解构类
TypeScript中的类会创建出两种独立的类型：一种是实例类型，它定义了类实例上的成员；另一种是构造函数类型，它定义了构造函数的成员。因为构造函数类型包括了类中的静态成员，我们可以把当作是"静态的"类型。

虽然我们可以使用typeof关键字来引用一个类中的静态部分，但在写定义文件时，我们有时候需要用被解构过的类。它能明确地将类中的实例部分和静态部分分开。

举个例子，从一个使用者的角度来看，下面的两种声明方式几乎是等价的：

**标准声明方式**

```js
class A {
    static st: string;
    inst: number;
    constructor(m: any) {}
}
```

**解构方式**

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

它们的不同之处在于：

我们可以用extends继承标准的类，但不能继承解构过的类。除非下一个版本的TypeScript允许这种继承表达式。

我们可以（通过声明合并）给标准的类和解构类上的静态部分添加成员。

You'll need to come up with sensible names for more types when writing a decomposed class
我们可以给解构过的类添加新的实例成员，但不能给标准类添加。在写解构类的时候，如果你想要添加更多类型的话，你可能需要想一些更有意义的名字。

### 命名习惯
总的来说，不要在接口前加I（比如：IColor）。因为TypeScript中接口的概念要比C#或Java更宽泛。IFoo这类命名习惯没有太多作用。

## 例子
来看看下面的这些例子。每个例子都先给出了一个库的使用方式，然后再给出对于这样的库来说比较合适的类型定义。如果一个库有多种比较合适的定义方式的话，这里会把它们都列举出来。

### Options对象
**用法**

```js
animalFactory.create("dog");
animalFactory.create("giraffe", { name: "ronald" });
animalFactory.create("panda", { name: "bob", height: 400 });
// Invalid: name must be provided if options is given
animalFactory.create("cat", { height: 32 });
```

**类型声明**

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

### 带有属性的函数
**用法**

```js
zooKeeper.workSchedule = "morning";
zooKeeper(giraffeCage);
```

**类型声明**

```js
// Note: Function must precede module
function zooKeeper(cage: AnimalCage);
module zooKeeper {
    var workSchedule: string;
}
```

### 用new调用的函数
**用法**

```js
var w = widget(32, 16);
var y = new widget("sprocket");
// w and y are both widgets
w.sprock();
y.sprock();
```

**类型声明**

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

### 全局/对外部不可知的（external-agnostic）函数库
**用法**

```js
// Either
import x = require('zoo');
x.open();
// or
zoo.open();
```

**类型声明**

```js
module zoo {
  function open(): void;
}

declare module "zoo" {
    export = zoo;
}
```

### 外部模块中的单个复杂的对象

**用法**

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

**类型声明**

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

### 回调
**用法**

```js
addLater(3, 4, (x) => console.log('x = ' + x));
```

**类型声明**

```js
// Note: 'void' return type is preferred here
function addLater(x: number, y: number, (sum: number) => void): void;
```
