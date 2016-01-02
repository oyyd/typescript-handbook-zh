# 类型兼容性
TypeScript中的类型之间是否兼容，取决于其结构性子类型（structural subtyping）。结构性子类型是仅根据类型的成员来判断类型之间是否兼容，它和名义类型（nominal typing）形成了鲜明的对比。让我们来看看下面的代码：

```js
interface Named {
    name: string;
}

class Person {
    name: string;
}

var p: Named;
// OK, because of structural typing
p = new Person();
```

因为Person类并没有把它自己明确地描述为Named接口的实现，所以在像C#和Java这样的名义型类型的语言中，等价的代码会抛出错误。

TypeScript的结构性类型系统（structural type system）是依据JavaScript代码的典型写法设计而来的。因为JavaScript中会广泛使用函数表达式和对象字面量，所以用结构性类型系统代替名义性的结构系统来表达JavaScript代码之间关系会显得更加自然。

## 关于可靠性
TypeScript中的类型系统允许一些特定的操作，这些操作虽然在编译阶段是不可预测的，但TypeScript却可以保证它们的安全性。当类型系统有这样的属性时，我们就说它是"不可靠"的。TypeScript所允许的这些不可靠的行为都是经过仔细考虑的。通过这个文档，我们将阐述这些行为会在何时产生，以及这些行为产生背后的情景与动机。

## 起步
TypeScript的结构性类型系统的一个基本原则是：如果y拥有x上的所有成员，我们就说x与y是兼容的。举例来说：

```js
interface Named {
    name: string;
}

var x: Named;
// y’s inferred type is { name: string; location: string; }
var y = { name: 'Alice', location: 'Seattle' };
x = y;
```

当编译器在检查y能否赋值给x时，它会检查x上的每个属性是否都能在y上被找到对应的，兼容的属性。在这个例子中，y必须有一个名为‘name’的string属性，我们才能说它和x兼容。因为这里y确实有，所以这个赋值是被允许的。

在检查用来调用函数的参数时，这个规则也同样适用：

```js
function greet(n: Named) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
```

记住虽然‘y’有一个额外的‘location’属性，但这里并不会产生错误。只有目标类型（这个例子中为‘Named’）的成员会被用来检查它们之间的兼容性。

这个比较的过程会递归地进行，以遍历这个类型的每一个成员及其子成员。

## 比较两个函数
当我们在比较原生的类型（primitive types）和对象类型（object types）时，整个过程会直接了当。让我们从两个只有参数列表不同的函数这个基本的例子说起：

```js
var x = (a: number) => 0;
var y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

当检查x能否赋值给y时，我们首先会检查它们的参数列表。对于y中的每个参数，我们必须能在x中也找到对应的，兼容类型的参数，我们才能说它没有问题。注意参数的名称并不在考虑范围之内，我们只关注它们的类型。在这个例子中，x中的每个参数都能对应y上的参数，所以这个赋值是被允许的。

而第二个赋值就会产生一个错误。因为y需要的第二个参数‘x’并没有，所以这个赋值是不被允许的。

你可能会好奇为什么我们会允许像上面y = x这样'丢弃'参数。实际上在在JavaScript中，忽略额外的函数参数的情况非常普遍。比如Array#forEach会提供三个参数给回调函数：数组元素，它的索引（index）以及包含这个元素的数组。所以允许提供一个只使用第一个参数的回调函数是很有用的：

```js
var items = [1, 2, 3];

// Don't force these extra arguments
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach((item) => console.log(item));
```

现在再让我们看看函数的返回类型是如何被处理的。让我们使用两个只有返回类型不一样的函数：

```js
var x = () => ({name: 'Alice'});
var y = () => ({name: 'Alice', location: 'Seattle'});

x = y; // OK
y = x; // Error because x() lacks a location property
```

类型系统会强制要求原函数的返回类型是目标函数的返回类型的子类型。

### 函数参数双向协变（Bivariance）
当我们在比较函数参数的类型时，如果原来的参数可以赋值给目标参数的话，那么赋值就会成功。反之则会失败。由于我们在最终调用函数时，可能调用的是某个只需要特定类型参数的函数，而却给它传入了类型更宽泛的参数，所以这种做法理论上并不安全。但实际上这种类型的错误是很少见的，并且允许这种做法能允许我们使用更多在JavaScript上通用的模式。下面是一个简短的例子：

```js
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y));
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + ',' + e.y)));

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

### 可选参数和剩余参数
当我们在比较函数之间的兼容性时，可选参数与必选参数之间是可以互换的。源类型（source type）上额外的可选参数不会产生错误，目标类型（target type）上的可选参数即便没有对应的参数传入也不会产生错误。

如果一个函数有剩余参数的话，剩余参数就会被当成是无数个可选参数。

虽然这种做法从类型系统的角度上来看是不可靠的，但是从运行的角度来说，可选参数做法并不是那么容易实现的。因为对于大多数函数而言，在可选参数的位置上传入个‘undefined’也是等价的。

使用函数的常见的模式之一是：传入一个回调函数并执行它。在这一过程中，调用函数参数的数量对于开发人员来说是可以预见的，但类型系统却无从得知参数数量。下面这个例子正体现了这一点：

```js
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));
```

### 函数与重载
对于有重载的函数来说，源类型上的每个重载都需要在目标类型上有一个可兼容的签名（signature）。这可以确保我们在任意状况下都能够像调用源函数一样调用目标函数。在检查兼容性时，函数上特定的重载签名（使用字面量的重载）并不参与检查。

## 枚举
枚举和数字之间是相互兼容的，不同枚举类型的枚举值之间是不兼容的。举例来说：

```js
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

var status = Status.Ready;
status = Color.Green;  //error
```

## 类
类和对象字面量类型及接口相似，但它们同时拥有静态部分和实例部分。当我们在比较同一个类下的两个对象之间兼容性时，我们只比较实例上的成员。静态成员和构造函数不会影响它们的兼容性。

```js
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

var a: Animal;
var s: Size;

a = s;  //OK
s = a;  //OK
```

### 类中的私有成员
类中的私有成员会影响它们的兼容性。当我们在检查类实例的兼容性时，如果这个实例包含一个私有成员，那么只有在目标类型上也包含一个来源于同一个类的同一个私有成员，我们才认为它们是兼容的。这意味这一个类和它的超类是兼容的，但和另一个与它结构相同而继承结构不同的类是不兼容的。

## 泛型
由于TypeScript是结构性类型系统，所以当类型参数被用作成员类型的一部分时，它只对使用了类型参数的成员产生影响。举例来说：

```js
interface Empty<T> {
}
var x: Empty<number>;
var y: Empty<string>;

x = y;  // okay, y matches structure of x
```

在上面的例子中，由于x和y的结构中并没有使用类型参数，所以它们是兼容的。现在让我们给Empty<T>添加一个成员看看结果如何：

```js
interface NotEmpty<T> {
    data: T;
}
var x: NotEmpty<number>;
var y: NotEmpty<string>;

x = y;  // error, x and y are not compatible
```

在这种情况下，使用了类型参数，并使其生效的泛型类型和非泛型类型没有什么不同。

对于没有使用指定的类型参数的泛型类型来说，所有未指定类型的参数都会被当作'any'类型来进行兼容性检查。检查方式和非泛型类型是一样的。

举例来说：

```js
var identity = function<T>(x: T): T {
    // ...
}

var reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // Okay because (x: any)=>any matches (y: any)=>any
```

## 进阶话题

### 子类型 vs 赋值

我们一直在使用'兼容'（compatible）这个词，但它本身并不是这门语言规定中的细则。实际上TypeScript中有两种类型的兼容：子类型上的和赋值上的。它们之间的不同只在于，赋值时会有额外的子类型兼容性。它会允许把'any'或枚举类型赋值为其他类型，或把'any'或枚举类型赋值给其他类型，其中枚举类型的数值必须对应。

TypeScript会根据场景的不同使用两种兼容机制。从实际角度出发，类型兼容性会由赋值兼容性来决定，甚至是在implements和extends子句上。你可以查阅TypeScript上的细则以获取更多信息。
