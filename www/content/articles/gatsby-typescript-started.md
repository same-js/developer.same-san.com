---
title: Gatsby + TypeScript の環境構築
description:
createdAt: 2021-12-27
updatedAt: 2021-12-27
hashtag: 
  - React
  - TypeScript
  - Gatsby
---

Gatsby + TypeScript 環境を構築したときの備忘。

公式ドキュメント
* https://www.gatsbyjs.com/docs/how-to/local-development/starters/
* https://www.gatsbyjs.com/plugins/gatsby-plugin-typescript/

## Gatsby CLI と TypeScript をインストール

下記コマンドで、クライアントマシン本体に Gatsby CLI および typescript がインストールされているか確認する。

```bash
npm ls -g gatsby-cli
npm ls -g typescript
```
クライアントマシンにまだインストールしていない場合のみ、下記を実行する。

```bash
npm install -g gatsby-cli
npm install -g typescript
```

## プロジェクト作成

空の状態を作成するなら下記コマンドだが、今回はこちらを使用しない。

```bash
$ gatsby new
```

代わりに、テンプレートを利用して作成するため、下記コマンドを実行する。

```bash
$ gatsby new gatsby-starter-blog https://github.com/gatsbyjs/gatsby-starter-blog
```

ディレクトリ名を指定するならば、次のようにする。  
この例では、`app` というディレクトリが作成され、その中にプロジェクトが作成される。

```bash
$ gatsby new app https://github.com/gatsbyjs/gatsby-starter-blog
```

## 起動方法
先ほど作成したパスに移動し、 `gatsby develop`

```bash
$ cd app
$ gatsby develop
```

## TypeScript化

### `gatsby-config.js`

`plugins` 内に次の記述を追記する

```js
{
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `jsx`, // defaults to "React"
        allExtensions: true, // defaults to false
      },
    },
```

### `gatsby-node.js`

```js
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
```
の部分を
```js
  const blogPost = path.resolve(`./src/templates/blog-post.ts`)
```
に変更

## ファイルの拡張子変更

次の通り、各jsファイルの拡張子を `ts` に変更する。
* `src/templates/blog-post.js` → `src/templates/blog-post.ts`
* `src/components/bio.js` → `src/components/bio.ts`
* `src/components/layout.js` → `src/components/layout.ts`
* `src/components/seo.js` → `src/components/seo.ts`
* `src/pages/index.js` → `src/pages/index.ts`
* `src/pages/404.js` → `src/pages/404.ts`
