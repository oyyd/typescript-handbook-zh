#接口

$One of TypeScript's core principles is that type-checking focuses on the 'shape' that values have. This is sometimes called "duck typing" or "structural subtyping". In TypeScript, interfaces fill the role of naming these types, and are a powerful way of defining contracts within your code as well as contracts with code outside of your project.
$$TypeScript的核心原则之一，是类型检查会集中关注数据的“结构”（shape）。这一行为有时被称作“鸭子类型”（duck typing）或“结构子类型化”（structural subtyping）。在TypeScript中，接口起到了为这些数据类型命名的作用，同时接口也是定义你代码之间的关系，或你的代码和其他项目代码之间关系的有效方法。

##我们的第一个接口
$The easiest way to see how interfaces work is to start with a simple example:
$$让我们来看看下面这个简单的例子，来了解接口是如何工作的：

```js
function printLabel(labelledObj: {label: string}) {
  console.log(labelledObj.label);
}

var myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

$The type-checker checks the call to 'printLabel'. The 'printLabel' function has a single parameter that requires that the object passed in has a property called 'label' of type string. Notice that our object actually has more properties than this, but the compiler only checks to that at least the ones required are present and match the types required.
$$类型检查器会检查'printLabel'的调用。其中'printLabel'方法有一个参数，我们需要给这个参数传入一个带有名为'label'的字符串类型属性的对象。注意我们传入的这个对象实际上不只有'label'属性，但编译器只检查那些指定的属性，查看它们的类型是否相符。

$We can write the same example again, this time using an interface to describe the requirement of having the 'label' property that is a string:
$$让我们重写上面的例子，这次我们将使用接口来描述参数的需求，即传入的对象要有字符串类型的label属性。

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

$The interface 'LabelledValue' is a name we can now use to describe the requirement in the previous example. It still represents having a single property called 'label' that is of type string. Notice we didn't have to explicitly say that the object we pass to 'printLabel' implements this interface like we might have to in other languages. Here, it's only the shape that matters. If the object we pass to the function meets the requirements listed, then it's allowed.
$$我们可以用这个名为'LabelledValue'的接口来描述我们前面例子中的需求。它仍旧表示需要有一个名为'label'的字符串属性。值得注意的是，与其他编程语言不同，我们不需要明确地说
传给'printLabel'的对象实现了这个接口。这里只关注数据的“结构”。只要我们传给函数的对象满足指定的需求，那这个对象就是合法的。

$It's worth pointing out that the type-checker does not require that these properties come in any sort of order, only that the properties the interface requires are present and have the required type.
$$必须指出的是，类型检查器并不要求这些属性遵循一定的顺序。只要接口要求的属性存在，并符合类型即可。

##可选属性（Optional Properties）
$Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all. These optional properties are popular when creating patterns like "option bags" where the user passes an object to a function that only has a couple properties filled in.
$$接口中的属性并不都是必要的。在遵循一定的条件时，有些属性甚至可以不存在。在创建“option bags”这样的模式时，用户传给函数作为参数的对象，往往只包含部分属性在里面。在这种情况下，可选属性就显得很有用了。

$Here's as example of this pattern:
$$下面是这种模式的一个例子：

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

$Interfaces with optional properties are written similar to other interfaces, which each optional property denoted with a '?' as part of the property declaration.
$$除了在声明可选属性时需要加上'?'作为标识以外，带有可选属性的接口的写法与其他接口相似。

$The advantage of optional properties is that you can describe these possibly available properties while still also catching properties that you know are not expected to be available. For example, had we mistyped the name of the property we passed to 'createSquare', we would get an error message letting us know:
$$使用可选属性的优势在于，我们可以在描述可能存在的属性的同时，捕捉那些我们不希望存在的属性。举例来说，如果我们错误地拼写了传给'createSquare'方法的属性名的话，就会有一条错误信息提示我们：

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
##函数类型
$Interfaces are capable of describing the wide range of shapes that JavaScript objects can take. In addition to describing an object with properties, interfaces are also capable of describing function types.
$$接口可以描述各式各样的JavaScript对象。然而我们除了用接口来描述一个对象的属性以外，也可以用它来描述函数类型。

$To describe a function type with an interface, we give the interface a call signature. This is like a function declaration with only the parameter list and return type given.
$$我们需要给接口一个调用标记来描述函数类型。它看起来就像是只有参数列表和返回类型的函数的定义。

```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

$Once defined, we can use this function type interface like we would other interfaces. Here, we show how you can create a variable of a function type and assign it a function value of the same type.
$$定义好了这个接口以后，我们就可以像使用其他接口一样使用这个函数类型接口。下面展示了我们要如何创建一个函数类型变量并给它赋值一个同样类型的函数值。

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

$For function types to correctly type-check, the name of the parameters do not need to match. We could have, for example, written the above example like this:
$$为了能正确地对函数类型进行类型检查，我们允许参数名称与接口不一致。就是说上面的例子也可以这么写：

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

$Function parameters are checked one at a time, with the type in each corresponding parameter position checked against each other. Here, also, the return type of our function expression is implied by the values it returns (here false and true). Had the function expression returned numbers or strings, the type-checker would have warned us that return type doesn't match the return type described in the SearchFunc interface.
$$在对函数的参数进行类型检查时，同一时间我们只会对一个参数进行类型检查，检查在接口对应位置上的参数的类型与其是否一致。而我们也会对函数表达式的返回类型进行检查（这里是true和false）。如果这里函数返回的是数字或字符串，那类型检查器就会警告我们返回的类型与SearchFunc接口不相符。

##数组类型
$Similarly to how we can use interfaces to describe function types, we can also describe array types. Array types have an 'index' type that describes the types allowed to index the object, along with the corresponding return type for accessing the index.
$$我们也可以用接口来描述数组类型，它的声明方式与函数类型相似。数组类型会有一个'index'类型，我们用它来表示数组索引（数组下标）的类型。这样我们也需要索引所对应的返回值的类型。

```js
interface StringArray {
  [index: number]: string;
}

var myArray: StringArray;
myArray = ["Bob", "Fred"];
```

$There are two types of supported index types: string and number. It is possible to support both types of index, with the restriction that the type returned from the numeric index must be a subtype of the type returned from the string index.
$$TypeScript支持两种索引类型：string和number。同时使用这两种类型的索引也是可能的，只要我们保证数字类型的索引所对应的值的类型，必须是字符串索引对应的值的类型的子类型。

$While index signatures are a powerful way to describe the array and 'dictionary' pattern, they also enforce that all properties match their return type. In this example, the property does not match the more general index, and the type-checker gives an error:
$$虽然索引标识是描述数组和字典类型的数据的好方法，它同时也会强迫其他所有属性都与索引的返回类型相同。在下面的例子中，'length'属性的类型不符合索引的返回类型，这会导致类型检查抛出错误：


```js
interface Dictionary {
  [index: string]: string;
  length: number;    // error, the type of 'length' is not a subtype of the indexer
}
```

##类的类型
###实现一个接口
$One of the most common uses of interfaces in languages like C# and Java, that of explicitly enforcing that a class meets a particular contract, is also possible in TypeScript.
$$在C#和Java中，让一个类符合某种特定的约定，是一种很常见的接口的使用方式。在TypeScript中我们也可以这样使用接口。


```js
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

$You can also describe methods in an interface that are implemented in the class, as we do with 'setTime' in the below example:
$$我们可以在一个接口中描述一个类需要实现的方法。就像下面的例子中的'setTime'方法：

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

$Interfaces describe the public side of the class, rather than both the public and private side. This prohibits you from using them to check that a class also has particular types for the private side of the class instance.
$$接口只能描述类的公共部分，而不关注私有部分。这种机制不允许我们通过接口来检查一个类的实例的私有部分。

###类中的静态部分和实例部分的区别
$When working with classes and interfaces, it helps to keep in mind that a class has two types: the type of the static side and the type of the instance side. You may notice that if you create an interface with a construct signature and try to create a class that implements this interface you get an error:
$$当使用类和接口时，我们应该要记得一个类有静态部分和实例特有的部分。你可能注意到了，如果创建一个带有构造函数标记的接口，并尝试创建一个类来实现这个接口的话，我们会收到个错误：

```js
interface ClockInterface {
    new (hour: number, minute: number);
}

class Clock implements ClockInterface  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

$This is because when a class implements an interface, only the instance side of the class is checked. Since the constructor sits in the static side, it is not included in this check.
$$这是因为当一个类实现一个接口时，只有实例的部分会被进行检查。构造函数属于静态的部分，它并不在检查的范围之内。

$Instead, you would need to work with the 'static' side of the class directly. In this example, we work with the class directly:
$$对应地，我们应该直接检查类的静态部分。就像在下面的例子中，我直接检查类本身：

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

##扩展接口
$Like classes, interfaces can extend each other. This handles the task of copying the members of one interface into another, allowing you more freedom in how you separate your interfaces into reusable components.
$$同类一样，接口也可以相互扩展。扩展机制负责将一个接口中的成员拷贝到另一个接口中，这意味着我们可以根据自己的意愿把接口分离成可重用的组件。

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

$An interface can extend multiple interfaces, creating a combination of all of the interfaces.
$$一个接口可以扩展多个接口，从而成为多接口的组合。

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

##混合类型（Hybrid Types）
$As we mentioned earlier, interfaces can describe the rich types present in real world JavaScript. Because of JavaScript's dynamic and flexible nature, you may occasionally encounter an object that works as a combination of some of the types described above.
$$就像我们之前提到过的，接口可以描述现实中JavaScript所能表现的丰富的数据类型。由于JavaScript动态、灵活的特性，我们有时可能会碰到需要综合使用前面描述的接口的使用方法，来处理一个对象的情景。

$One such example is an object that acts as both a function and an object, with additional properties:
$$举个例子，一个带有额外属性的函数：

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

$When interacting with 3rd-party JavaScript, you may need to use patterns like the above to fully-describe the shape of the type.
$$当同第三方JavaScript代码进行交互时，我们可能就需要使用上面的模式，来完整地描述一个数据的类型和结构。
