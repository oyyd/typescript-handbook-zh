# 接口

TypeScript的核心原则之一，是类型检查会集中关注数据的“结构”（shape）。这一行为有时被称作“鸭子类型”（duck typing）或“结构子类型化”（structural subtyping）。在TypeScript中，接口起到了为这些数据类型命名的作用，同时接口也是定义你代码之间的关系，或你的代码和其他项目代码之间关系的有效方法。

## 我们的第一个接口
让我们来看看下面这个简单的例子，来了解接口是如何工作的：

```js
function printLabel(labelledObj: {label: string}) {
  console.log(labelledObj.label);
}

var myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

类型检查器会检查'printLabel'的调用。其中'printLabel'方法有一个参数，我们需要给这个参数传入一个带有名为'label'的字符串类型属性的对象。注意我们传入的这个对象实际上不只有'label'属性，但编译器只检查那些指定的属性，查看它们的类型是否相符。

让我们重写上面的例子，这次我们将使用接口来描述参数的需求，即传入的对象要有字符串类型的label属性。

```js
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

var myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

我们可以用这个名为'LabelledValue'的接口来描述我们前面例子中的需求。它仍旧表示需要有一个名为'label'的字符串属性。值得注意的是，与其他编程语言不同，我们不需要明确地说
传给'printLabel'的对象实现了这个接口。这里只关注数据的“结构”。只要我们传给函数的对象满足指定的需求，那这个对象就是合法的。

必须指出的是，类型检查器并不要求这些属性遵循一定的顺序。只要接口要求的属性存在，并符合类型即可。

## 可选属性（Optional Properties）
接口中的属性并不都是必要的。在遵循一定的条件时，有些属性甚至可以不存在。在创建“option bags”这样的模式时，用户传给函数作为参数的对象，往往只包含部分属性在里面。在这种情况下，可选属性就显得很有用了。

下面是这种模式的一个例子：

```js
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
  var newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

var mySquare = createSquare({color: "black"});
```

除了在声明可选属性时需要加上'?'作为标识以外，带有可选属性的接口的写法与其他接口相似。

使用可选属性的优势在于，我们可以在描述可能存在的属性的同时，捕捉那些我们不希望存在的属性。举例来说，如果我们错误地拼写了传给'createSquare'方法的属性名的话，就会有一条错误信息提示我们：

```js
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
  var newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.collor;  // Type-checker can catch the mistyped name here
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

var mySquare = createSquare({color: "black"});
```
## 函数类型
接口可以描述各式各样的JavaScript对象。然而我们除了用接口来描述一个对象的属性以外，也可以用它来描述函数类型。

我们需要给接口一个调用标记来描述函数类型。它看起来就像是只有参数列表和返回类型的函数的定义。

```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

定义好了这个接口以后，我们就可以像使用其他接口一样使用这个函数类型接口。下面展示了我们要如何创建一个函数类型变量并给它赋值一个同样类型的函数值。

```js
var mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  var result = source.search(subString);
  if (result == -1) {
    return false;
  }
  else {
    return true;
  }
}
```

为了能正确地对函数类型进行类型检查，我们允许参数名称与接口不一致。就是说上面的例子也可以这么写：

```js
var mySearch: SearchFunc;
mySearch = function(src: string, sub: string) {
  var result = src.search(sub);
  if (result == -1) {
    return false;
  }
  else {
    return true;
  }
}
```

在对函数的参数进行类型检查时，同一时间我们只会对一个参数进行类型检查，检查在接口对应位置上的参数的类型与其是否一致。而我们也会对函数表达式的返回类型进行检查（这里是true和false）。如果这里函数返回的是数字或字符串，那类型检查器就会警告我们返回的类型与SearchFunc接口不相符。

## 数组类型
我们也可以用接口来描述数组类型，它的声明方式与函数类型相似。数组类型会有一个'index'类型，我们用它来表示数组索引（数组下标）的类型。这样我们也需要索引所对应的返回值的类型。

```js
interface StringArray {
  [index: number]: string;
}

var myArray: StringArray;
myArray = ["Bob", "Fred"];
```

TypeScript支持两种索引类型：string和number。同时使用这两种类型的索引也是可能的，只要我们保证数字类型的索引所对应的值的类型，必须是字符串索引对应的值的类型的子类型。

虽然索引标识是描述数组和字典类型的数据的好方法，它同时也会强迫其他所有属性都与索引的返回类型相同。在下面的例子中，'length'属性的类型不符合索引的返回类型，这会导致类型检查抛出错误：


```js
interface Dictionary {
  [index: string]: string;
  length: number;    // error, the type of 'length' is not a subtype of the indexer
}
```

## 类的类型
### 实现一个接口
在C#和Java中，让一个类符合某种特定的约定，是一种很常见的接口的使用方式。在TypeScript中我们也可以这样使用接口。


```js
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

我们可以在一个接口中描述一个类需要实现的方法。就像下面的例子中的'setTime'方法：

```js
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface  {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

接口只能描述类的公共部分，而不关注私有部分。这种机制不允许我们通过接口来检查一个类的实例的私有部分。

### 类中的静态部分和实例部分的区别
当使用类和接口时，我们应该要记得一个类有静态部分和实例特有的部分。你可能注意到了，如果创建一个带有构造函数标记的接口，并尝试创建一个类来实现这个接口的话，我们会收到个错误：

```js
interface ClockInterface {
    new (hour: number, minute: number);
}

class Clock implements ClockInterface  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

这是因为当一个类实现一个接口时，只有实例的部分会被进行检查。构造函数属于静态的部分，它并不在检查的范围之内。

对应地，我们应该直接检查类的静态部分。就像在下面的例子中，我直接检查类本身：

```js
interface ClockStatic {
    new (hour: number, minute: number);
}

class Clock  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

var cs: ClockStatic = Clock;
var newClock = new cs(7, 30);
```

## 扩展接口
同类一样，接口也可以相互扩展。扩展机制负责将一个接口中的成员拷贝到另一个接口中，这意味着我们可以根据自己的意愿把接口分离成可重用的组件。

```js
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

var square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

一个接口可以扩展多个接口，从而成为多接口的组合。

```js
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

var square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## 混合类型（Hybrid Types）
就像我们之前提到过的，接口可以描述现实中JavaScript所能表现的丰富的数据类型。由于JavaScript动态、灵活的特性，我们有时可能会碰到需要综合使用前面描述的接口的使用方法，来处理一个对象的情景。

举个例子，一个带有额外属性的函数：

```js
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

var c: Counter;
c(10);
c.reset();
c.interval = 5.0;
```

当同第三方JavaScript代码进行交互时，我们可能就需要使用上面的模式，来完整地描述一个数据的类型和结构。
