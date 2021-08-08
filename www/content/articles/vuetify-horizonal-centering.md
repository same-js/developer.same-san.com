---
title: Vuetify で Component の最大幅を指定した上で、その Component を水平（左右）中央に配置する
description:
createdAt: 2021-08-09
updatedAt: 2021-08-09
hashtag:
  - Vue
  - Vuetify
---

普通に scss を書いて当ててもいいのだが、 Vuetify の機能に頼って実現する場合、どうしたら良いかという備忘。

## 手順

### 最大幅を指定

[v-card API](https://vuetifyjs.com/ja/api/v-card/#api-props) に `max-width` という Props があるので、これに希望の最大幅を指定する。

```html
<v-card
  max-width="800"
>
```


### 水平中央に配置

`v-card` の最大幅（`max-width`） を `800px` に指定しただけだと、その最大幅を上限として、左寄せで配置されてしまう。  

そこで [spacing helper](https://vuetifyjs.com/ja/styles/spacing/) を用いて、 左右の padding を auto に指定する。  
具体的には、左右中央 に 配置したい Component の class に `mx-auto` を付与する。

```html
<v-card
  max-width="800"
  class="mx-auto"
>
```

## 余談

上記の記述によって実行されるのは、 一般的な css で 水平配置をする場合に用いる、
* style に `margin-left: auto;margin-right: auto` を適用する
* sthle に `max-width: 800px;` を適用する
と（おそらく）同じことなので、下記のように普通に scss を書いて当てても同じ結果が得られるはず。

```html[任意のVueファイル]
<v-card
  class="centering"
>
```

```scss[/assets/css/style.scss]
.centering {
  margin-left: auto;margin-right: auto;
  max-width: 800;
}
```

複数の Component に一括で適用したい場合は、普通に css を当てるほうが便利かもしれない。
