#Generics

$A major part of software engineering is building components that not only have well-defined and consistent APIs, but are also reusable. Components that are capable of working on the data of today as well as the data of tomorrow will give you the most flexible capabilities for building up large software systems.
$$构建部件是软件工程重要的一部分。这些部件不仅要有精心设计过的，高一致性的API，同时也要可重复使用。如果我们的部件不仅能够满足现在的需求，也能够应对未来的变化，那我们在构建大型系统时能够更加灵活。

$In languages like C# and Java, one of the main tools in the toolbox for creating reusable components is 'generics', that is, being able to create a component that can work over a variety of types rather than a single one. This allows users to consume these components and use their own types.
$$在像C#和Java这样的语言中创建可重用的部件时，泛型('generics')是我们最常用的工具之一。它允许我们创建一个可同时作用在多种数据类型的部件。
这就使得用户在使用这些部件时可以用它们自己定义的类型。

##Hello World of Generics
$To start off, let's do the "hello world" of generics: the identity function. The identity function is a function that will return back whatever is passed in. You can think of this in a similar way to the 'echo' command. 
$$让我们用泛型中的"hello world"：identity函数来作为开始的例子。这个identity函数可以返回任何传入给它的参数。你可以把它想成是'echo'命令。

$Without generics, we would either have to give the identity function a specific type:
$$如果没有泛型的话，我们要嘛给identity函数一个特定的类型：

```js
function identity(arg: number): number {
    return arg;
}
```

$Or, we could describe the identity function using the 'any' type:
$$要嘛用'any'类型：

```js
function identity(arg: any): any {
    return arg;
}
```

$While using 'any' is certainly generic in that will accept any and all types for the type of 'arg', we actually are losing the information about what that type was when the function returns. If we passed in a number, the only information we have is that any type could be returned. 
$$虽然用'any'类型时，我们的函数也能够接收各种类型的'arg'，这样看起来也是泛用的。但实际上我们失去了函数返回时的类型信息。比如我们传入一个数字，但我们只能知道函数返回的是'any'类型。

$Instead, we need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned. Here, we will use a type variable, a special kind of variable that works on types rather than values. 
$$取而代之的，我们需要有一种方式能够获取参数的类型，并用这个类型作为函数返回的类型。这里，我们将使用一种特别的变量——类型变量。它不对值其作用，而是对类型起作用。

```js
function identity<T>(arg: T): T {
    return arg;
}
```

$We've now added a type variable 'T' to the identity function. This 'T' allows us to capture the type the user provides (eg, number), so that we can use that information later. Here, we use 'T' again as the return type. On inspection, we can now see the same type is used for the argument and the return type. This allows us to traffic that type information in one side of the function and out the other.
$$现在，我们给identity函数添加一个类型变量'T'。通过这个'T'我们能够获取用户提供的数据类型（比如：number），然后我们就能在函数的后面使用这个类型。这里我们把'T'用在函数返回的类型上。这样在看代码时，我们就知道参数的类型和函数返回的类型是一样的，TypeScript就可以在函数的内部或外部使用这个函数的类型信息。

$We say that this version of the 'identity' function is generic, as it works over a range of types. Unlike using 'any', it's also just as precise (ie, it doesn't lose any information) as the first 'identity' function that used numbers for the argument and return type.
$$因为这个版本的'identity'函数可以用在多种类型上，所以我们称它是泛用的（generic）。但它又不同于使用'any'的函数，它仍旧保留了准确的类型信息，就像是我们第一个'identity'函数那样把number作为参数类型和函数返回类型。

$Once we've written the generic identity function, we can call it in one of two ways. The first way is to pass all of the arguments, including the type argument, to the function:
$$定义完identity的泛型后，我们就可以通过两种方式来调用它。第一种是传入所有的参数给函数，包括类型参数：

```js
var output = identity<string>("myString");  // type of output will be 'string'
```

$Here we explicitly set 'T' to be string as one of the arguments to the function call, denoted using the <> around the arguments rather than ().
$$这里我们把'T'设置为string（string同时也是传入函数的参数的类型），用<>而非()来包裹类型变量。

$The second way is also perhaps the most common. Here we use /type argument inference/, that is, we want the compiler to set the value of T for us automatically based on the type of the argument we pass in:
$$第二种方法可能更常见，它使用的是/type argument inference/。这会令编译器根据传入参数的类型来自动地设置T的值：

```js
var output = identity("myString");  // type of output will be 'string'
```

$Notice that we didn't have explicitly pass the type in the angle brackets (<>), the compiler just looked at the value "myString", and set T to its type. While type argument inference can be a helpful tool to keep code shorter and more readable, you may need to explicitly pass in the type arguments as we did in the previous example when the compiler fails to infer the type, as may happen in more complex examples.
$$注意这里我们没有显式地用尖括号(<>)来传入类型，编译会根据"myString"来设置类型。虽然type argument inference在保持代码的简短和可读性上很有用，但在很多复杂的情况下编译器无法推测出类型。这时候我们就需要明确地定义使用泛型时的类型了。

##Working with Generic Type Variables
$When you begin to use generics, you'll notice that when you create generic functions like 'identity', the compiler will enforce that you use any generically typed parameters in the body of the function correctly. That is, that you actually treat these parameters as if they could be any and all types.
$$当你开始用泛型时你会注意到，创建像'identity'这样的泛型函数时，编译器会强制你在函数体中正确地使用泛型对应类型的参数。就是说，你实际上需要明确这些参数可能会是任意类型的参数，并进行处理。

$Let's take our 'identity' function from earlier:
$$让我们看看前面的'identity'函数：

```js
function identity<T>(arg: T): T {
    return arg;
}
```

$What if want to also log the length of the argument 'arg' to the console with each call. We might be tempted to write this:
$$假如你想要在每次调用时获得'arg'的长度的话，你可能会自觉地写成这样：

```js
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

$When we do, the compiler will give us an error that we're using the ".length" member of 'arg', but nowhere have we said that 'arg' has this member. Remember, we said earlier that these type variables stand in for any and all types, so someone using this function could have passed in a 'number' instead, which does not have a ".length" member. 
$$如果你这么写了的话，编译器就会报错说我们尝试在'arg'上使用'.length'，但却没有在任何地方声明过'arg'有这个成员。因为刚才我们说过这些类型变量可能会是任何类型的变量，使用这个函数的人可能会传入一个'number'类型，这样的这个参数就没有'.length'成员了。

$Let's say that we've actually intended this function to work on arrays of T rather that T directly. Since we're working with arrays, the .length member should be available. We can describe this just like we would create arrays of other types:
$$假设我们实际上希望这个泛型函数是以T的数组而不是直接以T来运行，这样我们就可以获得'.length成员了，那么我们可以将参数描述成类型的数组：

```js
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

$You can read the type of logging Identity as "the generic function loggingIdentity, takes a type parameter T, and an argument 'arg' which is an array of these T's, and returns an array of T's. If we passed in an array of numbers, we'd get an array of numbers back out, as T would bind to number. This allows us to use our generic type variable 'T' as part of the types we're working with, rather than the whole type, giving us greater flexibility. 
$$

We can alternatively write the sample example this way:

```js
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

You may already be familiar with this style of type from other languages. In the next section, we'll cover how you can create your own generic types like Array<T>.

##Generic Types
In previous sections, we created generic identity functions that worked over a range of types. In this section, we'll explore the type of the functions themselves and how to create generic interfaces.

The type of generic functions is just like those of non-generic functions, with the type parameters listed first, similarly to function declarations:

```js
function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: <T>(arg: T)=>T = identity;
```

We could also have used a different name for the generic type parameter in the type, so long as the number of type variables and how the type variables are used line up.

```js
function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: <U>(arg: U)=>U = identity;
```

We can also write the generic type as a call signature of an object literal type:

```js
function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: {<T>(arg: T): T} = identity;
```

Which leads us to writing our first generic interface. Let's take the object literal from the previous example and move it to an interface:

```js
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: GenericIdentityFn = identity;
```

In a similar example, we may want to move the generic parameter to be a parameter of the whole interface. This lets us see what type(s) we're generic over (eg Dictionary<string> rather than just Dictionary). This makes the type parameter visible to all the other members of the interface. 

```js
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

var myIdentity: GenericIdentityFn<number> = identity;
```

Notice that our example has changed to be something slightly different. Instead of describing a generic function, we now have a non-generic function signature that is a part of a generic type. When we use GenericIdentityFn, we now will also need to specify the corresponding type argument (here: number), effectively locking in what the underlying call signature will use. Understanding when to put the type parameter directly on the call signature and when to put it on the interface itself will be helpful in describing what aspects of a type are generic.

In addition to generic interfaces, we can also create generic classes. Note that it is not possible to create generic enums and modules.

##Generic Classes
A generic class has a similar shape to a generic interface. Generic classes have a generic type parameter list in angle brackets (<>) following the name of the class.

```js
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

var myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

This is a pretty literal use of the 'GenericNumber' class, but you may have noticed that nothing is restricting is to only use the 'number' type. We could have instead used 'string' or even more complex objects.

```js
var stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };

alert(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

Just as with interface, putting the type parameter on the class itself lets us make sure all of the properties of the class are working with the same type.

As we covered in Classes, a class has two side to its type: the static side and the instance side. Generic classes are only generic over their instance side rather than their static side, so when working with classes, static members can not use the class's type parameter.

##Generic Constraints
If you remember from an earlier example, you may sometimes want to write a generic function that works on a set of types where you have some knowledge about what capabilities that set of types will have. In our 'loggingIdentity' example, we wanted to be able access the ".length" property of 'arg', but the compiler could not prove that every type had a ".length" property, so it warns us that we can't make this assumption.

```js
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

Instead of working with any and all types, we'd like to constrain this function to work with any and all types that also have the ".length" property. As long as the type has this member, we'll allow it, but it's required to have at least this member. To do so, we must list our requirement as a constraint on what T can be.

To do so, we'll create an interface that describes our constraint. Here, we'll create an interface that has a single ".length" property and then we'll use this interface and the extends keyword to denote our constraint:

```js
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

Because the generic function is now constrained, it will no longer work over any and all types:

```js
loggingIdentity(3);  // Error, number doesn't have a .length property
```

Instead, we need to pass in values whose type has all the required properties:

```js
loggingIdentity({length: 10, value: 3});  
```

##Using Type Parameters in Generic Constraints
In some cases, it may be useful to declare a type parameter that is constrained by another type parameter. For example,

```js
function find<T, U extends Findable<T>>(n: T, s: U) {   // errors because type parameter used in constraint
  // ...
} 
find (giraffe, myAnimals);
```

You can achieve the pattern above by replacing the type parameter with its constraint. Rewriting the example above,

```js
function find<T>(n: T, s: Findable<T>) {   
  // ...
} 
find(giraffe, myAnimals);
```

Note: The above is not strictly identical, as the return type of the first function could have returned 'U', which the second function pattern does not provide a means to do.

##Using Class Types in Generics
When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions. For example,

```js
function create<T>(c: {new(): T; }): T { 
    return new c();
}
```

A more advanced example uses the prototype property to infer and constrain relationships between the constructor function and the instance side of class types.

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
