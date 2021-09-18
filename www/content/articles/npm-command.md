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
