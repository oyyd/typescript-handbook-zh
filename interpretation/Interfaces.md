#接口（Interfaces）
One of TypeScript's core principles is that type-checking focuses on the 'shape' that values have. This is sometimes called "duck typing" or "structural subtyping". In TypeScript, interfaces fill the role of naming these types, and are a powerful way of defining contracts within your code as well as contracts with code outside of your project. 
类型检查将集中关注于数据的“形状”是TypeScript的核心设计之一。这有时又被称作“duck typing”或“structural subtyping”。在TypeScript中，接口起到了给这些数据类型命名的作用，并且接口也是定义你的代码与代码之间，或是你的代码和其他项目代码之间的关联的有效方法。

##Our First Interface
The easiest way to see how interfaces work is to start with a simple example:
让我们来看看下面这个简单的例子，来了解接口是如何工作的：

```
function printLabel(labelledObj: {label: string}) {
  console.log(labelledObj.label);
}

var myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

The type-checker checks the call to 'printLabel'. The 'printLabel' function has a single parameter that requires that the object passed in has a property called 'label' of type string. Notice that our object actually has more properties than this, but the compiler only checks to that at least the ones required are present and match the types required. 
类型检查器会检查对'printLabel'的调用。其中'printLabel'方法有一个参数，这个参数需要传入一个对象，并且这个对象上要有一个名为'label'的字符传类型的属性。注意我们传入的这个对象实际上不仅仅只有这一个参数，但编译器只检查那些被指定的参数，并检查他们的类型是否相符。

We can write the same example again, this time using an interface to describe the requirement of having the 'label' property that is a string:
让我们重写上面的例子，这次我们将用一个接口来描述这个参数需要有名为'label'的字符串属性的需求：

```
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

var myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

The interface 'LabelledValue' is a name we can now use to describe the requirement in the previous example. It still represents having a single property called 'label' that is of type string. Notice we didn't have to explicitly say that the object we pass to 'printLabel' implements this interface like we might have to in other languages. Here, it's only the shape that matters. If the object we pass to the function meets the requirements listed, then it's allowed.
我们可以用这个名为'LabelledValue'的接口来描述我们前面例子的需求。它仍旧表示有一个名为'printLabel'的字符串类型的属性的数据结构。值得注意的是，与其他编程语言不同，我们仍不确切地说传给'printLabel'接口的对象实现了这个接口，这里只关注数据的“形状”。只要我们传给函数的对象满足罗列出来的需求，这个对象就是被允许的。

It's worth pointing out that the type-checker does not require that these properties come in any sort of order, only that the properties the interface requires are present and have the required type.
值得指出的是，类型检查器并不要求这些属性遵循一定的顺序。只要接口要求的属性存在，并符合类型即可。

#Optional Properties
Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all. These optional properties are popular when creating patterns like "option bags" where the user passes an object to a function that only has a couple properties filled in.
一个接口中的属性并不都是必须的。在一定的条件下，有些属性甚至可以完全不存在。像是“option bags”这种模式中，用户传给函数作为参数的对象，往往只包含部分属性在里面。这时候可选属性就很有用了。

Here's as example of this pattern:
下面是这种模式的一个例子：

```
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

Interfaces with optional properties are written similar to other interfaces, which each optional property denoted with a '?' as part of the property declaration. 

The advantage of optional properties is that you can describe these possibly available properties while still also catching properties that you know are not expected to be available. For example, had we mistyped the name of the property we passed to 'createSquare', we would get an error message letting us know:

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
Function Types
Interfaces are capable of describing the wide range of shapes that JavaScript objects can take. In addition to describing an object with properties, interfaces are also capable of describing function types.

To describe a function type with an interface, we give the interface a call signature. This is like a function declaration with only the parameter list and return type given.

interface SearchFunc {
  (source: string, subString: string): boolean;
}

Once defined, we can use this function type interface like we would other interfaces. Here, we show how you can create a variable of a function type and assign it a function value of the same type.

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

For function types to correctly type-check, the name of the parameters do not need to match. We could have, for example, written the above example like this:

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

Function parameters are checked one at a time, with the type in each corresponding parameter position checked against each other. Here, also, the return type of our function expression is implied by the values it returns (here false and true). Had the function expression returned numbers or strings, the type-checker would have warned us that return type doesn't match the return type described in the SearchFunc interface.
Array Types
Similarly to how we can use interfaces to describe function types, we can also describe array types. Array types have an 'index' type that describes the types allowed to index the object, along with the corresponding return type for accessing the index.

interface StringArray {
  [index: number]: string;
}

var myArray: StringArray;
myArray = ["Bob", "Fred"];

There are two types of supported index types: string and number. It is possible to support both types of index, with the restriction that the type returned from the numeric index must be a subtype of the type returned from the string index.

While index signatures are a powerful way to describe the array and 'dictionary' pattern, they also enforce that all properties match their return type. In this example, the property does not match the more general index, and the type-checker gives an error:

interface Dictionary {
  [index: string]: string;
  length: number;    // error, the type of 'length' is not a subtype of the indexer
} 
Class Types
Implementing an interface
One of the most common uses of interfaces in languages like C# and Java, that of explicitly enforcing that a class meets a particular contract, is also possible in TypeScript.

interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

You can also describe methods in an interface that are implemented in the class, as we do with 'setTime' in the below example:

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

Interfaces describe the public side of the class, rather than both the public and private side. This prohibits you from using them to check that a class also has particular types for the private side of the class instance.
Difference between static/instance side of class
When working with classes and interfaces, it helps to keep in mind that a class has two types: the type of the static side and the type of the instance side. You may notice that if you create an interface with a construct signature and try to create a class that implements this interface you get an error:

interface ClockInterface {
    new (hour: number, minute: number);
}

class Clock implements ClockInterface  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

This is because when a class implements an interface, only the instance side of the class is checked. Since the constructor sits in the static side, it is not included in this check.

Instead, you would need to work with the 'static' side of the class directly. In this example, we work with the class directly:

interface ClockStatic {
    new (hour: number, minute: number);
}

class Clock  {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

var cs: ClockStatic = Clock;
var newClock = new cs(7, 30);
Extending Interfaces
Like classes, interfaces can extend each other. This handles the task of copying the members of one interface into another, allowing you more freedom in how you separate your interfaces into reusable components.

interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

var square = <Square>{};
square.color = "blue";
square.sideLength = 10;

An interface can extend multiple interfaces, creating a combination of all of the interfaces.

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
Hybrid Types
As we mentioned earlier, interfaces can describe the rich types present in real world JavaScript. Because of JavaScript's dynamic and flexible nature, you may occasionally encounter an object that works as a combination of some of the types described above. 

One such example is an object that acts as both a function and an object, with additional properties:

interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

var c: Counter;
c(10);
c.reset();
c.interval = 5.0;

When interacting with 3rd-party JavaScript, you may need to use patterns like the above to fully-describe the shape of the type.