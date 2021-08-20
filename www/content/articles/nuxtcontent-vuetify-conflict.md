---
title: 【Nuxt/Content + Vuetify】コードブロックの表示がおかしくなる問題を解決する
description:
createdAt: 2021-08-21
updatedAt: 2021-08-21
hashtag:
  - Nuxt.js
  - NuxtContent
  - Vuetify
  - Vue.js
---

Nuxt/Content + Vuetify で コードブロックを記述すると、 最初の行の1文字目に変な padding （空白）が入ってしまったり、文字の背景に色がついてしまう、という現象が発生して困ったので、その原因と解決策の備忘。

## 原因

Nuxt/content のハイライトと、 Vuetify のハイライトが二重で有効になっているため。

具体的には、
* Vuetify： `.v-application code` のプロパティに対して ハイライトを設定している
* Nuxt/Content： `.nuxt-content-highlight code` のプロパティに対して ハイライトを設定している

というように、 両者が code タグに対して css を当てている。

## 解決法1

最も簡単なのは、 次のように Vuetify の `v-application code` を無効化すること。

```scss
// Vuetify.js の コードブロック style を無効化
.v-application code {
  all: unset !important;
} 
```

ただ、これだと コードブロック（ `これ` みたいな ） の 背景色やフォントまで無効化されてしまう。

## 解決法2

解決法1の問題点を避けるためには、Vuetify のハイライトを直接無効にするのではなく、  
無効にしたい Vuetify ハイライト を Nuxt/Content 側で個別に無効化するのが良いかなと思った。

私の場合は、次のように 背景色 と パディング のみを無効化するというところで落ち着いた。

```scss
.nuxt-content-highlight code {
  background-color: unset !important;
  padding: unset !important;
}
```
