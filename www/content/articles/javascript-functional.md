---
title: Javacript 関数型プログラミング
description:
createdAt: 2021-10-29
updatedAt: 2021-10-29
hashtag:
  - Javascript
  - 関数型言語
---

JavaScriptの関数型プログラミングにおいて、個人的によく利用するものの備忘。

## reduce
配列を順番に回すが、現在の値とその一つ前の値を受取り、加減乗除したり、文字列として結合したりできる。

公式ドキュメント：https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

### 例1:数値の加算

```javascript
const array1 = [1, 2, 3, 4];
const reducer = (previousValue, currentValue) => previousValue + currentValue;
console.log(array1.reduce(reducer));
// 10
```

### 例2:文字列結合

スラッシュ区切りやカンマ区切りのデータも簡単に記述可能。

```javascript
const array1 = ['りんご', 'みかん', 'もも', 'ぶどう'];
const reducer = (previousValue, currentValue) => previousValue + ' / ' + currentValue;
console.log(array1.reduce(reducer));
// 'りんご / みかん / もも / ぶどう
```

この使い方であれば、 [Array.prototype.join](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/join) でも代用は可能。

## filter

配列を順番に回し、条件に合うデータだけの配列を作ったり、条件に合わないデータだけを外した配列を作成可能。

## 例1: 基本形

```javascript
const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 6);

console.log(result);
// Array ["exuberant", "destruction", "present"]

```

### 例2: 他の関数型関数とメソッドチェーン

個人的には `filter` は単体ではなく、 `reduce` や `map` など 他の関数型関数と組み合わせて使用することが多い。

```javascript
const words = [
  {id: 1, name: 'spray', is_disp: false},
  {id: 2, name: 'limit', is_disp: true},
  {id: 3, name: 'elite', is_disp: false},
  {id: 4, name: 'exuberant', is_disp: false},
  {id: 5, name: 'destruction', is_disp: true},
  {id: 6, name: 'present', is_disp: false},
];
const result = words
  .filter(item => item.is_disp )
  .map( item => {
    return {
      id: item.id,
      name: item.name,
    }
  }
);
console.log(result);
// Array [
//   { id: 2, name: "limit" },
//   { id: "destruction", name: "present" }
// ]
```
