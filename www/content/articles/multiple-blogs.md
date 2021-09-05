---
title: 【個人的なメモ/Nuxt.js+GitHub】複数ブログで同じ動的ソースを使い回す方法を考える
description:
createdAt: 2021-09-06
updatedAt: 2021-09-06
hashtag:
  - Nuxt.js
  - Git
  - GitHub
metas: 
  - noindex
---

## 前提
* `Nuxt.js`+`Nuxt/Content`でブログを複数作りたい（例えば 技術ブログ用、日記用、個人メモ用）
* しかし、ブログの動的処理の部分は、一元管理したい
  * ブログごとに個別にNuxt・Vueのソースを管理したくない
  * 全てのブログで、動的処理・デザインなどは完全に同じで良い

## 検討中の方法
1. 複数ブログの記事を完全に同じリポジトリで管理する
  * こんな感じでいけるのでは、という想定
    * content ディレクトリ内を次のように切る
      * developer：技術ブログ用
      * diary：日記用
      * others：その他用
    * GitHub Actions に次の設定で Code Deploy を構築する
      * content ディレクトリの変更を監視する
      * content ディレクトリ内にて、上述した3つのディレクトリのどれに変更があったかを判定する
        * その結果により 異なる nuxt generate を走らせる
        * その結果により 異なる AWS S3 bucket へ sync を行う
  * デメリット
    * 全てのブログの変更履歴が1リポジトリにコミットされるので、commit history が煩雑になる
1. コンポーネント管理用のリポジトリと 各ブログ用リポジトリを分けて管理する
  * 各ブログ用リポジトリからコンポーネント管理要のコンポーネントを参照できる仕組みを探す
    * `git submodule` or `git subtree` が有力か
  * 各リポジトリに GitHub Actions に次の設定で Code Deploy を構築する
    * 変更があった場合、コンポーネント管理用のリポジトリの情報を 参照・取得した上で `nuxt generate` する
  * メリット・デメリット
    * まだ分からない。検証してみないことには。

## 私見
いまのところ、2番目の案を検討中。  
まずは `git submodule` or `git subtree` について試す。
