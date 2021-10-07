---
title: 【Laravel/Eloquent】 first() の戻り値で必ずModelを返す
description:
createdAt: 2021-10-08
updatedAt: 2021-10-08
hashtag:
  - PHP
  - Laravel
  - Eloquent
---

Laravel Eloquent で `first()` 関数を使用する場合、データが存在する場合はそのModelのクラスを返却するが、データが存在しない場合は空のModelを返却・・・するわけではなく、 `null` を返却してしまう。

データが存在しない場合でも `null` ではなく Modelを返却したい場合は、下記のようにすれば良い。

```php
public function handle()
{
    $email = $this->argument('email');
    $user = $this->getUser(email: $email);
    echo $user->name . "\n";
}

public function getUser(string $email): User
{
    $result = User::select()
        ->where('email', 'LIKE', "%{$email}%")
        ->first();
    return $result ?? new User; // ここが重要
}
```

## 余談（nullが返ると困る場合）

`$user->email` のようにプロパティにアクセスする実装をしている場合、もし `$user` が `null` ならば次のエラーが発生してしまう。
```
ErrorException  : Attempt to read property "name" on null
```

しかし、上の実装ならば、必ず `User` model が返却され、`$user->email` のようにアクセスしてもエラーとなずに済む。（ただし、取得できる値は `null` である）
