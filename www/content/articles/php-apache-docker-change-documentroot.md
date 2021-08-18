---
title: 【PHP + Apache + docker-compose】公式Dockerイメージでドキュメントルートを変更する
description:
createdAt: 2021-08-19
updatedAt: 2021-08-19
hashtag: 
  - PHP
  - Docker
  - docker-compose
  - Apache
---

Docker Hub から取得できる PHP+Apache の公式イメージでは、デフォルトの DocumentRoot は `/var/www/html` となっている。

これを `var/www/public` に変更した際の備忘。

## 手順

### Dockerfile

```Dockerfile[Dockerfile]
FROM php:8-apache

RUN apt-get -y update \
  && apt-get -y upgrade \
  && apt-get install -y wget \
  
  # ドキュメントルートを変更する
  ENV APACHE_DOCUMENT_ROOT='/var/www/public/'
  RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
  
  # コンテナログイン時のパスを最後に指定
  WORKDIR  /var/www/public
```

`ENV` では Apache内の環境変数に、DocumentRoot となるべきパスの値をセットしている。

その次の `RUN` についてだが、 前提として Apache の conf では、デフォルトの DocumentRootは `/var/www/html` とベタ書きされている。  
`RUN` のやっていることは、このベタ書きされた値を、環境変数 `APACHE_DOCUMENT_ROOT` を参照するように書き換えることである。 `/var/www/public/` というベタ書きに置き換えているわけではないという点に注意。

`WORKDIR` では、 コンテナにログインした際のデフォルト・パスを指定している。  
これを指定しないと、毎回ドキュメントルートとは関係ない場所がデフォルト・パスとなってしまい、コンテナに入るたびに最初に cd コマンドで移動しないといけなくなってしまう。

### docker-compose.yml

```yml[docker-compose.yml]
services:
  www:
    build: .
    volumes:
      - ./www/public:/var/www/public
    ports:
      - 80:80
```

`volumes` の部分で、でローカルのパスと、 DocumentRoot のパスを同期させる。

## （余談）Laravel に最適化

以上で終わりだが、 Laravel の場合は、 `public` ディレクトリをドキュメントルートとしながらも `public` と並列に置いてある全てのディレクトリおよびファイル（app/database/resouse/storage など）をコンテナに同期する必要がある。

そのため、 例えば ディレクトリ構成が次のようになっているならば、

```[ディレクトリ構成]
www
┣ app
┣ bootstrap
┣ config
┣ database
┣ public
┣ resources
┣ routes
  ...
```

次のように書くと良い。

```Dockerfile[Dockerfile]
FROM php:8-apache

RUN apt-get -y update \
  && apt-get -y upgrade \
  && apt-get install -y wget \
  
  # ドキュメントルートを変更する
  ENV APACHE_DOCUMENT_ROOT='/var/www/public/'
  RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
  
  # コンテナログイン時のパスを最後に指定
  WORKDIR /var/www
```

```yml[docker-compose.yml]
services:
  www:
    build: .
    volumes:
      - ./www/:/var/www/
    ports:
      - 80:80
```

こうすることで

* DocumentRoot は `/var/www/public`
* コンテナログイン時のデフォルト・パス は `/var/www`
* コンテナに同期されるソースは `/var/www/`

というようになり、コンテナログイン直後にパス移動せず `php artisan` や `composer` コマンドの実行が可能となる。
