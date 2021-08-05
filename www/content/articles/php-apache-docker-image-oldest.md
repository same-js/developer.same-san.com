---
title: 最も古い、現在利用可能な PHP(Apache同梱版) の Docker Image は 5.5 だった
description:
createdAt: 2021-08-05
updatedAt: 2021-08-05
hashtag: 
  - PHP
  - Apache
  - Docker
---

PHP の場合、下記に現在サポート対象となっている PHP の公式 Docker Image タグ一覧が記載されている。

* https://github.com/docker-library/docs/blob/master/php/README.md#supported-tags-and-respective-dockerfile-links

2021-08-05 現在、上記ドキュメントをみる限り、サポートされている中で 最も古い Apache同梱版 は `php:7.3.29-apache` である。つまり、PHP5系 はそもそもサポートされていない。ただ、PHP自体が 5系の中の最終版である `PHP5.6` ですら公式にサポートが終了していることを考えると、Docker Image のほうもサポートが終了していることはむしろ当然と言える。
* https://www.php.net/eol.php

しかし、PHP5系 の Docker Image はサポート終了しているだけであり、Docker Hub 上では 5系の Docker Image は一部まだ公開されている。つまり、ダウンロードしてビルドできる、ということである。調べてみたところ、 Apache同梱版の中で、現在取得できる最も古いバージョンは `php:apache-5.5` だった。（パッチバージョンまでは調べていない）

ちなみに `php-apache-5.5` より古いバージョン、例えば `php-apache-5.4` を指定して

```dockerfile[Dockerfile]
FROM php:5.4-apache
```

Docker Image の取得を試みたところ、次のエラーメッセージが出て失敗した。

```bash
$ docker-compose up -d
# Docker Compose is now in the Docker CLI, try `docker compose up`
# Building php
# [+] Building 1.4s (5/7)                                                                                                                                                                                                                                                    
#  => [internal] load build definition from Dockerfile                                                                                                                                                                                                                  0.0s
#  => => transferring dockerfile: 1.17kB                                                                                                                                                                                                                                0.0s
#  => [internal] load .dockerignore                                                                                                                                                                                                                                     0.0s
#  => => transferring context: 2B                                                                                                                                                                                                                                       0.0s
#  => [internal] load metadata for docker.io/library/php:5.4-apache                                                                                                                                                                                                     1.1s
#  => [internal] load build context                                                                                                                                                                                                                                     0.0s
#  => ERROR [1/3] FROM docker.io/library/php:5.4-apache@sha256:298f2295509309262b0daaa27e15e3682437d0210128f66d482381255b907582                                                                                                                                         0.0s
#  => => resolve docker.io/library/php:5.4-apache@sha256:298f2295509309262b0daaa27e15e3682437d0210128f66d482381255b907582                                                                                                                                               0.0s
# ------
#  > [1/3] FROM docker.io/library/php:5.4-apache@sha256:298f2295509309262b0daaa27e15e3682437d0210128f66d482381255b907582:
# ------
# failed to load cache key: invalid empty config file resolved for docker.io/library/php:5.4-apache@sha256:298f2295509309262b0daaa27e15e3682437d0210128f66d482381255b907582
# ERROR: Service 'php' failed to build : Build failed
```

※ `docker compose up` を使え、と促されているが、つい手癖で `docker-compose up` と入力してしまう。

## PHP 5.4 以前の Docker環境を作成したい場合

`PHP5.4` 以前の特定のバージョンをであることが必須要件ならば、下記のような Linuxディストリビューション をベースイメージとしてビルドし、そのコンテナ内にて自分で `PHP5.x` をインストールするのが確実だと思う。
* https://hub.docker.com/_/centos
* https://hub.docker.com/_/ubuntu


`PHP5.0` 〜 `PHP5.4` の中のいずれかを取得したい場合で、マイナーバージョンが違う程度の差異が容認できるのであれば `PHP5.5`（つまり `php:apache-5.5` ）で妥協するというのも、ひとつの手。

ただ、最初にも書いたことだが、PHP5系は そもそも最新の `PHP5.6` ですらサポートが切れている。特段の事情がない限りは、サポート内の `PHP7.3` 以降、可能であれば `PHP8.0` 以降を使うべきである。
* https://www.php.net/supported-versions.php

## 余談
`php:5.5-apache` では `vim-gtk3` がデフォルトではインストールできない。
代わりに `vim-gnome` をインストールするのが早い。
