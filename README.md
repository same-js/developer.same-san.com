# Nuxt.js を試す

Vue.js + Nuxt.js + Vuetify の学習用に作成したリポジトリです。

## ローカル環境で動作させる（Mac）

下記手順は ざっくりした備忘のため、のちほど検証して修正する予定です。

### Node.js および npm のインストール

まず Mac 本体に Node.js および npm がインストールされているか確認する。


```bash [bash]
$ node -v # バージョン情報が表示されれば Node.js はインストールされている
$ npm -v # バージョン情報が表示されれば、 npm はインストールされている
```

インストールされていない場合は、それぞれインストールする。インストールされていない場合は、下記に従い、インストールする。
#### Node.js
最も簡単なインストール方法は、 下記からインストーラーをダウンロードし、実行すること。
* https://nodejs.org/ja/download/

ただし、個人的には Homebrew 経由で NodeBrew をインストールする方法をおすすめしたい。  
（Mac内に複数バージョンのNode.jsが同居できるようになる）
* [Homebrew](https://brew.sh/index_ja)
* [Nodebrew](https://github.com/hokaccha/nodebrew) 

#### npm
Node.jsをインストール完了後、下記コマンドを実行する。
```bash
$ sudo npm install -g npm
```

### 依存ライブラリのインストール
本リポジトリで使用する依存ライブラリをインストールする。
```bash
$ cd path/TO/www # path/TO/ は 本リポジトリをcloneしたパス
$ npm install
```

### ローカル環境の起動
下記コマンドを実行すると、ローカル環境が起動する。
```bash
$ npm run dev
```
これにより、 http://localhost:3000 へアクセスすることで、ローカル環境接続可能となる。

## コミットメッセージのルール

このリポジトリでは、コミットメッセージの先頭に、下記の接頭辞（prefix）を付与するというルールで運用している。  
これは、それが「何に対して」「何の操作をした」 コミットであるかを簡単に把握できるようにする、という目的である。

接頭辞 | 何に対して | 何の操作をしたか | 備考
--- | --- | --- | ---
add | ソースコード | 画面・機能等の新規作成 | 
update | ソースコード | 画面・機能の修正 | 
bugfix | ソースコード | バグの修正 | 
impolove | ソースコード | 機能に影響のない改善 | 主にリファクタリング
add-article | 記事 | 記事の追加 | 記事もMarkdownファイルとしてこのリポジトリ管理しているため
update-article | 記事 |  記事の修正 | 
remove-article |記事 | 記事の削除 | 
add-doc | ドキュメント |ドキュメント追加 | 各ディレクトリ内の`README.md`、 `/Document` 配下の資料を操作する場合に使用
update-doc | ドキュメント | ドキュメント修正 | 
update-actions | CI/CD設定 | CI/CD に関する機能追加 | `/.github/workflows` 配下を操作する場合に使用
