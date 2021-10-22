---
title: 個人的によく利用するnpmコマンド
description:
createdAt: 2021-09-18
updatedAt: 2021-09-18
hashtag:
  - npm
  - Node.js
  - Javascript
---

備忘。

## インストール済みのライブラリの一覧取得／検索

基本形。
```bash
$ npm ls
```

グローバル版。
```bash
$ npm ls -g
```

特定のライブラリを探す場合は、後ろにライブラリ名を付与すれば普通に検索できる。

```bash
$ npm ls -g npm
/Users/xxx/.nodebrew/node/v15.3.0/lib
└── npm@7.0.14
```

前後一致で探す場合は、 grepコマンドで無理やり探す方法しかないか・・・？

```bash
$ npm ls -g | grep npm
├── npm-check-updates@11.8.5
├── npm@7.0.14
```

## ライブラリの情報を確認する

ライブラリの情報が確認できる。
（安定版/RC版/Beta版の最新がそれぞれいくつかも確認可能）

```bash
$ npm info [library]
# npm info vue
```

バージョン情報の一覧だけが欲しい場合

```bash
$ npm info [library]　versions
# npm info vue versions
```

特定のバージョン以下で絞り込みたい場合は、下記のようにすると良い。
（ `vue2.6.x` のみが表示される）
```bash
$ npm info [library@version]　version
# npm info vue@2.6 version
```

## アプリケーション内のライブラリバージョンアップ

現在のアプリケーションで使用しているバージョンと、アップデート可能な最新版を一覧で表示する

```bash
$ npm outdated
```

アップデートを実行する（マイナーバージョンアップデートのみ）

```bash
ncu -u --target minor # package.json のバージョンを書き直す
npm install # 書き直した package.json を元に、ライブラリをインストールする
```

上記の ncu コマンドを利用するためには、事前に下記でインストールが必要な点に注意。

```bash
$ npm install -g npm-check-updates
```
