---
layout: post
title:  Java HashMap的实现原理
date:   2014-12-27 08:35:07
author: 郝锡强
categories: blog
letex: false
tags: [java]
---
昨天在群里讨论的时候,有人突然说HashMap的实现做面试题考新人一考一个准,一下子就能区分开是不是真的有工作经验.妈蛋,我竟然也不是很确认,特此总结一下:

![hashmap01](/source/images/blog/hashmap01.jpg)

<!-- more -->
对于`HashMap`来说,你的每一次`put`操作后,都会对`key`取一次`hashcode`放入`table`中.`table`的每一个位置是一个`HashMapEntry`,因为`key`的`hashcode`有可能相同,这时`table`同一个位置的`HashMapEntry`就会`next`中追加一个`HashMapEntry`.

@Override public V put(K key, V value) {
    if (key == null) {
        return putValueForNullKey(value);
    }
    int hash = secondaryHash(key);
    HashMapEntry<K, V>[] tab = table;
    int index = hash & (tab.length - 1);
    for (HashMapEntry<K, V> e = tab[index]; e != null; e = e.next) {
        if (e.hash == hash && key.equals(e.key)) {
            preModify(e);
            V oldValue = e.value;
            e.value = value;
            return oldValue;
        }
    }
    // No entry for (non-null) key is present; create one
    modCount++;
    if (size++ > threshold) {
        tab = doubleCapacity();
        index = hash & (tab.length - 1);
    }
    addNewEntry(key, value, hash, index);
    return null;
}
void addNewEntry(K key, V value, int hash, int index) {
	table[index] = new HashMapEntry<K, V>(key, value, hash, table[index]);
}

计算 Hash 码的方法：hash()，这个方法是一个纯粹的数学计算，其方法如下：

...
int hash = key.hashCode();
hash ^= (hash >>> 20) ^ (hash >>> 12);
hash ^= (hash >>> 7) ^ (hash >>> 4);
...

存值或者取值的时候,也是通过`key`的`hash`的方式去取,它总是通过`h &(table.length -1)`来得到该对象的保存位置——而 `HashMap` 底层数组的长度总是2的`n`次方，这一点可参看后面关于`HashMap`构造器的介绍。当`length`总是2的倍数时，`h & (length-1)`将是一个非常巧妙的设计：假设h=5,length=16, 那么`h & length - 1`将得到5；如果h=6,length=16, 那么`h & length - 1`将得到6……如果h=15,length=16, 那么`h & length - 1`将得到 15；但是当h=16时,length=16时，那么`h & length - 1`将得到0了；当h=17时,length=16时，那么`h & length - 1`将得到 1 了……这样保证计算得到的索引值总是位于 table 数组的索引之内。

h&(table.length-1)|&nbsp;&nbsp;hash&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|table.length-1|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;result&nbsp;
8&(15-1)          |0100|  &  |1110          |  =  |0100
9&(15-1)          |0101|  &  |1110          |  =  |0100
8&(16-1)          |0100|  &  |1111          |  =  |0100
9&(16-1)          |0101|  &  |1111          |  =  |0101


static int indexFor(int h, int length) { 
	//android 的实现是直接使用h & (length-1),无此方法
    return h & (length-1); 
}


当`hashmap`中的元素越来越多的时候，碰撞的几率也就越来越高（因为数组的长度是固定的），所以为了提高查询的效率，就要对`hashmap`的数组进行扩容，数组扩容这个操作也会出现在`ArrayList`中，所以这是一个通用的操作，很多人对它的性能表示过怀疑，不过想想我们的“均摊”原理，就释然了，而在`hashmap`数组扩容之后，最消耗性能的点就出现了：原数组中的数据必须重新计算其在新数组中的位置，并放进去，这就是`resize`。那么`hashmap`什么时候进行扩容呢？当`hashmap`中的元素个数超过数组大小`*loadFactor`时，就会进行数组扩容，`loadFactor`的默认值为0.75，也就是说，默认情况下，数组大小为16，那么当`hashmap`中元素个数超过`16*0.75=12`的时候，就把数组的大小扩展为`2*16=32`，即扩大一倍，然后重新计算每个元素在数组中的位置，而这是一个非常消耗性能的操作，所以如果我们已经预知`hashmap`中元素的个数，那么预设元素的个数能够有效的提高`hashmap`的性能。比如说，我们有1000个元素`new HashMap(1000)`, 但是理论上来讲`new HashMap(1024)`更合适，不过上面[angeyu](http://www.iteye.com/topic/539465)已经说过，即使是1000，`hashmap`也自动会将其设置为1024。 但是`new HashMap(1024)`还不是更合适的，因为`0.75*1000 < 1000`, 也就是说为了让`0.75 * size > 1000`, 我们必须这样`new HashMap(2048)`才最合适，既考虑了&的问题，也避免了resize的问题。 

>参考<br/> [通过分析 JDK 源代码研究 Hash 存储机制](http://www.ibm.com/developerworks/cn/java/j-lo-hash/?ca=drs-tp4608)
