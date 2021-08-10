---
title: Laravel Eloquent 個人用チートシート
description:
createdAt: 2021-03-31
updatedAt: 2021-08-11
hashtag:
  - Laravel
  - Eloquent
---

## 前提
自分用なので網羅性は気分次第。

## トランザクション
[公式](https://readouble.com/laravel/6.x/ja/database.html#database-transactions) の推奨は `DB::transaction()` + クロージャ を用いる方法だが、  
個人的には `DB::beginTransaction()` + `try/catch` のほうが小回りが効いて扱いやすいと思う。

```php
use Illuminate\Support\Facades\DB;

(...)

  DB::beginTransaction();
  try {
    $this->model->trancate();
    $this->model->create([
      'name' => $data['name'],
      'email' => $data['email'],
    ]);
    DB::commit();
    } catch (\Exception $e) {
      DB::rollback();
    }
```

`DB::commit()` は明示的に実行しなくても、関数が最後まで終了することでコネクションがクローズされ、コミットされる・・・ような動きをした気がするが、明示しておくに越したことはない。

## SELECT

### 単一カラムだけ取得したい場合
* `pluck()` か `value()` を使用する。
* 取得するレコードが複数ある場合でも、最初の 1件を取得するだけで問題ないなら `value()`
* 取得するレコードが複数ある場合に、全ての結果を取得したい場合は `pluck()`

#### value()
* `value()` だと、戻り値は `object` ではなく `string` となる。 `first()` のカラム単一版だと思うと理解が早い。

```php
$query = $this->model->query();
$result = $query
  ->where('type', 1)
  ->value('name');

gettype($result); // string
echo ($result) // php
```

#### pluck()
* `pluck()` だと、戻り値は `object` となる。

```php
$query = $this->model->query();
$result = $query
  ->where('type', 1)
  ->pluck('name');

gettype($result); // object
echo ($result[0]) // php
echo ($result[1]) // java
echo ($result[2]) // python
```

### 関数を使用したい場合
* select句の中で `DB::raw` を使用し、その中で関数を使用する。

```php
$query = $this->model->query();
$query->select(
  'id',
  DB::raw('round(rate, 2) as rate'),
  'name'
  )
  ->get();
```



## WHERE

### 否定演算子（NOT）
Eloquent では、SQL でいうところの `NOT` 句を作成するメソッドは無いらしい。  
下記のように、入れ子の中で作成した複数の条件をまとめて否定したい場合に、 `NOT` 句が使えると便利なのだが・・・

```sql
select *
from users
where not (`created_at` = 2021-03-31 and `updated_at` = 2021-03-31)
```

### 複数の値による曖昧検索（LIKE IN）

`whereNotIn` という関数は存在するが、これをうまく使用して `LIKE IN` 検索を行うことはできない。  
（そもそも、MySQL 自体が `LIKE` と `IN` を組み合わせた検索に対応していない）

簡単かつ擬似的に対応する方法としては、（泥臭いやり方だが）次のように、 配列を foreach で回し or で結合していく、という方法がある。

```php
$conditions = ['a', 'b', 'c'];
$query = $this->model->query();

$query->where(
  function ($query) use ($conditions) {
    foreach ($conditions as $condition) {
      $query->orWhere('name', 'LIKE', '%' . $condition);
    }
  }
)
```

もう少し綺麗に書く方法として `regexp` を使用するという手段もあるようだが、こちらはまだ検証できていない。

### 入れ子
クロージャー（ `function () use () {}` ）を使う。
```php
$query = $this->model->query();
// クロージャー内で使用するためには変数に代入する必要がある
$from = $this->from;
$to = $this->to;
$query
  ->where('type', 1)
  ->orWhere(
    function ($query) use ($from, $to) {
      return $query
        ->where('created_at' > $from)
        ->where('created_at' < $to);
      }
  );
```

もっと簡潔に書ける方法があれば知りたい。  

<!--more-->
