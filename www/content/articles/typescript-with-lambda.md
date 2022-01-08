---
title: TypeScript で Lambda Function を作成する
description:
createdAt: 2022-01-08
updatedAt: 2022-01-08
hashtag: 
  - ServerlessFramework
  - TypeScript
  - serverless
  - Lambda
---

自分用の備忘。

## プロジェクトの作成

まずは Serverless Frameworkがインストールされているか確認し、されていないようであればインストールする。
```bash
$ npm ls -g serverless # インストールされているか確認
$ npm install -g serverless # インストール
```

TypeScript用のテンプレートを指定し、プロジェクトを作成する。
下記はどちらも同じ結果になるので、好きなほうを使用すれば良い。
```bash
$ sls create -t aws-nodejs-typescript -p app
$ serverless create --template aws-nodejs-typescript --path app
```

npmライブラリをインストールする。

```bash
$ cd app
$ npm install
```

## とりあえず実行

Serverless Framework で作成したプログラムを `sls invoke local` コマンドを利用して実行してみる場合、そのままこのコマンドを実行しても動かない。

とりあえず動きさえすれば良いという場合は、 `app/src/functions/hello/handler.ts` の `${event.body.name}` を削除すれば良い。（ただし、おそらくこれは正しい方法ではない）

```ts
const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
}
```

```bash
$ sls invoke local -f hello
```

このようなことがあるのは、TypeScript用テンプレートは API GateWay を利用する前提になっているためだと思われる。