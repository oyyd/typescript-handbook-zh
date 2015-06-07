#混合（Mixins）
$Along with traditional OO hierarchies, another popular way of building up classes from reusable components is to build them by combining simpler partial classes. You may be familiar with the idea of mixins or traits for languages like Scala, and the pattern has also reached some popularity in the JavaScript community.
$$在传统的面向对象继承（OO hierarchies）中，通过组合可复用的组件（即一些更简单的类）来构造新的类是非常流行的做法。如果你熟悉像Scala这类语言的话，你对这种做法应该不会陌生。并且这种模式在JavaScript社区中也比较流行。

##Mixin的例子
$In the code below, we show how you can model mixins in TypeScript. After the code, we'll break down how it works.
$$在下面的代码中，我们展示了如何在TypeScript中模仿混合的构建方式。我们会在后面讲述它是怎么运作的。

```js
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }
 
}
 
// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}
 
class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }
 
    interact() {
        this.activate();
    }
 
    // Disposable
    isDisposed: boolean = false;
    dispose: () => void;
    // Activatable
    isActive: boolean = false;
    activate: () => void;
    deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable])
 
var smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);
 
////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    }); 
}
```

##理解这个例子
$The code sample starts with the two classes that will act is our mixins. You can see each one is focused on a particular activity or capability. We'll later mix these together to form a new class from both capabilities.
$$这个例子先定义了两个将要被我们混合的类。你会发现这两个类每个都只关注一种特定的功能或活动。然后我们会把这两个类混合起来来构建一个同时带有这两种功能的新的类。

```js
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }
 
}
 
// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}
```

$Next, we'll create the class that will handle the combination of the two mixins. Let's look at this in more detail to see how it does this:
$$接着，我们将创建一个混合了这二者的类。让我们更详细地看看这是如何实现的。

```js
class SmartObject implements Disposable, Activatable {
```

$The first thing you may notice in the above is that instead of using 'extends', we use 'implements'. This treats the classes as interfaces, and only uses the types behind Disposable and Activatable rather than the implementation. This means that we'll have to provide the implementation in class. Except, that's exactly what we want to avoid by using mixins. 
$$你可能会马上注意到在上面的例子中，我们用'implements'来代替'extends'关键字。这表示我们把这两个类当作是接口。并且与其说我们使用了'Disposable'和'Activatable'的实现，倒不如说是使用了它们的类型。也就是说我们还需要在类中提供这二者的实现。Except, that's exactly what we want to avoid by using mixins. 

$To satisfy this requirement, we create stand-in properties and their types for the members that will come from our mixins. This satisfies the compiler that these members will be available at runtime. This lets us still get the benefit of the mixins, albeit with a some bookkeeping overhead.
$$为了满足我们的需求，我们要为被混合的类的成员创建替身（stand-in）属性及类型。这使得编译器在运行时可以获得这个类的成员。虽然这种记账式的做法会花费我们些时间，但之后我们就能从mixins中受益了。

```js
// Disposable
isDisposed: boolean = false;
dispose: () => void;
// Activatable
isActive: boolean = false;
activate: () => void;
deactivate: () => void;
```

$Finally, we mix our mixins into the class, creating the full implementation.
$$最后，我们把这两个类混合到了一个类中，完整地实现了这个类。

```js
applyMixins(SmartObject, [Disposable, Activatable])
```

$Lastly, we create a helper function that will do the mixing for us. This will run through the properties of each of the mixins and copy them over to the target of the mixins, filling out the stand-in properties with their implementations.
$$我们最后还创建了一个辅助函数来帮我们完成混合的工作。它会查询并复制每个被混合的类的属性，填充实现的类中的每一个属性。

```js
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    }); 
}
```
