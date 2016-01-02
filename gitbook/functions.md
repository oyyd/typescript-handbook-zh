# 函数
函数是构建JavaScript应用的基础。通过函数，我们可以把我们的业务逻辑抽象成多层，可以模仿类的实现，可以隐藏信息，可以构建模块。虽然TypeScript中已经有了类和模块，但在描述事物的执行过程时，函数仍旧起着关键的作用。TypeScript给标准的JavaScript函数添加了新的特性以方便我们更好地使用。

## 函数
首先，TypeScript和JavaScript一样，既可以创建有名称的函数也可以创建匿名函数。这允许我们在实现应用时选择最合适的方式。你既可以在API中生成一堆函数，也可以先构建个一次性的函数，之后再把它替换成另一个函数。

让我们看看JavaScript中这两种应用方式的例子：

```js
//Named function
function add(x, y) {
    return x+y;
}

//Anonymous function
var myAdd = function(x, y) { return x+y; };
```

和在JavaScript中一样，函数可以获得函数体外的变量。当它们获得了函数体外的变量时，我们说函数'捕获'了这些变量。虽然这一机制的工作方式以及它的副作用等内容可能已经超出了本文的叙述范围，但清楚地认识这一机制对我们使用JavaScript和TypeScript来说是不可或缺的一步。

```js
var z = 100;

function addToZ(x, y) {
    return x+y+z;
}
```

## 函数类型
### 给函数添加类型
让我们给前面的例子加上类型：

```js
function add(x: number, y: number): number {
    return x+y;
}

var myAdd = function(x: number, y: number): number { return x+y; };
```

我们可以给函数的每个参数和返回值指定类型。TypeScript可以通过返回的语句知道返回值的类型。所以在很多情况下，我们也可以不指定类型。

### 书写函数类型
既然我们已经给函数定义了类型，现在让我们完整地写出这个函数各个部分的类型：

```js
var myAdd: (x:number, y:number)=>number =
    function(x: number, y: number): number { return x+y; };
```

一个函数上的类型包含两个部分：参数的类型和返回值的类型。如果我们想要完整地写出函数的类型的话，那这两部分都将是必不可少的。我们给每个参数一个名称和类型，罗列出它们。因为参数的名称只是为了程序的可读性，所以我们也可以这么写上面的例子：

```js
var myAdd: (baseValue:number, increment:number)=>number =
    function(x: number, y: number): number { return x+y; };
```

不管你给函数的参数取了什么名字，只要你列出了这个参数的类型，那它对函数来说就是有效的。

让我们再来看看返回值的类型。我们通过在参数和返回值的类型之间使用'=>'符号来指定一个函数返回值的类型。如果一个函数不返回值的话，我们需要使用'void'类型。

记住，参数类型和返回值的类型共同构成了函数的类型。函数中被捕获的变量并不会影响函数的类型。这些变量实际上是被当作函数的'隐藏状态'，它们并不会成为函数API的一部分。

### 推断类型
通过前面的例子你可能注意到了，虽然等号的一边有指定类型而另一边没有，但TypeScript的编译器仍能够理解这二者的类型。

```js
// myAdd has the full function type
var myAdd = function(x: number, y: number): number { return x+y; };

// The parameters 'x' and 'y' have the type number
var myAdd: (baseValue:number, increment:number)=>number =
    function(x, y) { return x+y; };
```

这种类型被称作'语境类型'（'contextual typing'），是一种类型推断。它有助于减少我们维护类型的工作。

## 可选参数和默认参数
与JavaScript不同，TypeScript函数中的每个参数都被认为是必须的。但这并不是说参数的值不能是'null'，只是当一个函数被调用时，编译器会检查用户提供的参数。编译器同样也会假设这些参数是传入函数的唯一参数。简而言之，我们必须保证传给函数的参数的数量和函数指定的参数数量是一致的。

```js
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

var result1 = buildName("Bob");  //error, too few parameters
var result2 = buildName("Bob", "Adams", "Sr.");  //error, too many parameters
var result3 = buildName("Bob", "Adams");  //ah, just right
```

在JavaScript中，每个参数被认为是可选的。用户可以按照自己的意愿去掉一部分参数，而没有被传入的参数会被当成是undefined。在TypeScript中，我们可以在一个参数的旁边使用'?'符号来指定这个参数是可选的。举例来说，如果我们想要last name是可选的话：

```js
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

var result1 = buildName("Bob");  //works correctly now
var result2 = buildName("Bob", "Adams", "Sr.");  //error, too many parameters
var result3 = buildName("Bob", "Adams");  //ah, just right
```

可选参数必须放在必选参数的后面。前面的例子中，如果我们想要first name是可选的，而last name是必选的话，我们就需要把first name放在后面。

在TypeScript中，我们也可以设置一个值，用作用户没有传入参数时的默认值。这种参数被称作默认参数（default parameters）。下面的例子把前面例子中的last name的默认值改为了"Smith"。

```js
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

var result1 = buildName("Bob");  //works correctly now, also
var result2 = buildName("Bob", "Adams", "Sr.");  //error, too many parameters
var result3 = buildName("Bob", "Adams");  //ah, just right
```

和可选参数一样，默认参数必须出现在必选参数的后面。

可选参数和默认参数会共享数据类型。下面的：

```js
function buildName(firstName: string, lastName?: string) {
```

和

```js
function buildName(firstName: string, lastName = "Smith") {
```

享有同样的类型"(firstName: string, lastName?: string)=>string"。默认参数的的默认值不会生效，它表明了这个参数是可选的。

## 剩余参数
必选参数，可选参数和默认参数有一个共同点：这些参数一次只描述一个参数。有时候你可能希望把多个参数设成一组，或者你没法确定一个函数最终会有多少个参数。在JavaScript中处理这些情况时，你可以直接使用函数体中可以获取的arguments来获得每一个参数。

而在TypeScript中，你可以把这些参数聚集到一个变量中：

```js
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

var employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

剩余参数（rest parameters）可以包含多个可选参数。你可以按你的意愿随意使用这些参数。编译器会把传入函数的参数放入一个以省略号（...）开头为名字的变量之中，以供你在函数中使用。

同时省略号也可以用在带有剩余参数的函数上：

```js
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

var buildNameFun: (fname: string, ...rest: string[])=>string = buildName;
```

##Lambdas和'this'的使用
学习'this'在函数中的工作方式几乎是每一个学习JavaScript的编码人员的必修课。实际对'this'的学习也是开发者习惯使用JavaScript的一个重要过程。而TypeScript是JavaScript超集，它要求开发人员在懂得如何使用'this'的同时，也能够发现代码中没有被正确使用的'this'。关于JavaScript中的'this'完全足够写一篇文章了，并且实际上也有很多人这么干了。这里我们只关注一些基本的东西。

JavaScript中的函数在被调用时会设置一个'this'变量。虽然这个特性强大而又灵活，但使用这个特性却需要我们时刻关注函数执行的环境。举例来说，当我们在回调函数上执行一个函数时，这个函数的上下文环境就会变得难以预料。

让我们看一个例子：

```js
var deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        return function() {
            var pickedCard = Math.floor(Math.random() * 52);
            var pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

var cardPicker = deck.createCardPicker();
var pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```
虽然看起来这段代码会返回一个警告框，但实际上我们只会得到一个错误提示。因为'createCardPicker'创建的函数上的'this'指向的是'window'而不是'deck'对象。执行'cardPicker()'就会产生这样的结果。这里的'this'只能被动态绑定到'window'上（记住：在严格模式下，这里的'this'的值会是'undefined'而不是'window'）。

要解决这一问题，我们就要保证这个函数在被调用之前是被绑定到了正确的'this'对象上。不管这个函数之后会被如何调用，只要我们正确地进行了绑定，这个函数就总能获得原始的'deck'对象。

这里我们用lambda句法（lambda syntax，()=>{}）来代替JavaScript的函数表达式，以解决这个问题。它不是在函数被触发时寻找'this'的对象，而是在函数被创建时就自动捕获'this'指代的对象。

```js
var deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // Notice: the line below is now a lambda, allowing us to capture 'this' earlier
        return () => {
            var pickedCard = Math.floor(Math.random() * 52);
            var pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

var cardPicker = deck.createCardPicker();
var pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

你可以阅读Yahuda Katz的Understanding JavaScript Function Invocation and “this”来获取更多的信息。

## 重载
JavaScript本质上是一门动态性极强的语言。一个JavaScript函数可以根据传入参数的类型和数量来返回不同类型的对象，并且这样的使用方式并不少见。

```js
var suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        var pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        var pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

var myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
var pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

var pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

这里的'pickCard'函数会根据用户传入参数的不同来返回两种不同的结果。如果用户传入的是一个表示'deck'的对象，那这个函数就会返回'pickedCard'；如果用户要选择一张card，这个函数就会告诉用户card的结果。那么我们要如何用类型系统来描述这种情景呢？

答案是用一个重载列表来描述函数的多个类型。编译器会用这个列表来处理函数调用。现在让我们用一个重载列表来描述'pickCard'所接收的参数和返回的类型。

```js
var suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        var pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        var pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

var myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
var pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

var pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

通过过载，我们现在就可以对'pickCard'函数进行类型检查了。

编译器在进行类型检查时，其处理方式与普通的JavaScript相似。编译器会查看重载列表，并尝试与函数调用时的参数进行匹配。编译器会把第一个成功匹配的过载认做是正确的一个。也因为如此，我们需要把重载按照从最详细的到最粗略的顺序进行排序。

注意'function pickCard(x): any'并不会成为过载列表的一部分，即这个函数只有两个过载：其中一个重载以一个对象作为参数，另一个以一个数字作为参数。以任何其他的参数调用'pickCard'都会产生错误。
