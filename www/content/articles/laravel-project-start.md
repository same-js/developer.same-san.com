---
title: Laravel Project 作成後、最初に行う設定
description:
createdAt: 2022-02-13
updatedAt: 2022-02-13
hashtag: 
  - Laravel
---

既存プロジェクトを clone する場合ではなく、 `composer create-project` を使用してプロジェクトを開始する場合に、最初にやっておいたほうが良い設定の備忘。

## タイムゾーン

デフォルトでは `UTC` になっているため、 `Asia/Tokyo` に直す。

`config/app.php` の設定が一番重要で、`make:migration` で生成されるファイルに付与される日時や データベースの Timestamp型に挿入される日時は、ここの設定を正しくしておかないと9時間前の日時になってしまう。

```bash[config/app.php]
    'timezone' => 'Asia/Tokyo', // UTC から変更
```

`config/database.php` にもタイムゾーンの設定がある。しかし、こちらはMySQL側の設定を `UTC` のまま運用する場合にのみ必要なもので、MySQL側を`JST` に修正して運用するならば、むしろやる必要はない。

```php[config/database.php]
        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            (...略...)
            'timezone' => 'Asia/Tokyo', // MySQL側の設定により必要か不要かが異なる
        ],
```

Laravel側 に設定を追加すべきか、それともMySQL側の修正をすべきかについては、インフラでできる設定はなるべくインフラでやるべきか、それともアプリケーションでできる設定はなるべくアプリケーションでやるべきか、どちらの考え方を取るかで決めれば良い。


## 言語

デフォルトではバリデーションエラーのメッセージなどが英語で表示されるようになっているので、これを日本語に変更する。

```bash[config/app.php]
    'locale' => 'ja',

    (...略...)

    'fallback_locale' => 'ja',

    (...略...)

    'faker_locale' => 'ja_JP',
```

* `locale`: アプリケーション全般に影響する
* `fallback_locale`:  `locale` に記載した言語や、処理の中で動的に言語を変える場合に選択した言語が、存在しないものであるならばここで指定した言語が使用される
* `faker_locale`: `Faker` により生成されるダミーデータの氏名や住所の形式に影響する

上記の通り、デフォルトでは `app/config.php` に言語設定がベタ書きとなっている。しかし、多言語対応を前提にするならば、この設定を `.env` 経由で呼び出すように修正して環境ごとに言語を変更できるようにしたり、あえて `en` および `en_US` のままにしておいて ユーザの操作によって動的に切り替えができるように実装したり、ということも視野に入れても良いのかもしれない。
