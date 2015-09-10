#声明合并
$Some of the unique concepts in TypeScript come from the need to describe what is happening to the shape of JavaScript objects at the type level. One example that is especially unique to TypeScript is the concept of 'declaration merging'. Understanding this concept will give you an advantage when working with existing JavaScript in your TypeScript. It also opens the door to more advanced abstraction concepts.
$$TypeScript上的一些独特的理念，源自我们从类型上描述JavaScript对象结构（shape）变化的需求。TypeScript中独特的'声明合并'（'declaration merging'）就是其中的一个例子。理解这个概念能够帮助你在TypeScript中更好地处理现有的JavaScript代码。同时它也让实现更高级别的抽象成为了可能。

$First, before we get into how declarations merge, let's first describe what we mean by 'declaration merging'.
$$在理解声明是如何合并的之前，先让我们了解到底什么是'声明合并'。

$For the purposes of this article, declaration merging specifically means that the compiler is doing the work of merging two separate declarations declared with the same name into a single definition. This merged definition has the features of both of the original declarations. Declaration merging is not limited to just two declarations, as any number of declarations can be merged.
$$在这篇文章中，声明合并特指由编译器完成的，将拥有同样名称的，两个独立的的声明合并成一个定义（a single definition）的工作。这个合并而来的定义将同时拥有原来的两个声明的特性。声明合并不限于合并两个声明，符合条件的任意个声明都可以被合并。

##基本概念
$In TypeScript, a declaration exists in one of three groups: namespace/module, type, or value. Declarations that create a namespace/module are accessed using a dotted notation when writing a type. Declarations that create a type do just that, create a type that is visible with the declared shape and bound to the given name. Lastly, declarations create a value are those that are visible in the output JavaScript (eg, functions and variables).
$$在TypeScript中，一个声明会来源于下面的三种情况中的一种：命名空间/模块，类型，值。用于创建命名空间/模块的声明可以通过点分隔的表示法获得。用于创建类型的声明会确定一个类型的名称及其结构。第三种创建值的声明在编译输出的JavaScript中可见（如函数和变量）。

<table>
<tr>
<th>声明类型</th><th>命名空间</th><th>类型</th><th>值</th>
</tr>
<tr>
<td>模块</td><td> X </td><td></td><td> X </td>
</tr>
<tr>
<td>类</td><td></td><td> X </td><td> X </td>
</tr>
<tr>
<td>接口</td><td></td><td> X </td><td></td>
</tr>
<tr>
<td>函数</td><td></td><td></td><td> X </td>
</tr>
<tr>
<td>变量</td><td></td><td></td><td> X </td>
</tr>
</table>

$Understanding what is created with each declaration will help you understand what is merged when you perform a declaration merge.
$$在执行一个声明合并时，理解每个声明到底创建了什么能够帮助你更好地确定到底是什么被合并了。

##合并接口
$The simplest, and perhaps most common, type of declaration merging is interface merging. At the most basic level, the merge mechanically joins the members of both declarations into a single interface with the same name.
$$最简单也最常见的声明合并莫过于接口的合并。在最简单的情况下，这种合并只是机械地把两个同名接口的成员合并到同一个接口中。

```js
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}

var box: Box = {height: 5, width: 6, scale: 10};
```

$Non-function members of the interfaces must be unique. The compiler will issue an error if the interfaces both declare a non-function member of the same name.
$$接口的非函数的成员必须是独特的。如果两个接口同时声明了一个有着同样名子的非函数的成员的话，编译器会抛出一个错误。

$For function members, each function member of the same name is treated as describing an overload of the same function. Of note, too, is that in the case of interface A merging with later interface A (here called A'), the overload set of A' will have a higher precedence than that of interface A.
$$而对于函数成员来说，拥有同样名称的每个函数成员都会被当作是同一个函数的重载情况。同样值得注意的是，当一个接口A在融合另一个接口A时（这里称为A'），A'上的重载的集合将会比接口A上的拥有更高优先级。

$That is, in the example:
$$比如在下面这个例子中：

```js
interface Document {
    createElement(tagName: any): Element;
}
interface Document {
    createElement(tagName: string): HTMLElement;
}
interface Document {
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
    createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

$The two interfaces will merge to create a single declaration. Notice that the elements of each group maintains the same order, just the groups themselves are merged with later overload sets coming first:
$$这两个接口将会合并创造出一个声明。注意每个接口中的元素将会维持同样的顺序，只是这些接口身合并时，后出现的重载集合会出现在前面：

```js
interface Document {
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
    createElement(tagName: "canvas"): HTMLCanvasElement;
    createElement(tagName: string): HTMLElement;
    createElement(tagName: any): Element;
}
```

##合并模块
$Similarly to interfaces, modules of the same name will also merge their members. Since modules create both a namespace and a value, we need to understand how both merge.
$$和接口相似，拥有相同名称的模块也会合并它们的成员。由于模块会同时创建一个命名空间和一个值，这里我们需要同时理解这二者是如何合并的。

$To merge the namespaces, type definitions from exported interfaces declared in each module are themselves merged, forming a single namespace with merged interface definitions inside.
$$当合并两名命名空间时，每个模块输出的接口的声明中所创建的类型的定义会相互合并。它们会创建一个带有合并后的接口的命名空间。

$To merge the value, at each declaration site, if a module already exists with the given name, it is further extended by taking the existing module and adding the exported members of the second module to the first.
$$当合并值时，两个模块中的值会合并在一起。如果两个模块中有同名称的值，则第二个模块中的值优先。

$The declaration merge of 'Animals' in this example:
$$下面这个例子中的'Animals'的声明合并：

```js
module Animals {
    export class Zebra { }
}

module Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
```

$is equivalent to:
$$等同于：

```js
module Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
```

$This model of module merging is a helpful starting place, but to get a more complete picture we need to also understand what happens with non-exported members. Non-exported members are only visible in the original (un-merged) module. This means that after merging, merged members that came from other declarations can not see non-exported members.
$$虽然这个模块合并的例子对我们的理解很有帮助，但我们同样也需要知道在未被输出的成员上到底发生了什么，来帮助我们更完整地理解模块合并。未被输出的成员只在原模块（未被合并的模块）中可见。这意味着来自不同声明中的成员即便在合并以后也不能看到对方未被输出的成员。

$We can see this more clearly in this example:
$$我们可以通过下面的例子更好地理解这一点：

```js
module Animal {
    var haveMuscles = true;

    export function animalsHaveMuscles() {
        return haveMuscles;
    }
}

module Animal {
    export function doAnimalsHaveMuscles() {
        return haveMuscles;  // <-- error, haveMuscles is not visible here
    }
}
```

$Because haveMuscles is not exported, only the animalsHaveMuscles function that shares the same un-merged module can see the symbol. The doAnimalsHaveMuscles function, even though it's part of the merged Animal module can not see this un-exported member.
$$因为haveMuscles并未被输出，所以只有在未合并前处在同一个模块中的animalsHaveMuscles函数才能知道haveMuscles的存在。虽然在被合并以后，doAnimalsHaveMuscles函数也是Animal模块的一部分，但它无法得知另一个模块中的那些未被输出的成员。

##用模块合并类，函数和枚举
$Modules are flexible enough to also merge with other types of declarations. To do so, the module declaration must follow the declaration it will merge with. The resulting declaration has properties of both declaration types. TypeScript uses this capability to model some of patterns in JavaScript as well as other programming languages.
$$事实上模块非常灵活，它也可以合并其他类型的声明。想要合并其他类型的声明的话，这个模块的声明就必须要紧跟在它要合并的其他声明的后面。这样声明得到的结果，会同时拥有这两种声明类型的属性。TypeScript正是通过这一能力来模拟JavaScript和其他一些编程语言上的设计模式的。

$The first module merge we'll cover is merging a module with a class. This gives the user a way of describing inner classes.
$$我们要看的第一个模块合并的例子是用来合并一个模块和一个类的。这让声明内部类成为了可能。

```js
class Album {
    label: Album.AlbumLabel;
}
module Album {
    export class AlbumLabel { }
}
```

$The visibility rules for merged members is the same as described in the 'Merging Modules' section, so we must export the AlbumLabel class for the merged class to see it. The end result is a class managed inside of another class. You can also use modules to add more static members to an existing class.
$$这里合并后的成员的可见性同我们在'Merging Modules'部分中描述的是一样的。所以我们必须输出AlbumLabel类，来使被合并的类能够看见它。合并的结果便是是一个类出现在了另一个类中。你用样也可以用模块来给一个已经存在的类添加更多的静态成员。

$In addition to the pattern of inner classes, you may also be familiar with JavaScript practice of creating a function and then extending the function further by adding properties onto the function. TypeScript uses declaration merging to build up definitions like this in a type-safe way.
$$除了内部类的模式以外，你可能也很熟悉下面这种JavaScript应用：先创建一个函数，然后再给这个函数添加其他的属性。通过TypeScript的声明合并，你可以在保障类型安全（type-safe）的情况下来实现这种定义。

```js
function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix;
}

module buildLabel {
    export var suffix = "";
    export var prefix = "Hello, ";
}

alert(buildLabel("Sam Smith"));
```

$Similarly, modules can be used to extend enums with static members:
$$相似地，模块也可以用静态成员来扩展枚举。

```js
enum Color {
    red = 1,
    green = 2,
    blue = 4
}

module Color {
    export function mixColor(colorName: string) {
        if (colorName == "yellow") {
            return Color.red + Color.green;
        }
        else if (colorName == "white") {
            return Color.red + Color.green + Color.blue;
        }
        else if (colorName == "magenta") {
            return Color.red + Color.blue;
        }
        else if (colorName == "cyan") {
            return Color.green + Color.blue;
        }
    }
}
```

##不被允许的合并
$Not all merges are allowed in TypeScript. Currently, classes can not merge with other classes, variables and classes can not merge, nor can interfaces and classes. For information on mimicking classes merging, see the Mixins in TypeScript section.
$$在TypeScript中，并不是所有类型都能够合并。到目前为止，一个类不能合并另一个类，变量与类之间不能够合并，接口和类之间也不能够合并。如果你想要模拟类的合并的话，你可以通过Mixins部分来了解更多。
