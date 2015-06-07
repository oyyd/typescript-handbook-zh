#基本类型

$For programs to be useful, we need to be able to work with some of the simplest units of data: numbers, strings, structures, boolean values, and the like. In TypeScript, we support much the same types as you would expected in JavaScript, with a convenient enumeration type thrown in to help things along.
$$程序的运行离不开基本的数据类型，如：numbers, strings, structures, boolean等。TypeScript支持所有你在JavaScript中会用到的数据类型的同时，还添加了便利的枚举类型（enumeration type）以供使用。

##布尔类型
$The most basic datatype is the simple true/false value, which JavaScript and TypeScript (as well as other languages) call a 'boolean' value.
$$真/假值是最基本的数据类型，这种数据类型在JavaScript和TypeScript中（以及其他语言）称为布尔类型（boolean）。

```js
var isDone: boolean = false;
```

##数字
$As in JavaScript, all numbers in TypeScript are floating point values. These floating point numbers get the type 'number'.
$$同JavaScript一样，TypeScript中数字都是浮点数。这些浮点数都被称作数字类型（number）。

```js
var height: number = 6;
```

##字符串
$Another fundamental part of creating programs in JavaScript for webpages and servers alike is working with textual data. As in other languages, we use the type 'string' to refer to these textual datatypes. Just like JavaScript, TypeScript also uses the double quote (") or single quote (') to surround string data.
$$文本类型的数据是用JavaScript编写网页和服务器等程序的基础。同其他语言一样，我们使用字符串（string）来指代这些文本类型的数据。在TypeScript中，你可以像在JavaScript中那样，使用双引号（""）或单引号（''）来表示字符串。

```js
var name: string = "bob";
name = 'smith';
```

##数组
$TypeScript, like JavaScript, allows you to work with arrays of values. Array types can be written in one of two ways. In the first, you use the type of the elements followed by '[]' to denote an array of that element type:
$$同JavaScript一样，TypeScript中我们也可以使用数组。我们可以使用两种不同的方式来写数组。第一种是在元素类型后面附上中括号（[]），来表示这种类型元素的数组：

```js
var list:number[] = [1, 2, 3];
```

$The second way uses a generic array type, Array<elemType>:
$$第二种方式是使用泛型数组类型，形式如Array<elemType>：

```js
var list:Array<number> = [1, 2, 3];
```

##枚举
$A helpful addition to the standard set of datatypes from JavaScript is the 'enum'. Like languages like C#, an enum is a way of giving more friendly names to sets of numeric values.
$$TypeScript拓展了JavaScript原生的标准数据类型集，增加了枚举类型（enum）。枚举是一种很有用的数据类型，就像C#等语言中一样，它提供了一种给数字类型的值，设置易于辨别的名字的方法。

```js
enum Color {Red, Green, Blue};
var c: Color = Color.Green;
```

$By default, enums begin numbering their members starting at 0. You can change this by manually setting the value of one its members. For example, we can start the previous example at 1 instead of 0:
$$在默认情况下，枚举类型会从数字0开始标记它的元素。我们可以通过人为地设置元素的数值来改变默认值。例如，上面的例子我们可以设置成从1开始计数：

```js
enum Color {Red = 1, Green, Blue};
var c: Color = Color.Green;
```

$Or, even manually set all the values in the enum:
$$我们甚至可以给所有的枚举元素设置数值：

```js
enum Color {Red = 1, Green = 2, Blue = 4};
var c: Color = Color.Green;
```

$A handy feature of enums is that you can also go from a numeric value to the name of that value in the enum. For example, if we had the value 2 but weren't sure which that mapped to in the Color enum above, we could look up the corresponding name:
$$枚举类型有一个便捷特性，我们也可以直接用数值来查找其对应的枚举元素的名称。举例来说，如果我们有一个值为2,但我们不确定这个数值对应枚举类型中的哪个元素，那我们可以直接查找这个数值对应的名称：

```js
enum Color {Red = 1, Green, Blue};
var colorName: string = Color[2];

alert(colorName);
```

##Any
$We may need to describe the type of variables that we may not know when we are writing the application. These values may come from dynamic content, eg from the user or 3rd party library. In these cases, we want to opt-out of type-checking and let the values pass through compile-time checks. To do so, we label these with the 'any' type:
$$当我们编写应用时，我们可能会需要描述一些类型不明确的变量。因为这些变量的值可能来源于一些动态的内容，如用户或第三方提供的库。在这种情况下，我们需要略过对这些变量进行的类型检查，让它们直接通过编译时的检查。为了实现这一目的，我们可以把它们标识为'any'类型：

```js
var notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

$The 'any' type is a powerful way to work with existing JavaScript, allowing you to gradually opt-in and opt-out of type-checking during compilation.
$$使用'any'类型是处理我们已有的JavaScript代码的一种强大的方式。我们可以用它来逐渐增加或减少在编译过程中的类型检查。


$The 'any' type is also handy if you know some part of the type, but perhaps not all of it. For example, you may have an array but the array has a mix of different types:
$$当我们知道一个类型的部分数据类型，却又不确定所有的数据类型时，使用'any'可以为我们提供不少方便。比如你有一个数组，但是这个数组中的元素属于不同的数据类型，那你可以这么做：

```js
var list:any[] = [1, true, "free"];

list[1] = 100;
```

##Void
$Perhaps the opposite in some ways to 'any' is 'void', the absence of having any type at all. You may commonly see this as the return type of functions that do not return a value:
$$与'any'对应的数据类型是'void'，它代表缺省类型。没有返回值的函数就可以认为是'void'类型：

```js
function warnUser(): void {
    alert("This is my warning message");
}
```
