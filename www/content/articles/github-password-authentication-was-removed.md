---
title: 【GitHub/Mac】Support for password authentication was removed on August 13, 2021. を解決する
description:
createdAt: 2021-08-18
updatedAt: 2021-08-18
hashtag: 
  - GitHub
  - Mac
---

git push しようと思ったら、次のエラーメッセージが表示された。

```bash
$ git push origin main
remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
remote: Please see https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/ for more information.
fatal: unable to access 'https://github.com/same-js/docker-with-php8.git/': The requested URL returned error: 403
```

Web版 GitHub にログインする時に使用する ユーザID・パスワードを利用して、 Gitクライアントツールで GitHub へ push などができないようになった、ということらしい。

## 解決方法

エラーが発生している段階では、次の情報を利用して認証しているはず。
* ユーザネーム
* パスワード

これを、次の情報を利用して認証するように変更すれば良い。
* ユーザネーム
* パーソナルアクセストークン

つまり、パスワードの代わりにパーソナルアクセストークン（PAT）を使用するようにすれば良い、ということである。

## 具体的な手順
### トークン発行
下記にアクセスする。（GitHubに未ログインの場合はログインする）
* https://github.com/settings/tokens

`Generate new token` をクリックする。

次のように入力・設定し、 `Generate token` をクリックする。

入力項目 | 設定値 | 備考
--- | --- | ---
Note | `git operation from local mac` | 何のトークンか自分が判断できる名前をつける
Expiration | `30 days` | 特にこだわりがなければデフォルト値で良い
Select scopes | `repo` | GitHub の clone / pull / push などのみで問題なければ

### Mac の設定を変更
`キーチェーン` アプリを起動する。

`github.com` を探し、ダブルクリックする

`属性` 内 `パスワードを表示` チェックボックス にチェックを入れる（マシン本体のパスワードを聞かれるので入力する）

パスワード入力欄が活性化されるので、ここに先ほど発行した トークン を入力し、`変更内容を保存` をクリックする。

### 動作確認

`git push` が成功すれば、正常に変更完了。

## 参考
* https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/
* https://docs.github.com/ja/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
* https://docs.github.com/ja/github/getting-started-with-github/getting-started-with-git/updating-credentials-from-the-macos-keychain
