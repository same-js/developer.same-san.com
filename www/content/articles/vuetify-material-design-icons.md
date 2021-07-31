---
title: Vuetify で アイコンを使用する方法（Material Design Icons）
description:
createdAt: 2021-07-31
updatedAt: 2021-07-31
hashtag:
  - Vuetify
  - Material Design Icons
---

## 前提

一般的に使用される icon font の種類には、以下のようなものがある。
* Material Design Icons
* Material Icons
* Font Awesome 4
* Font Awesome 5

このうち Vuetify では、デフォルトで Material Design Icons　が 使用可能な状態となっている。

また、設定変更により Material Design Icons 以外の icon font、例えば Font Awesome なども利用可能となる。  
本記事ではその設定変更の手順は割愛するが、下記の公式ドキュメントには その手順が記載されている。
* https://vuetifyjs.com/ja/features/icon-fonts/

## Material Design Icon で使用可能なアイコンを検索する

下記のサイトで、使用したいアイコンを探す。
* https://materialdesignicons.com/

目当てのアイコンを見つけたら、そのアイコンのモーダルが開いた状態で、タイトル部の文字列をコピーする。（`Alias` の部分ではないことに注意）

コピーしたタイトル部分の文字列を、次のように `v-icon` タグで囲い、 `mdi-` 接頭に付与して挿入することで、アイコンが表示される。

```vue
<v-icon>mdi-{コピーした文字列}</v-icon>
```

つまり、 その文字列が `open-in-new` ならば、次のようにすれば良い。
```vue
<v-icon>mdi-open-in-new</v-icon>
```
