---
title: Laravel Clone後にやること
description:
createdAt: 2021-04-19
updatedAt: 2021-04-19
hashtag: 
  - Laravel
---

## .env

.env 自体は原則、git管理対象外。  
`.env.docker` や `.env.local` という名前でローカル環境用の .env ファイルがあるはずなので、これを探して `.env` という名前でコピーする。

```sh
$ cp .env.docker .env
```

## composer 

vendor 配下も git管理対象外なので、 composer を使って取得する。

```sh
$ composer install
```

## データベース

データベースにテーブルを作成する。

```sh
$ php artisan migrate
```

下記コマンドで 初期データ生成までの実行が必要な場合もある。

```sh
$ php artisan db:seed
```

## 暗号化キー

```sh
$ php artisan key:generate
```
