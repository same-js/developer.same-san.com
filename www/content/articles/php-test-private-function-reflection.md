---
title: 【PHP】private関数 や protected関数 をクラス外から呼び出す
description:
createdAt: 2021-08-21
updatedAt: 2021-08-21
hashtag: 
  - PHP
  - テスト
---
private関数 や protected関数 は、原則クラス外から呼び出すことはできないが、`ReflectionClass` を使用することで、クラス外から呼び出し可能となる。

## 実装例

```php
class Test {
    private function makeSentence (string $name, string $job) {
        return "My name is {$name}. I am a {$job}.";
    }
}
$testClass = new Test();
$reflectionClass = new ReflectionClass($testClass);
$makeSentence = $reflectionClass->getMethod('makeSentence');
$makeSentence->setAccessible(true);

$name = 'same.js';
$job = 'programmer';
echo $makeSentence->invoke($testClass, $name, $job);
```

## 参考
* https://www.php.net/manual/ja/class.reflectionclass.php
* https://www.php.net/manual/ja/class.reflectionmethod.php
