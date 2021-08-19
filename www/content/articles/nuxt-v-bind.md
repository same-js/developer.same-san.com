---
title: Nuxt.js で v-bind
description:
createdAt: 2021-08-20
updatedAt: 2021-08-20
hashtag:
  - Nuxt.js
  - Vue
---

基本は `Vue` 単体の場合と同じ。

## 基本形

```vue
<template>
  <container>
    <p>My name is <input type="text" v-model="name" style="color: #FFF;" /></p>
    <p>your input is {{ name }}</p>
  </container>
</template>
<script>
export default {
  data () {
    return {
      name: 'same.js'
    }
  }
}
</script>
```

ポイントは以下の3つ。全て満たさないと、入力した値が連動しない。
1. `data()` にて バインドしたい変数を宣言し、デフォルト値を代入する
1. `input` タグ の `v-model` 属性にて にバインドしたい変数名を入れる
1. 画面上に出力する場合は `{{ }}` で表示する

## 参考
https://jp.vuejs.org/v2/guide/forms.html
