---
title: Git rebase を使いこなす（過去のコミットメッセージの修正・作業内容の修正）
description:
createdAt: 2021-10-31
updatedAt: 2021-10-31
hashtag:
  - git
---

次の作業を行う必要があり、それを `git rebase` で解決した備忘。

* 2つ以上前のコミットのメッセージを編集する
* 2つ以上前のコミットの作業内容（書いたコード自体）を修正する

## 注意事項

前提として、 `git rebase` （および その変更を反映するために必要となる可能性がある `force push`） は、リポジトリへの不可逆的な破壊行為となることがある。

そのため、業務で `git rebase` を行う必要がある場合、必ず責任者や上長などに その状況を相談の上、許可を取ってから実施することを強く推奨する。  

## 共通の手順

まずは、次のコマンドを実行し、該当のコミットを探す。 `-n 10` の部分は、数値を変更することで、取得するコミットログの件数を変更することが可能。
```bash
$ git log -n 10 --oneline
```

例えば、上記のコマンド実行結果が、次のようなコミット履歴だったとする。

```
$ git log -n 10 --oneline
f29dd48 (HEAD -> main, origin/main) [fix] change the timing of init color-mode to after DOM is rendered
88035c1 [add-article] functional programing of javascript
bf40489 [update-article] add how to search the installed libraries of npm
c7b5ada [add] switch between Darkmode or Lightmode
ef55440 [fix] feed(rss2):url in feed is invalid, so fixed it
157b198 [fix] feed(rss2): remove all angle & square brackets from text in feed
d9d4e83 [fix] feed(rss2): change the `guid` from slug to url
b2c3818 [add-article] What I did when raise error that npm module was not found
eab72a2 [update] use Node.js 16 instead of 14
ff9da5a [add-article] Eloquent: Don't throw Exception if `first()` return `null`
```

このとき、修正したいコミットがあったら、 **その一つ前のコミットの** ハッシュ値を控えておく。

この例で例えば `eab72a2 [update] use Node.js 16 instead of 14` を修正したいならば、必要なのはその1つ前の `ff9da5a`となる。

次に、下記コマンドの `-i` 以降に、先ほど控えたハッシュ値を指定し、実行する。

```bash
$ git rebase -i ff9da5a
```

すると、次のように表示される。

```bash
pick eab72a2 [update] use Node.js 16 instead of 14
pick b2c3818 [add-article] What I did when raise error that npm module was not found
pick d9d4e83 [fix] feed(rss2): change the `guid` from slug to url
pick 157b198 [fix] feed(rss2): remove all angle & square brackets from text in feed
pick ef55440 [fix] feed(rss2):url in feed is invalid, so fixed it
pick c7b5ada [add] switch between Darkmode or Lightmode
pick bf40489 [update-article] add how to search the installed libraries of npm
pick 88035c1 [add-article] functional programing of javascript
pick f29dd48 [fix] change the timing of init color-mode to after DOM is rendered

# Rebase ff9da5a..f29dd48 onto ff9da5a (9 commands)
# （以降、省略）
```


このうち、修正したいコミットの行を、pick から edit に変更し、 `:wq` で保存する。  
今回の例ならば、次のように最初の行を変更すれば良い。

```bash
edit eab72a2 [update] use Node.js 16 instead of 14
pick b2c3818 [add-article] What I did when raise error that npm module was not found
pick d9d4e83 [fix] feed(rss2): change the `guid` from slug to url
pick 157b198 [fix] feed(rss2): remove all angle & square brackets from text in feed
pick ef55440 [fix] feed(rss2):url in feed is invalid, so fixed it
pick c7b5ada [add] switch between Darkmode or Lightmode
pick bf40489 [update-article] add how to search the installed libraries of npm
pick 88035c1 [add-article] functional programing of javascript
pick f29dd48 [fix] change the timing of init color-mode to after DOM is rendered

# Rebase ff9da5a..f29dd48 onto ff9da5a (9 commands)
# （以降、省略）
```

ここまで完了すると、 一時的に rebase状態 となる。

## 修正作業（分岐）

ここから先は、やりたいことによって、若干操作が変わる。

### A. コミットメッセージを変更したい場合

次のコマンドで、正しいコミットメッセージを指定する。

```bash
$ git commit --amend -m "[update] use Node.js 15 instead of 14"
```

↑は、何度でもやり直せるので、もし↑のコマンドで指定するコミットメッセージを誤ってしまったら、再度実行すれば良い。

メッセージが固まったら、次のコマンドを実行して rebase状態を脱却する。

```bash
$ git rebase --continue
# Successfully rebased and updated refs/heads/develop.
```

### B. 作業内容（書いたコード自体）を変更したい場合

元々のコミット内容では、次のように `node-version: '14'` を `node-version: '16'` に変更する作業をしていたとして、

```diff
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2 # npm コンパイル時に node.js が必要
    with:
-     node-version: '14'
+     node-version: '16'
      check-latest: true
  - uses: aws-actions/configure-aws-credentials@v1 # s3 へのコミットに awscli が必要
    with:
```

* これの正しい記述内容を `node-version: '15'` に変更したい
* 記述内容を変更すべきファイルは `.github/workflows/deploy_to_s3.yml` である

という状況である、という場合を想定して説明する。

まず、 手段は問わないので、該当のファイルを編集し、正しい記述内容に修正する。  
（つまり、vim で編集しても良いし、普通に Atom や CotEditor などで編集しても良いということ）

vim の場合は次の方法で。

```bash
$ vim .github/workflows/deploy_to_s3.yml
```

コードを修正したら、その変更を 次の手順で add + commit する。
```bash
$ git add .github/workflows/deploy_to_s3.yml
$ git commit --amend
```

正しい状態のコードでコミットされていることを確認したら、次のコマンドを実行して、rebase 状態を脱却する。

```bash
$ git rebase --continue
Successfully rebased and updated refs/heads/main.
```

## リポジトリへの反映

最後は、普通に push すればOK。

```bash
$ git push origin develop
```

もしコンフリクトが発生した場合は、次のコマンドで 強制push する。  
ただし、これは リポジトリの不可逆的な破壊行為となる可能性があるため、十分に注意した上で、自己責任として行うこと。

```bash
$ git push -f origin develop
```
