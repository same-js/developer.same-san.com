---
title: nodebrew 使い方
description:
createdAt: 2021-11-19
updatedAt: 2021-11-19
hashtag:
  - nodebrew
  - Node.js
metas:
  - noindex
---

nodebrew の使い方の備忘。  
nodebrew自体のインストール方法は割愛するが、homebrew経由でインストールするのが簡単で良い。

## インストール可能なバージョンを探す

```bash
$ nodebrew ls-remote
```

## インストールする

```bash
$ nodebrew install v17.0.1 # v17.0.1 をインストールしたい場合
```

### 余談： `nodebrew install-binary` のほうが早いという説について

 `nodebrew install` よりも `nodebrew install-binary` のほうが早い、と昔は言われていたが、これは文字通り「昔話」のようである。

というのも、最新版の nodebrew で `nodebrew --help` を実行してみると、次のように表示される。

```bash
$ nodebrew --help
    （中略）
    nodebrew install <version>            Download and install <version> (from binary)
    nodebrew compile <version>            Download and install <version> (from source)
    nodebrew install-binary <version>     Alias of `install` (For backward compatibility)
```

つまり、 `nodebrew install-binary` は `nodebrew install` の alias ということなので、どちらのコマンドであっても同じ処理が実行される、ということである。

昔は
* `nodebrew install-binary` は バイナリからインストール
* `nodebrew install` はソースをコンパイルしてインストール

という違いがあったため、後者だと時間がかかる、ということだったのだが、現在は `nodebrew install` でもバイナリからインストールされるため、このコマンドで問題なくなった、ということである。

## インストール済みのバージョンを確認する

```bash
$ nodebrew ls
```

## 使用したいバージョンを選択する

```bash
$ nodebrew use v17.0.1 # v17.0.1 を使用したい場合
```

## 正しく選択されたか確認する

正しく選択されていれば、下記の両方のコマンドで 選択したバージョンが表示される。
```bash
$ nodebrew ls
$ node --version
```

## 現在の Node.js のアーキテクチャを確認する

```bash
$ node -p process.arch
arm64
```

Apple Silicon（M1/M1 Pro/M1 Max）搭載のMacで、このコマンドの結果が `arm64` ではなく `x64` と表示される場合、それは M1（Arm）に最適化されていないバージョンとなる。
Rosetta2があるため、x64版の Node.js でも全く問題なく動くのだが、Apple Silicon Macならば arm64 版のほうが動作が速い。

## 参考
https://github.com/hokaccha/nodebrew