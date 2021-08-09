---
title: 【Nuxt.js】Nuxt/Content のデータ取得処理を子コンポーネントで行えるようにする
description:
createdAt: 2021-08-10
updatedAt: 2021-08-10
hashtag:
  - Vue
  - Nuxt.js
---

Nuxt/Content で記事の取得を行う場合、 公式ドキュメントでは下記のように `asyncData` を使用する前提でサンプルコードが書かれている。
```javascript
async asyncData({ $content, params }) {
  const article = await $content('articles', params.slug).fetch()

  return {
    article
  }
}
```

* https://content.nuxtjs.org/ja/examples
* https://content.nuxtjs.org/ja/fetching

ただし、 `asyncData` は ページコンポーネントでしか使用できない機能のため、子コンポーネントに記事の取得処理を切り出したい場合は、このサンプルコードを子コンポーネントにそのまま移植するだけでは正しく動作しない。

今回は、それを子コンポーネントで正しく動くように修正したので、その備忘。

## 注意事項

記事の取得処理を子コンポーネントに移した後、その読込処理を使用しているページでは読込処理がわずかに遅くなった。  
`nuxt generate` 後のソースでは全く重くなっていないと感じるため、SSGを前提としているなら問題ないと思うが、（`nuxt generate` に頼らない）SPA・SSRを前提としたアプリケーションの場合にはこの記事で書いた方法はあまり良い方法ではないかもしれない。

## 修正前のコード

```javascript
export default {
  async asyncData ({ $content, params }) {
    const articles = await $content('articles')
      .sortBy('createdAt', 'desc')
      .where({ hashtag: { $contains: params.id } })
      .fetch()
    return { articles }
  }
}
```

## 修正後のコード

* 親コンポーネントからは `hashtag` を受け取る
* 記事取得結果は `articles` に代入し、 `template` で使用可能となるようにする

```javascript
export default {
  props: ['hashtag'],
  data () {
    return {
      articles: []
    }
  },
  async fetch () {
    this.articles = await this.$content('articles')
      .sortBy('createdAt', 'desc')
      .where({ hashtag: { $contains: hashtag } })
      .fetch()
  }
  ...
}
```

ポイントは

* あらかじめ `data():` で 記事の取得結果を代入したい変数を宣言をしておく必要がある（`articles`）
* `fetch` では その宣言した変数に対して、 `this.変数` の形で代入する（`this.articles`）
* （グローバルに依存注入された） `$content` も `fetch` では `this.$content` の形で呼び出す
* 親コンポーネントから受け取る値は `props` に与えておくことで `fetch` 内で 呼び出し可能になる（`hashtag`）

上記のポイントは Nuxt/Content 独特の実装方法によるものではなく、Nuxt.js の `asyncData` と `fetch` の違いや、 Vue.js 自体のコンポーネントの値の受け渡し方法によるものなので、下記をきちんと理解できていれば実はそんなに難しい話ではないはず。

* https://ja.nuxtjs.org/docs/2.x/features/data-fetching
* https://ja.nuxtjs.org/docs/2.x/components-glossary/pages-fetch
* https://jp.vuejs.org/v2/guide/components-props.html#%E5%8D%98%E6%96%B9%E5%90%91%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%83%95%E3%83%AD%E3%83%BC

## 参考
* https://github.com/nuxt/content/issues/97
