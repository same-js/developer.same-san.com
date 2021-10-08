---
title: Github Actions で npm module が Not Found だった場合の調査手順（備忘）
description:
createdAt: 2021-10-09
updatedAt: 2021-10-09
hashtag:
  - npm
  - Node.js
  - GitHub
metas:
  - noindex
---

昨日、いつも通りの手順で このブログの記事を書き、GitHub に commit & push したのだが、GitHub Actionsで下記のエラーが発生し、 Deploy に失敗した。

```bash
Run npm install
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@nuxt/content/-/content-1.14.0.tgz - Not found
npm ERR! 404 
npm ERR! 404  '@nuxt/content@https://registry.npmjs.org/@nuxt/content/-/content-1.14.0.tgz' is not in this registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404 
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/runner/.npm/_logs/***-debug.log
Error: Process completed with exit code 1.
```

備忘として調べた経緯を残しておく。

## 結論
Web上の npm registry から、このブログのコアである `@Nuxt/Content` のライブラリが一時的に消えていたことが原因だった。  
（翌日にはライブラリが npm registry に復活していたため、何もしなくてもエラーが発生しなくなっていた）

## 調査

最初に、上記のエラーログをざっくり訳すと、 `@Nuxt/Content` というライブラリはWeb上に存在しないから取得できない、という状況であることが分かった。  
一応 Nuxt 公式のライブラリなのに、意図的に削除する（or される）ことはあるのか・・・？ と思いつつも、無いと言うなら無いのだろう。

エラーログを見つつ、条件を整理すると次の通り。
* 実行環境: GitHub Actions
* 見当たらないライブラリ: `@nuxt/content`
* npm registry: https://registry.npmjs.org

これがGitHub Actions 固有の問題なのか、 それとも環境を問わず発生する問題かを特定するために、次の調査を行った。

### npm repositry が同じか確認

まず、 ローカル環境 と GitHub Actions環境 で同じ npm registry を使用しているか確認。結果は全く同じ registry を参照していた。

```bash
$ npm config get registry
https://registry.npmjs.org/
```

### ローカル環境で npm module を検索

ローカル環境から `@Nuxt/Content` ライブラリを検索したのだが、ライブラリは見つからなかった。

```bash
$ npm info @nuxt/content

npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@nuxt%2fcontent - Not found
npm ERR! 404 
npm ERR! 404  '@nuxt/content@latest' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404 
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
...
```

## ここまで調べて

ここまで、 GitHub Actions環境では ローカル環境と全く差異がなく、ローカル環境でも同じようにライブラリが見当たらない状態だったことから環境差異による問題ではない、と推測。  
調査の続きは明日やろう・・・と思って、翌日、再度 ライブラリを検索したら、普通に復活していた。

```bash
$ npm info @nuxt/content

@nuxt/content@1.14.0 | MIT | deps: 40 | versions: 32
https://github.com/nuxt/content#readme

...
dist-tags:
latest: 1.14.0  

published 7 months ago by pi0 <pyapar@gmail.com>
```

これなら、GitHub Actions を再実行したら今度は成功するのでは・・・？と思って、再度実行したら、GitHub Actions 上で問題なく `@Nuxt/Content` が取得・インストールでき、Deploy も問題なく完了していた。

## 余談
時間が解決してくれただけで根本解決の方法が見つかったわけではないので、本当に困っている人にとっては役に立たない内容かもしれない。
そのため、困っている人からすると、この記事は検索結果のノイズになってしまうだろうと思う。

ただ、自分用の備忘としてWebには残しておきたいため、 本記事には `noindex` を設定して公開することにした。
