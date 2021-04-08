---
title: Python pyenv 使い方
description:
createdAt: 2021-04-09
updatedAt: 2021-04-09
hashtag:
  - Python
  - pyenv
---

Mac にデフォルトで入っているPythonのバージョンは、かなり古い。  
（Catalinaですら Python 2.7だったりする）

複数のバージョンを入れて自由に切り替えできたほうが良いが、  
 pyenv ならそれが簡単に実現可能。


## 参考
* インストール方法
  * https://github.com/pyenv/pyenv
* コマンドの使い方
  * https://github.com/pyenv/pyenv/blob/master/COMMANDS.md

## インストール
pyenv のインストールは HomeBrew経由で行う。

```sh
$ brew update
$ brew install pyenv
```

## パスを通す
pyenv で選択したバージョンがMacで有効になるためには、 `~/.bash_profile` に適切にパスが設定されている必要がある。

下記コマンドで登録するか、
```sh
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bash_profile
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bash_profile
$ echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bash_profile
```

直接 `~/.bash_profile` を開いて、直接下記を書き込んでも良い。

```
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi
```

パスを通したら、 下記コマンドで `.bash_profile` の変更をターミナルに反映させる。  
（`.bash_profile` は、下記コマンド実行時か、Macユーザのログイン時にしか読み込みされない）

```sh
$ source .bash_profile
```

## 現在のバージョンを確認

```sh
$ pyenv --version
```

## インストール可能なpythonのバージョン一覧を確認

```sh
$ pyenv install --list
```

## 現在インストール済みのpythonのバージョンを確認

```sh
$ pyenv versions
```

## 特定のバージョンをインストール

```sh
$ pyenv install 3.9.0
```

## 使用するバージョンの選択
```sh
$ pyenv global 3.9.0
```
