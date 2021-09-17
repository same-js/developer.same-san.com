---
title: npm audit fix したら npm version mismatch が発生した場合の解決方法
description:
createdAt: 2021-09-18
updatedAt: 2021-09-18
hashtag:
  - Nuxt.js
  - Vue
  - npm
  - Javascript
---

このブログにRSS配信機能を実装しようと思い、 `@nuxt-feed` をインストールしようとしたところ、次の脆弱性のアラートが上った。  

```bash
$ npm install @nuxtjs/feed

added 6 packages, and audited 1617 packages in 9s

186 packages are looking for funding
  run `npm fund` for details

16 vulnerabilities (14 moderate, 2 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

※ `@nuxt-feed` をインストールしようとしたことは直接的な原因ではない。  
`npm install` コマンドを実行するタイミングで、そのアプリケーションで使用しているライブラリの脆弱性チェックが走るのだが、たまたまこのタイミングで脆弱性が発見されただけである。

`2 high` とあるので、クリティカルな脆弱性が2件あったということである。  
そのため、アラートの内容に従い、 `npm audit fix` した。  
（`npm audit fix` は脆弱性が含まれていないバージョンを探し、そのアプリケーションで使用しているライブラリのバージョンを自動で変更してくれるコマンド）

```bash
$ npm audit fix

added 20 packages, removed 13 packages, changed 198 packages, and audited 1624 packages in 31s

196 packages are looking for funding
  run `npm fund` for details

# npm audit report

glob-parent  <5.1.2
Severity: moderate
Regular expression denial of service - https://npmjs.com/advisories/1751
fix available via `npm audit fix --force`
Will install nuxt@2.13.3, which is a breaking change
node_modules/watchpack-chokidar2/node_modules/glob-parent
  chokidar  1.0.0-rc1 - 2.1.8
  Depends on vulnerable versions of glob-parent
  node_modules/watchpack-chokidar2/node_modules/chokidar
    watchpack-chokidar2  *
    Depends on vulnerable versions of chokidar
    node_modules/watchpack-chokidar2
      watchpack  1.7.2 - 1.7.5
      Depends on vulnerable versions of watchpack-chokidar2
      node_modules/watchpack
        webpack  4.44.0 - 4.46.0
        Depends on vulnerable versions of watchpack
        node_modules/webpack
          @nuxt/webpack  >=2.14.0
          Depends on vulnerable versions of webpack
          node_modules/@nuxt/webpack
            @nuxt/builder  >=2.14.0
            Depends on vulnerable versions of @nuxt/webpack
            node_modules/@nuxt/builder
            nuxt  >=2.14.0
            Depends on vulnerable versions of @nuxt/webpack
            node_modules/nuxt

8 moderate severity vulnerabilities

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

```

これ自体は問題なく終わったのだが、その後、 `npm run dev` が失敗するようになってしまった。

```bash
$ npm run dev

> developer.same-san.com@1.0.0 dev
> nuxt


 FATAL                                                                                                                                                     15:18:06

Vue packages version mismatch:

- vue@2.6.12
- vue-server-renderer@2.6.14

This may cause things to work incorrectly. Make sure to use the same version for both.


  
  Vue packages version mismatch:
  
  - vue@2.6.12
  - vue-server-renderer@2.6.14
  
  This may cause things to work incorrectly. Make sure to use the same version for both.
  
  at Object.<anonymous> (node_modules/vue-server-renderer/index.js:8:9)
  at Module.o._compile (node_modules/jiti/dist/v8cache.js:2:2778)
  at Object.Module._extensions..js (node:internal/modules/cjs/loader:1131:10)
  at Module.load (node:internal/modules/cjs/loader:967:32)
  at Function.Module._load (node:internal/modules/cjs/loader:807:14)
  at Module.require (node:internal/modules/cjs/loader:991:19)
  at n (node_modules/jiti/dist/v8cache.js:2:2472)
  at Object.<anonymous> (node_modules/@nuxt/vue-renderer/dist/vue-renderer.js:19:27)
  at Module.o._compile (node_modules/jiti/dist/v8cache.js:2:2778)
  at Object.Module._extensions..js (node:internal/modules/cjs/loader:1131:10)


   ╭────────────────────────────────────────────────────────────────────────────────────────────╮
   │                                                                                            │
   │   ✖ Nuxt Fatal Error                                                                       │
   │                                                                                            │
   │   Error:                                                                                   │
   │                                                                                            │
   │   Vue packages version mismatch:                                                           │
   │                                                                                            │
   │   - vue@2.6.12                                                                             │
   │   - vue-server-renderer@2.6.14                                                             │
   │                                                                                            │
   │   This may cause things to work incorrectly. Make sure to use the same version for both.   │
   │                                                                                            │
   │                                                                                            │
   ╰────────────────────────────────────────────────────────────────────────────────────────────╯

npm ERR! code 1
npm ERR! path /Users/xxx/Develop/developer.same-san.com/www
npm ERR! command failed
npm ERR! command sh -c nuxt

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/xxx/.npm/_logs/2021-09-17T12_18_06_044Z-debug.log

```

これは `npm audit fix` の実行により、 `vue@2.6.12` と `vue-server-renderer@2.6.14` のバージョンが同じでなくなったことが原因で発生しているエラーらしい。

## 解決方法

バージョンが異なるならば、バージョンを揃えればOK。  
特段の事情がない限りは（セキュリティなどの面で）新しいほうに揃えるほうが良い。  
そのため、まずは `vue` を `2.6.14` にアップデート可能か確認する。

```bash
$ npm info vue@2.6 version
vue@2.6.0 '2.6.0'
vue@2.6.1 '2.6.1'
vue@2.6.2 '2.6.2'
vue@2.6.3 '2.6.3'
vue@2.6.4 '2.6.4'
vue@2.6.5 '2.6.5'
vue@2.6.6 '2.6.6'
vue@2.6.7 '2.6.7'
vue@2.6.8 '2.6.8'
vue@2.6.9 '2.6.9'
vue@2.6.10 '2.6.10'
vue@2.6.11 '2.6.11'
vue@2.6.12 '2.6.12'
vue@2.6.13 '2.6.13'
vue@2.6.14 '2.6.14'
```

`vue@2.6.14` があることが確認できたので、次のコマンドを実行する。

```bash
npm install vue@2.6.14
```

再び `npm run dev` を実行したところ、無事に起動するようになった。
