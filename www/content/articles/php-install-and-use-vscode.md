---
title: HomebrewでPHPをインストールし、VSCodeの構文解析でそのPHPを使用する
description:
createdAt: 2022-02-13
updatedAt: 2022-02-13
hashtag: 
  - PHP
  - Homebrew
  - VSCode
---

私が以前購入した Intel版Macには デフォルトでPHP7.2が入っていたはずなのだが、私が最近購入した Apple Chip版Mac（MacBook Pro 14inch）には、そもそもデフォルトではPHP自体が入っていなかった。  
（`php --version` も `which php` も効かない）

購入後、移行アシスタントでIntel機からデータを複製してからスタートしてしまったため、それをせずに使用開始したApple Chip版では違うのかもしれない。

それは良いとして、自分の場合は、ローカルマシンでPHPを動かしたい時は特に事情がない限りDockerで動かしてしまうのと、VSCode では `PHP Intelephense` という拡張機能入れるだけで、PHP実行環境を指定しなくてもそれなりに新しいPHPバージョンで構文チェックしてくれてしまうので、そもそもPHPの実行環境が入っていないことにしばらく気づかなかった。

しかし、PHP実行環境を入れずに `PHP Intelephense` だけに頼る方法では、最新版（8.1）特有の書き方（`readonlyプロパティ` など)をすると構文チェックエラーとなってしまうため、やはり最新版のPHP実行環境は必要ということで、インストールしていく。

## 前提

VSCode に最新版を認識させたいだけなので、バージョン管理ツール（`phpenv` や `phpbrew` など）は使用しない。

## 手順

まずは利用可能なPHPに関するパッケージはどのようなものがあるのか、確認する。

```bash[bash]
$ brew search php
==> Formulae
brew-php-switcher   php-code-sniffer    php-cs-fixer@2      php@7.3             php@8.0             phplint             phpmyadmin          phpunit             pup
php                 php-cs-fixer        php@7.2             php@7.4             phpbrew             phpmd               phpstan             pcp

==> Casks
eclipse-php                         
```

あえて古いバージョンを明示的にインストールしたい場合は、 `php@7.4` や `php8.0` などの @つきをインストールすれば良い。また、プロダクトごとにPHPバージョンを切り替えて使用したい場合は、 `phpenv` や `phpbrew`、 `brew-php-switcher` などをインストールすれば良い。

しかし、今回はバージョン管理を考慮せず最新を決め打ちで入れれば良いため、一番シンプルな `php` をインストールする。

```bash[bash]
$ brew install php
```

少し時間がかかるが、上記コマンドが完了したら、次のコマンドでインストールが正常に完了していることを確認する。

```bash
$ php --version
PHP 8.1.2 (cli) (built: Jan 21 2022 04:34:05) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.1.2, Copyright (c) Zend Technologies
    with Zend OPcache v8.1.2, Copyright (c), by Zend Technologies
```

以上。私の環境の場合は、特に `bash_profile` を編集してパスを通すことは不要で、 `brew install php` だけであっさり終わった。


## PHP本体やiniファイルのパスの確認方法

### php本体

```bash[bash]
$ which php
/opt/homebrew/bin/php
```

### php.ini

```bash[bash]
$ php --ini
Configuration File (php.ini) Path: /opt/homebrew/etc/php/8.1
Loaded Configuration File:         /opt/homebrew/etc/php/8.1/php.ini
Scan for additional .ini files in: /opt/homebrew/etc/php/8.1/conf.d
Additional .ini files parsed:      /opt/homebrew/etc/php/8.1/conf.d/ext-opcache.ini
```

## VSCodeへの設定

メニューバーにて `Code` > `基本設定` > `設定` とクリックしていくと表示される画面にて、 `PHP` と検索すると、`PHP Intelephense > Environment > PHP Version` という項目があるので、ここを先ほどインストールしたPHPバージョン（今回は `8.1`）に書き換える。

空欄にするとインストールされているPHPバージョンの最新となるようだが、少ししか動作確認はしていない。

### （補足）setting.jsonへの実行環境の追記について

`setting.json` に 下記を追記することで、PHP実行環境を明示する方法もあるようだが、私の環境ではこれは不要だった。

```json[setting.json]
{
    （...省略...）
    "php.validate.executablePath": "/opt/homebrew/bin/php"
}
```

おそらく、 `php` でパスが通っているならば、自動的にそれを拾ってくれるのだと思う。`php` でパスが通っていない場所に置いた PHP実行環境を明示的に指定したい場合の設定かと。


