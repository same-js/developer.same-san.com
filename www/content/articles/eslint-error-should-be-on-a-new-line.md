---
title: "'hogehoge' should be on a new line を解決する"
description:
createdAt: 2021-05-07
updatedAt: 2021-05-07
hashtag: 
  - JavaScript
  - ESLint
  - エラー
---

## 発生理由
ESLint による 構文チェックエラー。

タグ内に複数の属性がある場合、可読性を上げるためにその属性を改行する必要がある。  
（おそらく、属性の数が 3 を超える場合に発生すると思われる）

## 解決方法
HTMLタグの属性ごとに改行を入れる。  
（ 厳密には、 `hogehoge` に指定された属性の直前で改行を入れる が正しい ）

## 具体例

例えば、次のようなコードがある場合、
```html [HTML]
<a itemscope itemtype="https://schema.org/WebPage"
  itemprop="item" itemid="https://example.com/books/sciencefiction"
  href="https://example.com/books/sciencefiction">
  <span itemprop="name">Science Fiction</span>
</a>
``` 


次のエラーが発生する。
```[Terminal]
 16:14  error  'itemscope' should be on a new line  vue/max-attributes-per-line
 16:24  error  'itemtype' should be on a new line   vue/max-attributes-per-line
 17:30  error  'itemid' should be on a new line     vue/max-attributes-per-line
```

下記のように、指定された属性ごとに改行を入れることで、エラーが発生しなくなる。
```html [HTML]
<a
  itemscope
  itemtype="https://schema.org/WebPage"
  itemprop="item"
  itemid="https://example.com/books/sciencefiction"
  href="https://example.com/books/sciencefiction">
  <span itemprop="name">Science Fiction</span>
</a>
```
