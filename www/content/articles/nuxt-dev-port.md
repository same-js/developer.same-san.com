---
title: 【Nuxt.js】npm run dev または yarn dev 実行時にポート番号を指定する
description:
createdAt: 2022-02-12
updatedAt: 2021-02-12
hashtag:
  - Nuxt.js
  - npm
  - Yarn
---

`package.json` や `nuxt.config.ts` を直接編集する方法もあるが、そうではなく `npm run dev` もしくは `yarn dev` の実行時にオプションで動的にポート番号を指定する方法の備忘。

## npm

```bash
$ npm run dev -- -p 30001
```

## yarn

```bash
$ yarn dev -p 30001
```
