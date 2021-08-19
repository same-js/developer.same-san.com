---
title: 【PHP/Linux】php.ini の探し方と修正方法
description:
createdAt: 2021-08-20
updatedAt: 2021-08-20
hashtag: 
  - PHP
  - Linux
---

## php.ini が置いてあるパスの探し方

```sh
$ php --ini
```
↑を実行すると、下記のように表示される。

```bash
Configuration File (php.ini) Path: /usr/local/etc/php
Loaded Configuration File:         (none)
Scan for additional .ini files in: /usr/local/etc/php/conf.d
Additional .ini files parsed:      /usr/local/etc/php/conf.d/docker-php-ext-sodium.ini
```
上記は、それぞれ次の通りの意味を持っている。

* `Configuration File (php.ini) Path:` ここに `php.ini` を置くと、それが読み込まれる。  
* `Loaded Configuration File:` 実際に読み込まれている `php.ini` のパス。 

ただし、上記の例では `Loaded Configuration File:` が `(None)` となっている。  
これは、`php.ini` が本来置かれるべき場所、つまり `/usr/local/etc/php` に  `php.ini` が置かれていない、ということを意味している。

### php.ini がない場合
PHPをインストールした以降に php.ini をいじった記憶がなければ、 `/usr/local/etc/php` は次のような感じになっているはず。

```bash
$ ls -ltar
total 156
drwxr-xr-x 1 root root  4096 Aug 20 02:29 ..
-rw-r--r-- 1 root root 72528 Aug 20 02:29 php.ini-production
-rw-r--r-- 1 root root 72382 Aug 20 02:29 php.ini-development
drwxr-xr-x 1 root root  4096 Aug 20 02:29 .
drwxr-xr-x 1 root root  4096 Aug 20 02:29 conf.d
```

つまり、下記の2種類の `php.ini` のベースファイルが置かれている。

* `php.ini-production`
* `php.ini-development`

これらのいずれかを `php.ini` にリネームして使用する、ということである。

## php.ini の修正方法

上記で `php.ini` が置かれている場所を特定し、（`php.ini` がない場合は）`php.ini` を作成した。  
だが、この `php.ini` を直接修正することは避けた方が良い。

その代わりに、先ほどの `php --ini` を実行した結果を再度見てみると、次の行があるはず。

```bash
Scan for additional .ini files in: /usr/local/etc/php/conf.d
```

`Scan for additional .ini files in:` は、ここに `.ini` ファイルを作成すれば、そのファイル内に記述した設定項目のみ、大元の `php.ini` の設定を上書きする、というパスである。

つまり、上記の例では `/usr/local/etc/php/conf.d` に `.ini` ファイルを作成すれば良いということになるため、例えばここに `lang.ini` を作成し、下記の2行を追加するだけで、 `php.ini` の `mbstring.mbstring.language` の記述を直接修正した場合と同じ結果を得ることができる。

```ini[lang.ini]
[mbstring]
mbstring.language = Japanese
```
