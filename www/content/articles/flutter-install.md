---
title: Flutter asdfを利用してインストール + バージョン管理
description:
createdAt: 2021-05-08
updatedAt: 2021-05-08
hashtag: 
  - Flutter
  - asdf
---

2021年のゴールデンウィークも残すところ2日となったが、とある機運により Flutter のモチベーションが高まったので、 入門してみた。

Intel版Mac で Flutter を動かすまでの知見を、備忘として残しておく。

## Dart言語のインストール

Flutter は、 Dart という Google が開発した言語で動作するため、まずはこれをインストールする。

```bash
$ brew tap dart-lang/dart # リポジトリの登録
$ brew install dart # インストール
```

## ローカル環境構築の方法を知る（Flutter SDK）

ざっと調べたところ、ローカル環境を構築する方法は、下記の3種類のよう。

### 公式サイトからSDKを直接インストール

最もシンプルなインストール方法は、公式サイトから SDK をダウンロードし、Mac に直接インストールすること。

* https://flutter.dev/docs/get-started/install/macos

とりあえず動かすだけならこの方法でよい。
ただし、これでは1つのMacに複数のバージョンをインストールして切り替えるのが難しそうなため、一旦なし。

### Dockerイメージにインストール

Docker で環境構築もできそう。
https://qiita.com/kurun_pan/items/47614dec03575036675d

ただし、今回は下記の理由で選択肢から外した。

* 公式イメージが存在するわけではない（CentOSなどのイメージに自分で Flutter をインストールする）
* （私個人に）ネイティブアプリ開発の知見が少なすぎて、Web以外の開発で Docker が使えるのか謎

ただ、最終的には Docker で構築して簡単に配布できるようにしたい。

### バージョン管理ツールでSDKをインストール

理想としては、バージョン管理ツールを使用し、複数のバージョンを同居させたい。  
ざっと調べたところ、下記のいずれかのツールを使用することで実現可能なことが分かった。

* [fvm](https://github.com/leoafarias/fvm) 
* [asdf](https://github.com/asdf-vm/asdf) + [asdf-flutter-plugin](https://github.com/oae/asdf-flutter) 

今回は 後者の asdf + asdf-flutter-plugin を採用する。

## asdf のインストール

下記の公式ドキュメントにて、開発機のOS・インストール方法を選択すると、最適な手順が表示されるので、基本的にはこれに従うのが良い。
* https://asdf-vm.com/#/core-manage-asdf

私の場合は、MacOS かつ Homebrew を使用したいので、下記の通りの手順となった。

### asdf 本体のインストール

```bash
$ brew install asdf
```

asdf の最新版を利用したい場合は、下記コマンドでインストールするとよいらしい（が、私は下記コマンドを実行しなくてもうまくいった）。

```bash
$ brew install asdf --HEAD
```

### shell の追加

公式の手順でやれと書かれているのでやるが、なぜこの手順が必要なのかは不明。  
（理由が分かったら追記する）

asdf.sh というファイルへの PATH を通す。

```bash
$ echo -e "\n# asdf Flutter のバージョン管理に使用" >> ~/.bash_profile
$ echo -e "\n. $(brew --prefix asdf)/asdf.sh" >> ~/.bash_profile
$ source ~/.bash_profile
```

### asdf-flutter-plugin の追加

```bash
$ asdf plugin-add flutter
```

インストールしたプラグインは、下記で確認できる。

```bash
$ asdf plguin list # Flutter と表示されればOK
```


参考：https://asdf-vm.com/#/core-manage-plugins

## Flutter のインストール

ここまでのインストールが完了したら、 Flutter 自体をインストールする。

### インストール可能なバージョンの確認

```bash
$ asdf list all flutter
```

### インストールを実行

```bash
asdf install flutter latest # 最新版をインストールする場合
asdf install flutter 2.0.6-stable # 特定のバージョンをインストールする場合
```
参考：https://asdf-vm.com/#/core-manage-versions


### インストール済みバージョンの確認

下記コマンドを実行し、インストール時に指定したバージョンが表示されるか確認する。

```bash
$ asdf list flutter
```

### 使用するバージョンの選択

ここまででインストールするバージョンの中から、使用したいバージョンを選択する。
下記コマンドを実行すると、 `$HOME/.tool-versions` に指定したバージョン情報が追記され、この追記を持って、バージョン選択が完了したこととみなされる。

```bash 
$ asdf global flutter 2.0.6-stable
```

#### （余談）global以外にインストールする方法

```bash 
asdf global <name> <version> [<version>...]
asdf shell <name> <version> [<version>...]
asdf local <name> <version> [<version>...]
```

* global： `$HOME/.tool-versions` に 使用するバージョン情報が記載される。
* shell： `$PWD/.tool-versions` に 使用するバージョン情報が記載される。
* local： 一旦知らなくても問題なさそう。詳細は [ここ](https://asdf-vm.com/#/core-configuration) を読むとよいらしい。 

最新安定版のバージョンは `global`、 プロジェクト固有のバージョンは `shell` を選択するのが無難なのかもしれない。

### 現在選択されているバージョンの確認

下記コマンドを実行し、先ほど選択したバージョンが表示されれば、正しくバージョンが選択されている。
```bash
$ asdf current flutter
```

### 最終確認

asdf コマンドではなく、 下記の flutter コマンド で正しく実行できるか確認する。

```bash
$ flutter --version
# Framework • revision 1d9032c7e1 (8 days ago) • 2021-04-29 17:37:58 -0700
# Engine • revision 05e680e202
# Tools • Dart 2.12.3
```
正常にインストールが成功していれば、上記のように バージョン情報（ Famework / Engine / Tools ）が表示される。

#### （余談）
`flutter --version` の 初回実行時に限り、下記のウェルカム・メッセージも表示される。

```
Framework • revision 1d9032c7e1 (8 days ago) • 2021-04-29 17:37:58 -0700
Engine • revision 05e680e202
Tools • Dart 2.12.3

  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                 Welcome to Flutter! - https://flutter.dev                  ║
  ║                                                                            ║
  ║ The Flutter tool uses Google Analytics to anonymously report feature usage ║
  ║ statistics and basic crash reports. This data is used to help improve      ║
  ║ Flutter tools over time.                                                   ║
  ║                                                                            ║
  ║ Flutter tool analytics are not sent on the very first run. To disable      ║
  ║ reporting, type 'flutter config --no-analytics'. To display the current    ║
  ║ setting, type 'flutter config'. If you opt out of analytics, an opt-out    ║
  ║ event will be sent, and then no further information will be sent by the    ║
  ║ Flutter tool.                                                              ║
  ║                                                                            ║
  ║ By downloading the Flutter SDK, you agree to the Google Terms of Service.  ║
  ║ Note: The Google Privacy Policy describes how data is handled in this      ║
  ║ service.                                                                   ║
  ║                                                                            ║
  ║ Moreover, Flutter includes the Dart SDK, which may send usage metrics and  ║
  ║ crash reports to Google.                                                   ║
  ║                                                                            ║
  ║ Read about data we send with crash reports:                                ║
  ║ https://flutter.dev/docs/reference/crash-reporting                         ║
  ║                                                                            ║
  ║ See Google's privacy policy:                                               ║
  ║ https://policies.google.com/privacy                                        ║
  ╚════════════════════════════════════════════════════════════════════════════╝

```


## エディタの用意と設定

あとは適当に creat-app 的なコマンドを実行したらプロジェクトが開始できるのかな？と思いきや、 専用のエディタを用意する必要があるらしい。

公式ドキュメントによれば下記のいずれかを使用するとのこと。

* Android Studio もしくは IntelliJ
* Visual Studio Code
* Emacs 

参考：https://flutter.dev/docs/get-started/editor

今回は Android Studio を選択する。
