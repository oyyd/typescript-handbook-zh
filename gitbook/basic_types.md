# 基本类型

程序的运行离不开基本的数据类型，如：numbers, strings, structures, boolean等。TypeScript支持所有你在JavaScript中会用到的数据类型的同时，还添加了便利的枚举类型（enumeration type）以供使用。

## 布尔类型
真/假值是最基本的数据类型，这种数据类型在JavaScript和TypeScript中（以及其他语言）称为布尔类型（boolean）。

```js
var isDone: boolean = false;
```

## 数字
同JavaScript一样，TypeScript中数字都是浮点数。这些浮点数都被称作数字类型（number）。

```js
var height: number = 6;
```

## 字符串
文本类型的数据是用JavaScript编写网页和服务器等程序的基础。同其他语言一样，我们使用字符串（string）来指代这些文本类型的数据。在TypeScript中，你可以像在JavaScript中那样，使用双引号（""）或单引号（''）来表示字符串。

```js
var name: string = "bob";
name = 'smith';
```

## 数组
同JavaScript一样，TypeScript中我们也可以使用数组。我们可以使用两种不同的方式来写数组。第一种是在元素类型后面附上中括号（[]），来表示这种类型元素的数组：

```js
var list:number[] = [1, 2, 3];
```

第二种方式是使用泛型数组类型，形式如Array<elemType>：

```js
var list:Array<number> = [1, 2, 3];
```

## 枚举
TypeScript拓展了JavaScript原生的标准数据类型集，增加了枚举类型（enum）。枚举是一种很有用的数据类型，就像C#等语言中一样，它提供了一种给数字类型的值，设置易于辨别的名字的方法。

```js
enum Color {Red, Green, Blue};
var c: Color = Color.Green;
```

在默认情况下，枚举类型会从数字0开始标记它的元素。我们可以通过人为地设置元素的数值来改变默认值。例如，上面的例子我们可以设置成从1开始计数：

```js
enum Color {Red = 1, Green, Blue};
var c: Color = Color.Green;
```

我们甚至可以给所有的枚举元素设置数值：

```js
enum Color {Red = 1, Green = 2, Blue = 4};
var c: Color = Color.Green;
```

枚举类型有一个便捷特性，我们也可以直接用数值来查找其对应的枚举元素的名称。举例来说，如果我们有一个值为2,但我们不确定这个数值对应枚举类型中的哪个元素，那我们可以直接查找这个数值对应的名称：

```js
enum Color {Red = 1, Green, Blue};
var colorName: string = Color[2];

alert(colorName);
```

## Any
当我们编写应用时，我们可能会需要描述一些类型不明确的变量。因为这些变量的值可能来源于一些动态的内容，如用户或第三方提供的库。在这种情况下，我们需要略过对这些变量进行的类型检查，让它们直接通过编译时的检查。为了实现这一目的，我们可以把它们标识为'any'类型：

```js
var notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

使用'any'类型是处理我们已有的JavaScript代码的一种强大的方式。我们可以用它来逐渐增加或减少在编译过程中的类型检查。

当我们知道一个类型的部分数据类型，却又不确定所有的数据类型时，使用'any'可以为我们提供不少方便。比如你有一个数组，但是这个数组中的元素属于不同的数据类型，那你可以这么做：

```js
var list:any[] = [1, true, "free"];

list[1] = 100;
```

##Void
与'any'对应的数据类型是'void'，它代表缺省类型。没有返回值的函数就可以认为是'void'类型：

```js
function warnUser(): void {
    alert("This is my warning message");
}
```
