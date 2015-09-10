#类型推断
$In this section, we will cover type inference in TypeScript. Namely, we'll discuss where and how types are inferred.
$$在本节中，我们将讲到TypeScript中的类型推断（type inference）。我们将详细讲述类型推断发生的时机及发生的方式。

##基础
$In TypeScript, there are several places where type inference is used to provide type information when there is no explicit type annotation. For example, in this code
$$当没有关于类型的明确解释时，有几种情况会使得TypeScript使用类型推断来提供类型信息。举例来说，在下面的代码中：

```js
var x = 3;
```

$The type of the x variable is inferred to be number. This kind of inference takes place when initializing variables and members, setting parameter default values, and determining function return types.
$$变量x的类型会被推断为数字。这种类型推断会发生在下列情况中：初始化变量和成员，设置参数的默认值，在决定函数的返回类型时。

$In most cases, type inference is straightforward. In the following sections, we'll explore some of the nuance in how types are inferred.
$$在大多数情况下，类型推断的结果很明了。我们将在后面探索类型推断中一些比较微妙的情况。

##最佳通用类型
$When a type inference is made from several expressions, the types of those expressions are used to calculate a "best common type". For example,
$$当我们需要从多个表达式中推断类型时，我们会通过这些表达式计算出一个"最佳通用类型"（"best common type"）。举例来说，

```js
var x = [0, 1, null];
```

$To infer the type of x in the example above, we must consider the type of each array element. Here we are given two choices for the type of the array: number and null. The best common type algorithm considers each candidate type, and picks the type that is compatible with all the other candidates.
$$在推断上面例子中x的类型时，我们必须要考虑到数组中每个元素的类型。这里我们有数字和null两种可能，而最佳通用类型算法会根据每种类型的情况，选择一种可以兼容所有其他选择的类型。

$Because the best common type has to be chosen from the provided candidate types, there are some cases where types share a common structure, but no one type is the super type of all candidate types. For example:
$$因为我们需要从候选类型中选择最佳通用类型，所以也可能出现没有一种类型可以兼容所有类型的情况。举例来说：

```js
var zoo = [new Rhino(), new Elephant(), new Snake()];
```

$Ideally, we may want zoo to be inferred as an Animal[], but because there is no object that is strictly of type Animal in the array, we make no inference about the array element type. To correct this, instead explicitly provide the type when no one type is a super type of all other candidates:
$$在理想的状况下，我们希望zoo 被推断为Animal[]。但是由于数组中并没有Animal类型，我们无法推断出这个数组元素的类型。为了应对这类情况，在数组中如果没有一个元素的类型是其他类型的超类型（super type）的话，我们需要明确提供这个数组的类型：

```js
var zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

$When no best common type is found, the resulting inference is the empty object type, {}. Because this type has no members, attempting to use any properties of it will cause an error. This result allows you to still use the object in a type-agnostic manner, while providing type safety in cases where the type of the object can't be implicitly determined.
$$当找不到最佳通用类型时，类型推断的结果就会变成空对象类型，即{}。因为这种类型并没有成员，所以尝试使用该类型上的任何属性都会产生错误。但在这种我们不能隐式推断出对象的类型的情况下，你仍旧能够通过不涉及类型的操作来安全地使用这个对象。

##上下文类型
$Type inference also works in "the other direction" in some cases in TypeScript. This is known as "contextual typing". Contextual typing occurs when the type of an expression is implied by its location. For example:
$$类型推断也能作用于TypeScript中的一些其他情况，其中一种情况便是"上下文类型"（"contextual typing"）。上下文类型作用在“一个表达式的类型可以通过它出现的位置被推断出”的情况下。举例来说：

```js
window.onmousedown = function(mouseEvent) {
    console.log(mouseEvent.buton);  //<- Error
};
```

$For the code above to give the type error, the TypeScript type checker used the type of the Window.onmousedown function to infer the type of the function expression on the right hand side of the assignment. When it did so, it was able to infer the type of the mouseEvent parameter. If this function expression were not in a contextually typed position, the mouseEvent parameter would have type any, and no error would have been issued.
$$上面的代码会抛出类型错误。因为TypeScript的类型检查器会用Window.onmousedown函数的类型来推断赋值符号另一侧的函数表达式的类型。在这种情况下，它就能推断出mouseEvent参数的类型。如果函数表达式不在这个关乎上下文类型的位置上的话，mouseEvent参数就可以是any类型，而且不会有错误抛出。

$If the contextually typed expression contains explicit type information, the contextual type is ignored. Had we written the above example:
$$如果我们明确地指定了这个表达式的类型的话，上下文类型就会被忽略。我们可以这样来写上面的例子：

```js
window.onmousedown = function(mouseEvent: any) {
    console.log(mouseEvent.buton);  //<- Now, no error is given
};
```

$The function expression with an explicit type annotation on the parameter will override the contextual type. Once it does so, no error is given as no contextual type applies.
$$带有明确类型注释的函数表达式的参数可以覆盖上下文类型。这样就不会有上下文类型其作用，也就不会有错误产生了。

$Contextual typing applies in many cases. Common cases include arguments to function calls, right hand sides of assignments, type assertions, members of object and array literals, and return statements. The contextual type also acts as a candidate type in best common type. For example:
$$上下文类型可以作用在很多场景中。常见的例子包括：函数调用中的参数，赋值时等号的右边部分，类型判断，对象的成员，迭代数组，以及返回声明（return statements）。上下文类型也会成为最佳通用类型的一个候选类型。举例来说：

```js
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}
```

$In this example, best common type has a set of four candidates: Animal, Rhino, Elephant, and Snake. Of these, Animal can be chosen by the best common type algorithm.
$$在这个例子中，我们有四个最佳候选类型：Animal, Rhino, Elephant, and Snake。在这里最佳通用类型算法当然会选择Animal。
