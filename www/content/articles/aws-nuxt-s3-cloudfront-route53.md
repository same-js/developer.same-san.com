---
title: 【AWS】CloudFront + S3 + Route53 + NuxtJS で公開する手順
description:
createdAt: 2021-12-10
updatedAt: 2021-12-10
hashtag:
  - AWS
  - CloudFront
  - ACM
  - S3
  - Route53
  - NuxtJS
  - serverless
---

このブログは、次のような技術を利用して開発・運用している。

分類 | 内容
--- | ---
フロントエンド | `Vue` + `NuxtJS` + `Vuetify`
インフラ | `CloudFront` + `S3` + `Route53` + `nuxt generate`
CD | `GitHub Actions`

AWSの公式ドキュメントにも、下記ページにて、これらの技術を利用してサイトを公開する手順は記載されている。
* https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/RoutingToS3Bucket.html

そのため、これを読みながらやれば問題なくできる・・・と思っていたのだが、結構つまずくポイントがあった。

本記事は、その経験を今後の備忘として残しておくものである。

## 余談
この記事は 2021年5〜7月の間に行った作業の備忘であり、当時は CloudFront の設定画面は英語のみであったため、それをベースとした手順としている。しかし、この記事をまとめている 2021年12月現在は、設定画面の大部分が日本語化されてしまっている。時代の流れは速い・・・。


## 全体の流れ
* S3 バケット を作成する
* S3 バケット に `nuxt generate` で生成したコンテンツをアップロードする
* CloudFront Distribution を作成する
  * このタイミングで CloudFront と S3 を疎通させる
* Route53 で好きな 独自ドメイン を購入する
* CloudFront Distribution に Route53で購入した独自ドメイン を設定する
  * このタイミングで ACM にて 独自ドメイン用の SSL証明書を発行
* Route53 で CloudFront Distribution にDNSルーティングを行う

このあとに下記を行い、手動アップロードが不要なフローに変更しているが、これは記事を分けてまとめる。

* GitHub から S3 にデプロイするための CLI ユーザを作成する
* GitHub Actions で自動デプロイできるようにする

### 今回は下記のようにした

これ以降の手順の説明も、下記のバケット名・ドメイン名を使用して行う。
* S3バケットとして `same-san.com` を作成
* origin に `same-san.com` の S3バケットを指定して、CloudFront Distribution を作成
* `same-san.com` の独自ドメインを Route53 上で購入
  * ACM で `same-san.com` 用の SSL証明書を発行

## S3 バケットの作成

下記にアクセスし、 `バケットを作成` をクリックする。

* https://s3.console.aws.amazon.com/s3/home

次の2項目を入力・選択する。

項目名 | 設定値 | 解説
---| --- | ---
`バケット名` | `same-san.com` | 
`AWS リージョン` | `ap-northeast-1` |

その他の設定はデフォルトのままでOK。

今回は CloudFront 経由でのみアクセスさせることから、 `このバケットのブロックパブリックアクセス設定` は `パブリックアクセスをすべて ブロック` にチェックが入っていることを確認する。

## nuxt コンテンツを S3 にアップロード

最終的には GitHub Actions で自動デプロイさせるようにするが、それが完成するまでの間は、次の手順でコンテンツの生成を行い、s3 にアップロードする。

```bash
$ npm run generate
$ cd dist
$ aws s3 sync . s3://BUCKET_NAME/
```


## CloudFront(1) ディストリビューションの作成

下記にアクセスし、 `Create Distribution` >  `Get Started` する。
* https://console.aws.amazon.com/cloudfront/home

この後に記載する全ての設定項目を入力・選択したら、https://console.aws.amazon.com/cloudfront/home にアクセスし、 一覧から 作成したディストリビューションの `Domain Name` を控えておくと良い。
（最終的にこの Domain Name にアクセスして使用して動作確認するため）


### Origin Settings

項目名 | 設定値 | 解説
---| --- | ---
`Origin Domain Name` | `same-san.com.s3.amazonaws.com` | `先に作成したS3バケット名.s3.amazonaws.com` <BR>という選択肢があるはずなので、それをクリックする。
`Origin Path` | （空欄） | S3内の特定のディレクトリをルートディレクトリとしたい場合には、そのパスを記載する。
`Enable Origin Shield` | `No` | 全てのリクエストを中央キャッシュ経由でルーティングし、冗長なオリジンリクエストを統合することで、オリジンの負荷を削減する仕組み。<BR>ただし、効果的な場面は限られる（後述）
`Origin ID` | （※） | `Origin Domain Name` 選択時に 自動で入力される。そのままでよい。
`Restrict Bucket Access` | `Yes` | CloudFront経由以外でS3にアクセスさせたくない場合にはチェックが必要、ということなので、今回は `YES` が正しい。<BR>（私が試した限りでは `YES` にしないと、うまく疎通することができなかった）
`Origin Access Identity` | `Create a New Identity` <BR> または <BR> `Use an Existing Identity` | （`Restrict Bucket Access` で `YES` を選択した場合のみ必須入力）<HR>特別な CloudFront User （オリジンアクセスID） をオリジンに割り当てる必要があるとのこと。<BR>AWSアカウント内で初めてCloudFront ディストリビューションを作成する場合は前者、<BR>すでに作成したことがあったIDが存在している場合は後者を使うと良い。
`Comment` | `access-identity-for-same-san.com` | （`Restrict Bucket Access` で `YES` を選択した場合のみ必須入力）<HR>コメントという名前だが、　`Origin Access Identity` を一意に識別するラベルだと考えた方が良い。<BR>基本的には、自動入力されている値そのままで問題ない。
`Grant Read Permissions on Bucket` | `Yes, Update Bucket Policy` | （`Restrict Bucket Access` で `YES` を選択した場合のみ必須入力）<HR>ここは必ず 左の選択肢を選ぶこと。<BR>ここを間違えると、後で権限不足によるエラーで時間を無駄にする可能性が高い。<BR> `Yes` を選択した場合、ディストリビューション作成時、CloudFront が オリジンアクセスIDに読取アクセス許可を自動的に付与する。<BR>これにより、 CloudFront が S3バケット内のオブジェクトアクセスできるようになる。
`Origin Connection Attempts` | `3` |CloudFront から S3 への接続施行回数。1〜3で指定する。デフォルトは 3。
`Origin Connection Timeout` | `10` | 最大10まで指定可能で、デフォルトも10。
`Origin Custom Headers` | （空欄） |ここで指定した値は、オリジンの全てのリクエストに含まれる。<BR>特に指定する必要がなければ空欄で良い。

<details>
<summary>Enable Origin Shield が効果的な場面について</summary>

次のような場合には有効。

> * 異なる地理的リージョンにビューワーが分散している場合
> * ライブストリーミングまたはオンザフライ画像処理のために、オリジンがジャストインタイムパッケージを提供する場合
> * オンプレミスのオリジンに、容量または帯域幅の制約がある場合
> * ワークロードが複数のコンテンツ配信ネットワーク (CDN) を使用する場合

一方で、次のような場合には適さない。

> * 動的コンテンツがオリジンにプロキシ化される場合
> * コンテンツのキャッシュ可能性が低い安倍
> * コンテンツのリクエスト頻度の低い場合

参考：https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html
</details>

### Default Cache Behavior Settings

項目名 | 設定値 | 解説
---| --- | ---
`Path Pattern` | `Default (*)` | 変更不可
`Viewer Protocol Policy` | `HTTP and HTTPS` | とりえあず仮で。あとで `HTTPS Only` に変更しても良い。
`Allowed HTTP Methods` | `GET, HEAD` | `S3` の場合は `POST` や `DELETE` されるようなプログラムは稼働しないので、<BR>これ以外を選択する必要がない。
`Field-level Encryption Config` | 選択不要（そもそも非活性） | フォームリクエストの暗号化にかかわる項目のため、<BR>`Allowed HTTP Methods` で `GET, HEAD` を選択した場合は、変更の余地がない。
`Cached HTTP Methods` | `GET, HEAD (Cached by default)` | 変更不可。<BR>キャッシュするHTTPメソッドを選択するのだが、`GET, HEAD` はデフォルトで対象となっているため、変更の余地がない。<BR> `Allowed HTTP Methods` で OPTIONS や POST などを選択した場合は、それらを対象とするか選択可能となる。
`Cache and origin request settings` | `Use a cache policy and origin request policy` | キャッシュ動作に関する設定を行う方法の指定。<BR>左記を選択すると、あらかじめ AWS によって定義されたポリシー（※後述）から<BR>選ぶだけで良いため簡単で、AWSもこちらを使うことを推奨している。 <BR>`Use a cache policy and origin request policy` を選択した場合のみ、次の2項目の入力が必要になる。
`Cache Policy` | `Managed-CachingOptimized` | キャッシュキーと キャッシュ内オブジェクト保持期間（TTL） を指定する。<BR>ただし、`Managed-CachingOptimized` を選択すると、一定期間はキャッシュが保持されてしまうため、検証中の間だけは `Managed-CachingDisabled` にしておくほうがやりやすい。<BR>選択肢の詳細については、後述。
`Origin Request Policy` | `Managed-CORS-S3Origin` **（要検証）** | オリジンへのリクエストに含めるヘッダー、 query string、 Cookie を指定する。<BR>私の環境では `Managed-CORS-S3Origin` で一旦動いたのだが、CORS対応が不要であれば、セキュリティ的には最適解ではないはず。<BR>選択肢の詳細については、後述。


<details>
  <summary>
    Cache Policy の選択肢について
  </summary>
  
  * `Managed-CachingOptimized` : 基本的に `s3` ならこれを選んでおけばほぼ問題ない。具体的な設定値は次の通り
    * MinTTL: 1 秒。
    * MaxTTL: 31,536,000 秒 (365日)。
    * DefaultTTL: 86,400 秒 (24時間)。
    * キャッシュキーに含まれるクエリ文字列: なし。
      * 備考： `TTL` = `Time To Live` の略。キャッシュ保持期間。
  * `Managed-CachingDisabled` : キャッシュを無効化する。キャッシュが効くと困る動的コンテンツなどの場合に有効。
  * `Managed-CachingOptimizedForUncompressedObjects` : `Managed-CachingOptimized` とほぼ同じ。 異なるのは、圧縮オブジェクトのキャッシュが無効になるという点 のみ。
  * `Managed-Elemental-MediaPackage`: オリジンが `AWS Elemental MediaPackage エンドポイント` である場合に最適化されている。

  参考： https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
</details>

<details>
  <summary>
    Origin Request Policy の選択肢について
  </summary>

  * `Managed-UserAgentRefererHeaders`
    * User-Agent ヘッダーと Referer ヘッダーのみが含まれる。クエリ文字列や Cookie は含まれない。
      * オリジンリクエストに含まれるクエリ文字列: なし
      * オリジンリクエストに含まれるヘッダー:
        * User-Agent
        * Referer
      * オリジンリクエストに含まれる Cookie: なし
  * `Managed-AllViewer`
    * オリジンリクエストに含まれるクエリ文字列: すべて
    * オリジンリクエストに含まれるヘッダー: ビューワーリクエスト内のすべてのヘッダー
    * オリジンリクエストに含まれる Cookie: すべて
  * `Managed-CORS-S3Origin`: 
    * オリジンが S3 の場合に `Cross-Origin Resource Sharing (CORS) リクエスト` が有効となるように設計されている。
      * オリジンリクエストに含まれるクエリ文字列: なし
      * オリジンリクエストに含まれるヘッダー:
        * Origin
        * Access-Control-Request-Headers
        * Access-Control-Request-Method
      * オリジンリクエストに含まれる Cookie: なし
  * `Managed-CORS-CustomOrigin`
    * オリジンが カスタムオリジン の場合に `Cross-Origin Resource Sharing (CORS) リクエスト` が有効となるように設計されている。
  * `Managed-Elemental-MediaTailor-PersonalizedManifests` 
    * オリジンが `AWS Elemental MediaPackage エンドポイント` である場合に最適化されている。

  参考： https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html
</details>


項目名 | 設定値 | 解説
---| --- | ---
`Smooth Streaming` | `No` | ライブイベントのストリーミングが可能になるが、それを使用しないなら `NO` で良い。
`Restrict Viewer Access (Use Signed URLs or Signed Cookies)` | `No` | コンテンツへのアクセスを特定のユーザに制限をしたい場合かつ、署名付きURL を有効にしたい場合には `YES` にする必要がある。
`Compress Objects Automatically` | `No` | コンテンツリクエスト時、 CloudFront が特定のコンテンツを圧縮するかどうか。<BR>ビューアリクエストの `Accept-Encoding` ヘッダーに追記される。
`Edge Function Associations` | 何も選択しない | CloudFront と S3 の間に処理を実行したい場合に設定する。<BR>（リクエストヘッダやURL、query string のオーバーライドなど）<BR>**Nuxt で Serverside Rendering を有効にする場合、 Endge Function が必要となるが、後から設定するため、一旦は `何も選択肢ない` で問題ない。**
`Enable Real-time Logs` | `No` | `AWS Kinesiss` へ リアルタイムにログを転送（取得）することが可能だが、今回は不要。

### Distribution Settings

項目名 | 設定値 | 解説
---| --- | ---
`Price Class` | `Use All Edge Locations (Best Performance)` | 一旦、これで問題ない。詳細は後ほど記載する。
`AWS WAF Web ACL` | `None` | AWS WAF を使用したい場合には、 ディストリビューションに関連づける ACL を選択する。
`Alternate Domain Names(CNAMEs)` | （空欄） or `same-san.com` | 独自ドメインの設定。<BR>独自ドメインを使用したい場合でも、 一旦は `*.cloudfront.net` で公開し、正しく疎通できたことを確認してから 設定したほうが良い。<BR>（うまく動かない場合に 原因の切り分けが難しくなるため）<BR> ※ CNAME は `example.com` や `google.co.jp` のように、我々が一般的に認知できるドメインの文字列のこと。
`SSL Certificate` | `Default CloudFront Certificate (*.cloudfront.net)` | 独自ドメイン用のSSL証明書を当てるかどうか。後ほど、Route53 で CNAMEレコード を作成してからここに入力する。（ACM で SSL証明書 を発行しておく必要もある）
`Supported HTTP Versions` | `HTTP/2, HTTP/1.1, HTTP/1.0` | セキュリティ的に、他の選択肢を選ぶ余地はない。
`Default Root Object` | （空欄） | `/` にアクセスした場合に、 ここに入力した値、例えば `/index.html` を返すようにしたりできる。<BR>ただし、この項目は、あくまでルートディレクトリへのアクセスの場合しか対応できないため、例えば「全てのディレクトリへのアクセスに一律 index.html を付与してに返したい」というような場合には、この設定で賄うことはできず `CloudFlont Functions` や `Lambda Edge` などを使用する必要がある。
`Standard Logging` | `Off` | `On` を選択すると、 S3バケットにログを配信させることが可能となる。
`Enable IPv6` | `✔︎` | 特に外す理由がない。
`Comment` | `same-san.com spa production` | ディストリビューションの名前や役割などをメモしておくことが可能。<BR>ディストリビューション一覧画面で、何のディストリビューションなのかを識別可能な唯一の情報となるため、必ず何かしら入れておいた方が良い。<BR>何を入力しても、性能や動作に影響は一切ないため、安心して入力可能。
`Distribution State` | `enable` | CloudFront を有効にし、インターネットからのアクセスを受け入れるかどうか。

<details>
  <summary>
    Price Class の説明
  </summary>
  
  * 説明
    * CloudFront は世界中にエッジ・ロケーションがある
    * 各エッジロケーション（リージョン）により、コスト（≒料金）は異なる
    * リージョンごとの価格クラスの分類（これは古い可能性があるため、 https://aws.amazon.com/jp/cloudfront/pricing/ を参照したほうがよい）
      * 標準的なコストのリージョン（米国、カナダ、ヨーロッパ、香港、フィリピン、韓国、台湾、シンガポール、日本、インド、南アフリカ、および中東リージョン）
      * 最もコストの高いリージョン（インド）
      * 最もコストの低いリージョン (米国、カナダ、およびヨーロッパリージョン)
  * 選択肢（参考：https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html）
    * `Use Only U.S., Canada and Europe` ： コストは最も低く抑えられるが、オーストラリア・アジア全域からのアクセスではレイテンシが長く発生する可能性がある
    * `Use U.S., Canada, Europe, Asia, Middle East and Africa` : コストは少し抑えられるが、左に含まれない地域からのアクセスではレイテンシが発生する可能性がある
    * `Use All Edge Locations (Best Performance)` ：全てのリージョンを使用可能だが、コストは高くなる
</details>

ここまで全て完了したら `Create Distribution` をクリックする。  
下記の文言が表示されればOK。

```
CloudFront Private Content Getting Started
Using CloudFront to Serve Private Content
For information about how to restrict access to your private content by using signed URLs or signed cookies, see Serving Private Content through CloudFront  in the Amazon CloudFront Developer Guide.
```
参考：http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html

## CloudFront(2) ディストリビューションの設定変更

NuxtJSで開発したソースをそのままNode.jsサーバで動かす場合（ `npm run dev` によるローカル環境での実行を含む）は 何もしなくても `http://localhost` にアクセスすれば、トップページが表示される。

しかし、 `nuxt generate` したファイルを s3 + CloudFront で動かす場合は、例えば `http://localhost` にアクセスがあった場合、 `http://localhost/index.html` へアクセスさせる、というような設定をディストリビューションに行わないと動作しない。

このようなことが必要になるのは、`nuxt generate` で 生成したソースは `index.html` ファイルとして書き出されるためである。

そして、またややこしい話として、NuxtJS では下記の2種類のレンダリングモードを選択できるのだが、
* `ssr: false` の場合（いわゆる SPAモード）
* `ssr: true` の場合（いわゆる SSRモード）
どちらを選択するかによって、下記のように rewrite target （アクセスさせる先） が異なるため、必要なディストリビューション設定が異なる、ということ。

アクセスURL | rewrite target<BR>（`ssr: false` の場合） | rewrite target<BR>（`ssr: true` の場合）
--- | --- | ---
`/` | `/index.html` | `/index.html`
`/list` | `/index.html` | `/list/index.html`
`/article/how-to-use-nuxt` | `/index.html` | `/article/how-to-use-nuxt/index.html`

今回、SPA、SSRの両方で試し、両方で正常に実行させることができたので、各設定を下記に記載する。

### SPAモードの場合

SPAモード（`ssr: false`）の場合、 必ず ルートに置いてある `/index.html` に アクセスさせなければいけない。  
逆に言えば、 どんなアクセスでも、とりあえず `/index.html` に流しておけば良いということ。

対応方法としては、`index.html` でないパスへのアクセスがあった場合（ `/` や `/list` など）に403エラーが返却されるので、 その 403エラーを catch して `/index.html` を参照するように rewrite する、といったことをするのが手っ取り早い。

#### 具体的な手順

下記にアクセスし、対象のディストリビューションを選択する。

* https://console.aws.amazon.com/cloudfront/home

`Error Pages` タブを開き、 `Create Custom Error Response` をクリックし、 次の通りに入力するだけで良い。

項目名 | 設定値 | 解説
---| --- | ---
`HTTP Error Code` |  `403: Forbidden`
`Error Caching Minimum TTL (seconds)` | 
`Customize Error Response` | `YES`
`Response Page Path` | `/index.html`
`HTTP Response Code` | `200: OK`

もし上で動かない場合、下記の設定も追加すると動く場合がある。

項目名 | 設定値 | 解説
---| --- | ---
`HTTP Error Code` |  `404: Not Found`
`Error Caching Minimum TTL (seconds)` | 
`Customize Error Response` | `YES`
`Response Page Path` | `/index.html`
`HTTP Response Code` | `200: OK`

### SSRの場合

SSRモードの場合、なんでもかんでも ルートにおいてある `/index.html` に返せばいいわけではなく、各ディレクトリごとに設置される `index.html` に流す必要がある。
例えば、 `/article/how-to-use-nuxt` へアクセスされた場合は `article/how-to-use-nuxt/index.html` を返すようにするのが正しい。

そのため、SPAモードのように、エラーが発生したら一律同じものを返す、という簡単な対応では足りない。

これの対応策としては、 CloudFront と S3 の間で処理を実行可能な `Lambda@edge` か `CloudFront Functions` を利用して、s3へのリクエストURLを rewrite するのが良い。

後者の `CloudFront Functions` は、実は 2021年5月にリリースされたばかりの新機能。  
せっかくなので今回はこちらを使う方法を試したので、その手順を下記に記載する。

#### `CloudFront Functions` を利用した具体的な手順

* 下記URLに遷移する。
  * https://console.aws.amazon.com/cloudfront/v3/home?#/functions
* `Create function` をクリックする。
* `Function name` に任意の関数名 (今回は `nuxt-rewrite-url` とした) を入力する。
* `build` タブ > `Development` 内に 下記のコードを入力する。  
  （ 参考：https://github.com/aws-samples/amazon-cloudfront-functions/blob/main/url-rewrite-single-page-apps/index.js ）
```js
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Check whether the URI is missing a file name.
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } 
    // Check whether the URI is missing a file extension.
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
```

`Publish` タブ > `Publish` をクリックする。

`Associate` タブ > で次の通りに選択し、 `Add association` をクリックする。

項目名 | 設定値 | 解説
---| --- | ---
`Distribution` |  作成したディストリビューションを選択
`Event type` | `仮`　| `Managed-CachingDisabled` を設定している場合は `Viewer Request` を選択する 
`Cache behavior` | `Default (*)`

#### （余談）ディストリビューション側から CloudFront Functions を設定する

上の手順では CloudFront Functions の画面から ディストリビューションを紐付けする手順としたが、逆に ディストリビューション側から CloudFront Functions を紐付けることも可能。  
その場合、上の 「`Associate` タブ > で次の通りに選択し、 `Add association` をクリックする。」の部分の代わりに、下記の手順を実行すれば良い。


下記にアクセスし、対象のディストリビューションを選択する。

* https://console.aws.amazon.com/cloudfront/home

`Behaviors` タブを開くと、既存の行がすでに1行あるはずなので、その行にチェックを入れ、 `Edit` をクリックする。  
（ 今回の例だと `Origin or Origin Group` が `S3-same-san.com` となっている行があるはず ）

Edge Function Associations の設定を探し、 次の通りに入力する。

項目名 | 設定値 | 解説
---| --- | ---
`Edge Function` |  `CloudFront Functions`
`CloudFront Event` | `Viewer Request`
`Function ARN/Name` | `nuxt-rewrite-url`

### 動作確認

ここまで完了したら、`CloudFront(1) ディストリビューションの作成` で作成した際に控えていた `Domain Name` に `http://` を付与してアクセスする。

正常に設定できていれば、自分で開発した NuxtJS ソースのトップページが表示されるはず。

## Route53 で CloudFront Distribution にDNSルーティングを行う

次の手順で進める。
* Route53 で 希望のドメインを購入
* ACM で 購入した独自ドメインの ACM証明書 を発行
* CloudFront Distribution Settings で 独自ドメイン設定 & ACM証明書の適用
* Route53 で ルーティング設定

### Route53 で ドメインを購入
下記URLにアクセスし、`ドメインの登録 n ドメイン` (n=数値) をクリックする。
https://console.aws.amazon.com/route53/v2/home#Dashboard

次の画面で、 `ドメインの登録` をクリックする。

あとはテキストボックスに希望のドメインを入力して先の画面へ進んでいけば購入完了までいける。

### ACM でSSL証明書発行

Route53 で購入したドメインの前提。

* `証明書のプロビジョニング` で `今すぐ始める` を選択
* `パブリック証明書のリクエスト` のラジオボタンにチェックを入れ、　`証明書のリクエスト` を選択する
  * 選択肢
    * パブリック証明書のリクエスト
    * プライベート証明書のリクエスト
* `same-san.com` を入力して `次へ` を押す
* `この証明書に別の名前を追加` は一旦スルーでOK
* `検証方法の選択` は、次の選択肢があるが、今回は `DNS の検証` を選択して `次へ` を押す
  * `DNS の検証`
    * 証明書リクエストのドメインの DNS 設定を変更する権限がある場合のみ、選択可能。Route53 や お名前.com で取得 かつ その管理者ログイン情報を持っていれば 取得可能と考えて問題ない
  * `E メールの検証`
* タグを追加 は 何も選択せず `確認`を押す
* 確認画面が表示されるので、問題なければ　`確定とリクエスト` を押す
* `進行中のリクエスト 証明書のリクエストが作成されましたが、その状況は検証保留中になっています。証明書の検証と承認を完了するには、追加のアクションが必要です。` と表示される。
  * `DNS 設定をファイルにエクスポート` をクリックし、 ACM検証用の CNAME設定をダウンロードしておく。
  * （Route53 でドメインを取得している前提であれば）ドメイン名（ `▼ same-san.com` ）をクリックすると、 `Route 53 でのレコードの作成` というボタンが表示されるので、これをクリックする。
  * すると、`以下はドメイン検証のための DNS レコードです。以下の [作成] をクリックして、Route 53 ホストゾーンでレコードを作成します。` と表示される。ホストゾーン（ドメイン名）を確認し、問題なければ `作成` をクリックする。
  * `成功 DNS レコードは Route 53 ホストゾーンに書き込まれました。変更が反映され、AWS がドメインを検証するまでに最大で 30 分かかる場合があります。` と表示されればOK。 
  * ここまで問題なく終わったら、 `続行` をクリック。

### CloudFront Distribution で 独自ドメイン & ACM証明書の選択 

まず、Distribution > General > settings にて `Alternate domain name (CNAME) - optional` に `same-san.com` を入力
Request certificate をクリックすると、下記画面に遷移するので、 そこで `same-san.com` の ACM を取得（手順は後述）
* https://console.aws.amazon.com/acm/home?region=us-east-1#/wizard/

取得が終わったら、元の CloudFront の画面で `Custom SSL certificate - optional` から 先ほど取得した 証明書を選択する（入力項目横の更新ボタンを押すと、リロードしなくても プルダウンに 今作成した証明書が表示されるようになる）

すると次の入力項目が表示されるようになる。

項目名 | 設定値 | 解説
---| --- | ---
`Legacy clients support - $600/month prorated charge applies. Most customers do not need this.` | （空欄） | 特に理由がなければ `Enable`にチェックを入れてはいけない。毎月 $600 請求されてしまう。`SSLv3` または `TLSv1` による通信でなければいけない場合にはチェックが必要となる。
`Security policy` | `TLSv1.2_2021 (recommended)` | 特に理由がないならば、`（recommended）` と記載されているものが最もセキュアである。

### Route53 でルーティング設定

* Route53 にアクセス
  * https://console.aws.amazon.com/route53/v2/home#Home
* n ホストゾーン (n=integer) をクリック（すると次のURLに遷移するはず）
  * samesan.com をクリック

項目名 | 設定値 | 解説
---| --- | ---
`レコード名` | 空欄 | サブドメインを切る場合は、 ここにサブドメイン文字列（ `www` や `daily` など）を入力する。<BR>このブログは `developer` というサブドメインを切っているため、空欄ではなく `develper` を入力している。
`レコードタイプ` | `A` | 同一AWSアカウント内のリソースに向ける場合、 `CNAME` は使用できない点に注意
`値` | `エイリアス` | 
`値` > `トラフィックのルーティング先` | `CloudFront Distribution へのエイリアス` | 
`値` > `ディストリビューション名` | CloudFront Distribution の `Domain name` | `****.cloudfront.net.` のような文字列。<BR>`リソースが見つかりません` と表示されてしまう場合、上記の CloudFront Distribution 側の設定がうまくいっていない可能性があるので、再度確認すること。<BR>※ 作成したばかりや、しばらく寝かせていて `enabled` にしたばかりの ディストリビューションは サジェストに表示されないが、 それでも直接入力して次へ進めばきちんと設定される・・・との情報があったが、自分の環境では再現できなかった。
`TTL (秒)` | - | 
`ルーティングポリシー` | `シンプルルーティング` | 

## 動作確認

ここまで問題なく終わっているならば、購入した独自ドメインのURL へアクセスすれば、問題なく s3 にアップロードしたサイトが表示されるはず。
