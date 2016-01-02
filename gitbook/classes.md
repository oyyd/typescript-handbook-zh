# 类
传统的JavaScript主要用函数和原型继承作为构建可重用部件的基本方法。然而这对于习惯面向对象方法的程序员来说有些别扭。从下一个版本的JavaScript，即ECMAScript 6开始，JavaScript程序员将可以用基于类的面向对象来构建应用，而TypeScript则允许开发者现在就使用这些新技术。TypeScript将它们编译成可在主流浏览器和平台上运行的JavaScript，从而使得开发者不必等待下一个版本的JavaScript。

## 类
让我们来看类的一个简单例子：

```js
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

var greeter = new Greeter("world");
```

如果你曾经使用过C#或Java，那你应该对上面的语法很熟悉。我们声明了一个有三个成员的类'Greeter'，这三个成员分别为'greeting'属性、构造函数和'greet'方法。

你会注意到当我们在类中使用某个成员时，我们使用了'this.'前缀。这表明它是对类成员的一次访问。

代码的最后一行，我们用'new'操作符构建了一个Greeter类的实例。构造过程是：调用我们先前定义的构造函数，创建了一个Greeter类型的新对象，执行构造函数初始化这个对象。

## 继承
我们可以在TypeScript中使用常见的面向对象模式。而在使用类的编程中，最基本的一个模式便是通过继承来扩展已有的类，创建新的类。

让我们来看一个例子：

```js
class Animal {
    name:string;
    constructor(theName: string) { this.name = theName; }
    move(meters: number = 0) {
        alert(this.name + " moved " + meters + "m.");
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(meters = 5) {
        alert("Slithering...");
        super.move(meters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(meters = 45) {
        alert("Galloping...");
        super.move(meters);
    }
}

var sam = new Snake("Sammy the Python");
var tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

这个例子涵盖了不少其他语言中常见的，同时也属于TypeScript的继承特性。我们看到这里使用了'extends'关键字来创建一个子类。这里的'Horse'和'Snake'继承超类'Animal'并能访问超类的成员。

这个例子同时也展示了我们可以通过在子类上进行特定的定义以重写超类中的方法。这里的'Snake'和'Horse'都创建了一个'move'方法,来重写'Animal'中的'move'方法，从而给予每个类特定的功能。

## Private/Public修饰语
### 默认为Public
你可能已经注意到了，在前面的例子中，我们没有用关键词'public'来标识类成员的可见性。像在C#等语言中，每个对外部可见的成员都需要用'public'进行明确地标识。而在TypeScript中，每个成员都被默认为公有。

你仍旧可以将一个成员标识为private，这样你就能够控制对类外部来说可见的部分。我们可以像下面这样来写前面的例子：

```js
class Animal {
    private name:string;
    constructor(theName: string) { this.name = theName; }
    move(meters: number) {
        alert(this.name + " moved " + meters + "m.");
    }
}
```

### 理解private
TypeScript使用结构化类型系统（structural type system）。当我们比较两种不同的数据类型时，我们会忽略它们是怎么来的。只要它们的每个成员都是一致的，我们就说这两种类型是一致的。

而当比较拥有私有成员的类型时，情况会稍有不同。当比较两种类型是否兼容时，如果其中一种类型拥有私有成员，那么只有当另一种类型也对应拥有具有相同定义的私有成员时，我们才说这两种类型是兼容的。

为了更好地理解这是怎么回事，我们可以看看下面的例子：

```js
class Animal {
    private name:string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
  constructor() { super("Rhino"); }
}

class Employee {
    private name:string;
    constructor(theName: string) { this.name = theName; }
}

var animal = new Animal("Goat");
var rhino = new Rhino();
var employee = new Employee("Bob");

animal = rhino;
animal = employee; //error: Animal and Employee are not compatible
```

在这个例子中，我们有一个'Animal'和'Animal'的子类——'Rhino'。同时我们也有一个看起来和'Animal'结构一样的'Employee'。我们生成了这些类的实例并尝试把它们互相赋值给对方，来看看会产生什么结果。因为'Animal'和'Rhino'的'private name: string'声明的来源相同，私有部分相同，所以我们说它们是兼容的。而'Employee'的则不同。当尝试将一个'Employee'的实例赋值给'Animal'类型的变量时，我们会得到这些类型不兼容的错误。尽管'Employee'同样有一个名为'name'的私有成员，但它与'Animal'中的'name'来源不同。

### 参数属性
'public'和'private'关键字同样也允许我们通过创建参数属性，来便捷地创建并初始化类的成员的。这些属性允许我们只通过一个步骤就创建并初始化一个成员。下面是前面例子的另一个版本。注意这里我们没有用'theName'，而是直接在构造函数里声明了个'private name: string'的参数，就并创建和初始化了'name'成员。

```js
class Animal {
    constructor(private name: string) { }
    move(meters: number) {
        alert(this.name + " moved " + meters + "m.");
    }
}
```

这里使用'private'创建并初始化了一个私有成员。这对'public'来说也是相似的。

## 访问器（Accessors）
TypeScript支持用getters/setters与对象中的成员进行交互。这为我们提供了一个控制对对象成员的访问的好方法。

让我们用'get'和'set'来重写一个类。首先是一个没有getters和setters的例子。

```js
class Employee {
    fullName: string;
}

var employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

虽然允许直接设置fullName确实很方便，但如果我们能胡乱地设置它的值话，这种方式就可能会给我们来带麻烦。

在下面这个版本的例子中，在允许用户修改雇员的信息之前，我们会检查并确保用户提供了密码。我们用一个'set'方法替代了直接访问'fullName'的方式，并对密码进行了检查。同时我们也对应添加了一个'get'方法来保证前面例子的代码在这里也能够继续运行。


```js
var passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            alert("Error: Unauthorized update of employee!");
        }
    }
}

var employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

为了证明我们的存取器确实在检查密码，我们可以尝试修改一下密码。结果我们得到了一个警告，提示我们没有获取和修改employee的权利。

注意：要使用访问器的话，我们需要设置编译器生成ECMAScript 5代码。

## 静态属性

到目前为止，我们都在谈论类的实例上的成员，它们只有在对象被实例化后才能从该对象获取。但我们也可以给一个类创建静态成员，这些静态成员在类上就是可见的，而不是在实例生成后才能获得。在这个例子中，由于'origin'是所有'grids'都具备的一个通用的值，所以我们用'static'来声明'origin'。每一个实例都可以通过在成员名之前加上类的名字来获得静态成员，这和'this.'前缀很相似。这里我们在获取静态成员时，在前面加上了'Grid.'。

```js
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        var xDist = (point.x - Grid.origin.x);
        var yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

var grid1 = new Grid(1.0);  // 1x scale
var grid2 = new Grid(5.0);  // 5x scale

alert(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
alert(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

## 高级技巧
### 构造函数
当你在TypeScript中声明一个类时，实际上你同时创建了多个定义。其中第一个创建的便是类对应的实例的类型。

```js
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

var greeter: Greeter;
greeter = new Greeter("world");
alert(greeter.greet());
```

这里的'var greeter: Greeter'表示我们把Greeter当作Greeter实例的类型。这种做法都快成为习惯面向对象的程序员的天性了。

我们也创建了一个我们称作构造函数的函数。当我们'new'一个实例时这个方法就会被调用。让我们看看前面例子的代码所编译成的JavaScript代码，来看看这到底是怎么回事。

```js
var Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();

var greeter;
greeter = new Greeter("world");
alert(greeter.greet());
```

这里的'var Greeter'被赋值给了构造函数。当我们使用'new'并运行这个函数时，我们获得了这个类的一个实例。这个构造函数同样也包含了这个类所有的静态成员。我们可以认为每个类中都有属于实例的部分和静态部分。

让我们稍微修改一下这个例子，看看会有什么不同：

```js
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

var greeter1: Greeter;
greeter1 = new Greeter();
alert(greeter1.greet());

var greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";
var greeter2:Greeter = new greeterMaker();
alert(greeter2.greet());
```

在这个例子中，'greeter1'运行得和之前差不多。我们生成了'Greeter'类的实例并使用了这个实例对象。这种用法我们之前已经见过了。

接着，我们直接使用这个类。我们创建了一个名为'greeterMaker'的新变量。这个变量获得的是这个类本身，或者应该说是这个类的构造函数。这里我们用'typeof Greeter'的意义是"给我Greeter类本身的类型"而不是实例的类型。或者更准确地来讲应该是"给我这个名为Greeter的标识的类型"，即构造函数的类型。Greeter类型（的变量）会包含所有Greeter的静态成员，这些静态成员会存在于Greeter构造函数的里面。为了展示这一点，我们在'greeterMaker'上使用'new'来创建'Greeter'的新实例，并像之前那样使用他们。

### 把一个类当作接口来用

就像我们前面说过的，一个类的声明会创造两个东西：一个是这个类的实例的类型，另一个是构造函数。因为类会创造类型，所以我们可以在使用接口的地方使用类。

```js
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

var point3d: Point3d = {x: 1, y: 2, z: 3};
```
