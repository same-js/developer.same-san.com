---
title: AWSCLI s3 個人用チートシート
description:
createdAt: 2021-04-06
updatedAt: 2021-04-06
hashtag:
  - AWS
  - AWSCLI
  - s3
---

## プロファイルの指定

```
aws --profile myapp s3 ls
```
`--profile myapp` で、プロファイル `myapp` を指定して実行する。  
`--profile`を使用する場合は、 `aws` の直後に書くとよい。


## アップロード（同期）

### 一般公開の権限でファイルをアップロードする場合

`--acl public-read` を付与すれば良い。

```
aws s3 sync . s3://BUCKET_NAME/directory_name --acl public-read
```

S3バケット側で `パブリックアクセス設定` が正常に設定されていない場合は、これを付与するとエラーになるため、注意。

### アップロード元に存在しないファイルは削除する場合

`--delete` を付与すれば良い。

```
aws s3 sync . s3://BUCKET_NAME/directory_name --delete
```

## 一覧表示・参照

### s3オブジェクトの一覧表示
https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-services-s3-commands.html#using-s3-commands-listing-buckets

```
aws --profile myapp s3 ls
```
`--profile myapp` で、プロファイル `myapp` を指定して実行する。
`--profile`を使用する場合は、 `aws` の直後に書くとよい。

### 特定のディレクトリの全オブジェクトと、合計オブジェクト数の表示
```
aws s3 ls s3://BUCKET_NAME/directory_name/ --sum
```

コンソールに大量に表示されるのが嫌な場合は、ファイルに書き出してしまうとよい。
```
aws s3 ls s3://BUCKET_NAME/directory_name/ --sum > s3_file_list.txt
```

これだと、全ファイルの一覧が表示されるので、合計オブジェクト数だけ1行で確認したい場合は、下記が便利
```
aws s3 ls s3://BUCKET_NAME/directory_name/ --sum | grep "Total Objects"
```

## ファイル名の一括変更
命名規則に従って、バケット内にあるファイル名を一律で変更したい場合、どのようにするのが良いか、という話。

例えば、バケット内に下記のようなファイルがある場合
```
test1.jpg
test2.jpg
test3.jpg
```
下記のように2桁となるようにゼロ・パディングを行うとする。
```
test01.jpg
test02.jpg
test03.jpg
```

3ファイル程度なら、コンソール上から手動で変更すれば問題ないが、これが数百ファイル以上ある場合は、手動で行うのはしんどい。

結論から言うと、awscli側でそのような操作に特化したコマンドは提供されていないため、  
現実的な方法としては下記のようにやるしかないと思っている。
* ローカル環境でファイル名を変更
* `sync` コマンドで同期（つまり、変更されるファイルは全部再アップロード）

```
aws s3 sync . s3://BUCKET_NAME/directory_name --delete
```

アップロードし直しになるため、変更ファイル数に応じて膨大な時間がかかることが予想される。  
なるべくこのような操作が必要にならないように、あらかじめファイル名は確定させた上でアップロードすることを心がけた方が良い。
