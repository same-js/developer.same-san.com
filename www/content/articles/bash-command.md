---
title: Bash 基本コマンド
description:
createdAt: 2021-04-18
updatedAt: 2021-04-18
hashtag: 
  - Bash
---

MacやLinuxのバッチを作る時に重宝するbash。  
よく使うものをまとめておく。

## 比較

構文
```bash
if [ 条件 ];
then
  実行内容
elif [ 条件 ];
then
  実行内容
else
  実行内容
fi
```

`if` の後ろと、 `[]` の内側に1つずつ半角スペースが必要な点に注意。

### 比較演算子（文字）

文字列を比較する場合、 `=` を使用する。

```bash
if [ "$1" = "TEST" ];
then
  echo "アップグレードを開始します。"
fi
```

### 比較演算子（数値）

数値を比較する場合は、 `=` ではなく、 '-eq' を使用する。

```bash
if [ "$1" = 100 ];
then
  echo "100です。"
fi
```

文字列の比較で `-eq` を使用すると、下記エラーが発生する。
```
[: TEST: integer expression expected
```

### 比較時に変数を `""` で囲う理由

変数が空の場合、下記エラーが発生するため。

```
[: =: unary operator expected
```
## 変数宣言

構文
```
変数名=値
```

例
```bash
TEST_STR="テスト文字列"
```

## 定数

`readonly` を付与する。

```bash
readonly TEST_STR="テスト文字列"
```

## echo

```bash
echo 文字列
```

### 変数の改行コードを改行として出力したい場合

変数は、 `""` で囲わないと、変数内の改行コードが出力に反映されない。

```bash
echo "$TEST"
```
