# 泛型

构建部件是软件工程重要的一部分。这些部件不仅要有精心设计过的，高一致性的API，同时也要具有复用性。如果我们构建的部件不仅能够满足现在的需求，并且也能够应对未来的变化，那我们在构建大型系统时就能够更加地游刃有余。

在C#和Java这样的语言中创建可重用的部件时，我们最常用的工具之一便是泛型('generics')。它允许我们创建一个可同时作用在多种数据类型上的部件。这就使得用户在使用这些部件时可以用它们自己定义的类型。

## 泛型中的Hello World
让我们用泛型中的"hello world" —— identity函数来作为开始的例子。这个identity函数可以返回传入给它的任何类型的参数。你可以把它想成是'echo'命令。

如果不使用泛型的话，我们要么得给identity函数一个特定的类型：

```js
function identity(arg: number): number {
    return arg;
}
```

要么用'any'类型：

```js
function identity(arg: any): any {
    return arg;
}
```

虽然用'any'类型时，我们的函数也能够接收各种类型的'arg'，这样看起来也是泛用的。但实际上我们失去了函数返回时的类型信息。比如我们传入一个数字，但我们只能知道函数返回的是'any'类型。

取而代之的，我们需要有一种方式能够获取参数类型，并用这个类型作为函数返回值的类型。这里我们将使用一种特别的变量——类型变量。它只对类型起作用而不对值起作用。

```js
function identity<T>(arg: T): T {
    return arg;
}
```

我们现在要给identity函数添加一个类型变量'T'。通过这个'T'我们能够获取用户提供的数据类型（比如：number），然后我们就能在函数中使用这个类型。这里我们把'T'用在函数返回值的类型上。这样在看代码时，我们就知道参数的类型和函数返回的类型是一样的，TypeScript就可以在函数的内部或外部使用这个函数的类型信息。

因为这个版本的'identity'函数可以用在多种类型上，所以我们说它是泛用的（generic）。但这又不同于使用'any'的函数，因为它仍旧保留了准确的类型信息。它能够像我们的第一个'identity'函数那样把number作为参数类型和函数返回值类型。

定义完identity的泛型后，我们就可以通过两种方式来调用它。一种是传入所有的参数给函数，包括类型参数：

```js
var output = identity<string>("myString");  // type of output will be 'string'
```

这里我们把'T'设置为string（string同时也是传入函数的参数的类型）。类型变量要用<>而非()来包裹。

第二种方法可能更常见，即类型参数推断（type argument inference）。编译器会根据传入参数的类型来自动地设置T的值：

```js
var output = identity("myString");  // type of output will be 'string'
```

注意这里我们没有显式地用尖括号(<>)来传入类型，编译会根据"myString"来设置类型。类型参数推断在保持代码的简短和可读性上很有用，但在很多复杂的情况下编译器无法推测出类型。这时候我们就需要明确地定义泛型的类型了。

## 使用泛型类型变量
开始用泛型时你会注意到，创建像'identity'这样的泛型函数时，编译器会强制要求你在函数体中正确地使用泛型类型的参数。就是说，你需要明确这些参数的类型是任意的，并对其进行相应的处理。

让我们看看前面的'identity'函数：

```js
function identity<T>(arg: T): T {
    return arg;
}
```

假如你想要在每次调用时获得'arg'的长度的话，你可能会自觉地写成这样：

```js
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

如果你这么写了的话，编译器就会报错说你尝试在'arg'上使用'.length'，但却没有在任何地方声明过'arg'的这个成员。刚才我们说过这些类型变量可能会是任何类型的变量，使用这个函数的人可能会传入一个'number'类型，这样的这个参数就没有'.length'成员了。

假设我们实际上希望这个泛型函数是以T的数组而不是直接以T来运行的，那么我们可以将参数描述成类型的数组，这样我们就可以获得'.length成员了：

```js
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

你可以把logging Identity的类型认为是logginIdentity泛型。它需要一个类型参数T，一个T类型的数组参数'arg'，它最终返回的是T类型的一个数组。如果我们给泛型传入一个数字组成的数组，它就会把T类型绑定成数字，并返回一个数字类型的数组。也就是说现在我们可以使用泛型变量T作为我们可使用类型的一部分，而不是使用参数的整个类型。这让我们能够根据实际情况进行更加灵活的处理。

我们也可以把它写成这样：

```js
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

如果你接触过其他语言的话，你可能已经很熟悉这种类型的写法了。我们将在下一部分中讲到如何创建Array<T>这样的泛型类型。

## 泛型类型
在上一部分中，我们创建了可以与多种类型进行工作的identity泛型函数。在这一部分中，我们将探索函数本身的类型以及泛型接口的创建。

在泛型函数中我们需要先把类型参数列举出来，就像其他的非泛型函数的定义方式一样。

```js
function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: <T>(arg: T)=>T = identity;
```

我们也可以给泛型的类型参数一个不同的名称，我们只需要明确地表示出类型变量的数量和它们的使用方式。

```js
function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: <U>(arg: U)=>U = identity;
```

我们也可以像描述对象一样来描述泛型的类型：

```js
function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: {<T>(arg: T): T} = identity;
```

让我们遵循这种写法来写我们的第一个泛型接口。让我们把前面例子中像是在声明对象一样的部分移到一个接口中：

```js
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: GenericIdentityFn = identity;
```

类似地，我们可能会想把这个泛型参数独立出来，作为整个接口的一个参数。这样我们就可以知道我们泛型接口的类型参数了（即Dictionary<string>而不是Dictionary）。这也可以使得接口的类型参数对其他成员可见。

```js
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: GenericIdentityFn<number> = identity;
```

注意到现在我们的例子已经变得跟前面有些不同了。我们现在用一个非泛型函数的标识作为一个泛型类型的一部分，而不是直接描述一个泛型函数。我们在使用GenericIdentityFn时也需要指定一个对应的类型参数（这里是number）。这种做法可以有效地限制各种潜在的调用情况。如果我们想要更好地描述一个类型的泛用范围的话，我们就需要明确在调用时，何时应该直接使用类型参数，何时应该要把类型参数放在接口上。

除了泛型接口，我们也可以创建泛型类。但我们无法为枚举和模块创建泛型。

## 泛型类
泛型类与泛型接口的结构相似。泛型类会有泛型类型参数列表，这个列表是在类名后面以尖括号（<>）定义。

```js
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

var myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

上面例子中的'GenericNumber'类是一个非常典型的使用情景。但你可能也注意到了这个泛型类本身并没有限制自己只供'number'类型使用。我们也可在以在其上使用'string'甚至更复杂对象。

```js
var stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };

alert(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

同接口一样，在类上设置类型参数就可以确保这个类所有的属性都是同一类型的。

就像前面讲述类时一样，一个类中的类型也可以分成两部分：静态部分和实例部分。而泛型类的"泛型"只是对类的实例部分而言的，就是说当我们在使用泛型类时，静态成员不可以使用类的类型参数。

## 泛型限定
如果你记得我们更早的一个例子的话，你可能会想要写一个专门用于一部分类型的泛型函数。因为你可能知道这些类型的特点，想更好地使用它们。在我们'logginIdentity'的例子中，我们想要获得'arg'参数的'.length'属性。可是编译时编译器会警告我们，因为它不能确定每个类型是否都会有一个'.length'属性，而我们也不能这么假设。

```js
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

虽然我们不能在任何可能出现的类型上做这种假设，但我们可以限定函数作用在任何有'.length'属性的类型上。这使得只要一个类型有这个成员，我们就认为这个类型是有效的。想要这样做的话，我么就必须列举出我们对T的需求，并做出限制。

我们将用一个接口来描述我们的限制。在这里，我们创建了一个有'.length'属性的接口，并用'extends'关键字来使用这个接口。

```js
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

因为泛型函数被限制了，它现在就不能接收任意类型了：

```js
loggingIdentity(3);  // Error, number doesn't have a .length property
```

我们应该传入一个值，它的类型的属性要符合要求：

```js
loggingIdentity({length: 10, value: 3});
```

## 在泛型限定上使用类型参数
在某些情况下，声明一个类型参数，并让它被另一个类型参数限制是很有用的，比如：

```js
function find<T, U extends Findable<T>>(n: T, s: U) {   // errors because type parameter used in constraint
  // ...
}
find (giraffe, myAnimals);
```

直接限制参数的类型也可以达到同样的效果。我们可以这样重写上面的例子：

```js
function find<T>(n: T, s: Findable<T>) {
  // ...
}
find(giraffe, myAnimals);
```

注意：上面的两个例子并不严格相等。第一个函数返回的类型可以是'U'，而第二个函数并没办法拿到'U'类型。

## 在泛型中使用class类型
当我们在工厂模式上使用TypeScript的泛型时，构造函数就会涉及到类的类型。举例来说：

```js
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

下面是一个进阶例子。它用原型属性（prototype property）推测并限制构造函数和实例之间类型的关系。

```js
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function findKeeper<A extends Animal, K> (a: {new(): A;
    prototype: {keeper: K}}): K {

    return a.prototype.keeper;
}

findKeeper(Lion).nametag;  // typechecks!
```
