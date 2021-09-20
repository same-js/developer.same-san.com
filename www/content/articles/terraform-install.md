---
title: 【Mac】Terraform インストール
description:
createdAt: 2021-09-20
updatedAt: 2021-09-20
hashtag:
  - Terraform
  - tfenv
  - InfrastructureAsCode
---

Terraformのインストール手順の備忘。

## 前提（方針）
* `Homebrew` を利用する
* `Terraform` を直接インストールするのではなく、 `tfenv` （ `Terraform` のバージョン管理マネージャ）を利用してインストールする

## 手順

```bash
$ brew install tfenv
```

インストールが正常に完了しているか確認
```bash
$ tfenv --version
# tfenv 2.2.2
```

インストール可能な `Terraform` のバージョン一覧を確認

```bash
$ tfenv list-remote
# 1.1.0-alpha20210908
# 1.1.0-alpha20210811
# （中略）
# 1.0.7
# 1.0.6
# （中略）
# 1.0.0
# 0.15.5
# 0.15.4
# （中略）
# 0.1.1
# 0.1.0
```

<details>
<summary>
1.x.x と 0.x.x の違いについて
</summary>

2021-09-20現在、大きく `1.x.x`  と `0.x.x` 、つまり `1系` と `0系` の2種類のバージョンがある。  
しかし、[公式アナウンス](https://www.terraform.io/upgrade-guides/1-0.html) によれば
* `1系` は `0系` から続くマイナーアップデートに過ぎない
* `0系` の更新は今後一切手供されない
* `1系` は `0系` との下位互換性も維持している
ことから、あえて `0系` を使う必要はないとのことで、つまり特段の事情がない限りは `1系` を入れておけば問題ないと言える。

</details>

バージョンを指定してインストール

```bash
$ tfenv install 1.0.7
```

インストール済みバージョンの確認  
（現時点ではインストールのみで使用バージョンを選択していないため、 `No default set. Set with 'tfenv use <version>'` と表示される）
```bash
$ tfenv list
#   1.0.7
# No default set. Set with 'tfenv use <version>'
```

使用したいバージョンを選択する
```bash
$ tfenv use 1.0.7
# Switching default version to v1.0.7
# Switching completed
```

もう一度、インストール済みのバージョンを確認する
（先ほど選択したバージョンが正しく反映されていることを確認する）
```bash
$ tfenv list
# * 1.0.7 (set by /usr/local/Cellar/tfenv/2.2.2/version)
```

## 参考
* https://github.com/tfutils/tfenv
* https://www.terraform.io/upgrade-guides/1-0.html
