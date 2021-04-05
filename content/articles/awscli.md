---
title: AWSCLI インストール手順
description:
createdAt: 2021-04-06
updatedAt: 2021-04-06
hashtag:
  - AWS
  - AWSCLI
---


# awscli インストールから設定まで
## awscli のインストール
まず、インストール済みか確認する。  
バージョン名が表示されれば、cliはインストール済。
```
aws --version
```

### インストール済みでない場合
Mac の場合は pkgファイルから簡単にインストールできる。下記を参考に進めると良い。
* https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-mac.html

## プロファイル設定
初めて使用する場合は、下記コマンドで、設定ファイルを生成する。
```
mkdir ~/.aws
touch ~/.aws/config
touch ~/.aws/credentials
```

ファイルを生成したら、各ファイルを開き、config と credentials にそれぞれ設定を記載する。
以後、設定状態が分からなくなった場合も、これらのファイルを開けば良い。
```
vim ~/.aws/config
vim ~/.aws/credentials
```

### config の書き方
```
[default]
region = ap-northeast-1
output = json

[profile myapp]
region = ap-northeast-1
output = json

[profile myblog]
region = ap-northeast-1
output = json
```

Config の場合は、 default 以外のプロファイルには 先頭に `profile` の文字列を付与する必要がある点に注意
### credentials の書き方
```
[default]
aws_access_key_id = EXAMPLETBN2CVQ5M9J
aws_secret_access_key = EXAMPLE3VN509W3BVAWSAWWWER

[myapp]
aws_access_key_id =
aws_secret_access_key =

[myblog]
aws_access_key_id =
aws_secret_access_key =
```

Credentials の場合は、 `profile` の文字列は不要

#### `aws_access_key_id ` と `aws_secret_access_key `が無い場合
これらの情報は、 `AWS` の `IAM` で ユーザを作成することで、 CLI用のキーを発行できる。  
ロールではないため、注意。  
（ロールは、EC2などのAWSのサービス自体に権限を割り与える際に作成するもの。）
