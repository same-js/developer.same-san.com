---
title: 複数のGitリポジトリを、履歴を保持したまま統合する
description:
createdAt: 2021-05-26
updatedAt: 2021-05-26
hashtag:
  - git
---



## ゴール

* 次の2つのリポジトリを統合する（両方のコミット履歴を残す）
  * `https://github.com/xxx/repo_a.git`
  * `https://github.com/xxx/repo_b.git`
* 統合後のリポジトリは `https://github.com/xxx/repo_multi.git` とする


つまり、ディレクトリ構成図にすると、下記の通りとなるようにする

```
repo_multi
┣ .git
┣ a_dir <- ここに https://github.com/xxx/repo_a.git の中身を入れる
┗ b_dir <- ここに https://github.com/xxx/repo_b.git の中身を入れる
```

## 手順

```bash
$ mkdir repo_multi
$ cd repo_multi
$ git init
$ mkdir -p a_dir && touch a_dir/.gitkeep
$ mkdir -p b_dir && touch b_dir/.gitkeep
$ git add --all
$ git commit -m "clean:各リポジトリを置くディレクトリを作成"
$ git remote add -f sub1 https://github.com/xxx/repo_a.git
$ git merge --allow-unrelated-histories -X subtree=a_dir/ sub1/main

$ git remote add -f sub2 https://github.com/xxx/repo_b.git
$ git merge --allow-unrelated-histories -X subtree=b_dir/ sub2/master
```
