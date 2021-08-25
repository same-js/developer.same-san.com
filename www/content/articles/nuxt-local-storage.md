---
title: Nuxt.js で Local Storage を利用する
description:
createdAt: 2021-08-24
updatedAt: 2021-08-24
hashtag:
  - Nuxt.js
  - Vue
  - Local Storage
---

基本は `Vue` 単体の場合と同じ。

## 基本形

```vue
<template>
  <container>
    <p>My job is <input type="text" v-model="job" /></p>
    <p>Your input is {{ job }}</p>
  </container>
</template>
<script>
export default {
  data () {
    return {
      job: ''
    }
  },
  mounted () {
    if (localStorage.job) {
      this.job = localStorage.job
    }
  },
  watch: {
    job (newJob) {
      localStorage.job = newJob
    }
  }
}
</script>
```

## 余談
`Session Storage` は ブラウザを閉じると削除される。  
`Local Storage` は ブラウザを閉じても削除されない。


## 参考
https://jp.vuejs.org/v2/cookbook/client-side-storage.html#%E5%9F%BA%E6%9C%AC%E3%81%AE%E4%BE%8B
