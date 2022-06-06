---
title: 【AWS/Lightsail+bitnami】カスタムドメインへリダイレクトさせる
description:
createdAt: 2022-06-06
updatedAt: 2022-06-06
hashtag:
  - AWS
  - Lightsail
  - bitnami
  - Apache
---

EC2やS3とCloudFrontを組み合わせて使う場合、CloudFront Distributionのデフォルトドメインをを隠蔽し、独自ドメインからしかアクセスを許可しないように設定することが可能である。

しかし、Lightsail用のCloudFrontは機能が少なく、このデフォルトドメインを隠蔽することができなそうである。

とはいえ、デフォルトドメインにアクセスされた場合に、そのままのドメインがアドレスバーに表示されたまま閲覧・回遊ができるのも如何なものかと思うので、デフォルトドメインにアクセスされた場合、カスタムドメインにリダイレクトするか、そもそもデフォルトドメインへのアクセスを拒否するか、いずれかとなるようにしておいた方が良い。

今回は、bitnamiを使用する場合、かつ、カスタムドメインにリダイレクトする場合の手順を備忘として残しておく。  
また、インスタンスの静的IPアドレスへの直接アクセスについても対応しておきたいため、ここで同時に対応する。

## まず高機能版のVimを入れる

bitnamiのインスタンスにデフォルトでインストールされているVimは、軽量版で機能が少ない。

軽量版の制限として、クリップボードが使えないというのがあり、このままだと細かい試行錯誤で余計な手間がかかるため、最初に高機能版のVimを入れておく。
```bash[Lightsailインスタンス内で]
$ sudo apt update # パッケージ一覧の更新
$ sudo apt-get install vim-gtk3
$ touch ~/.vimrc
$ echo "set clipboard=unnamedplus" >> ~/.vimrc
```

## httpd.confに追記する

`LoadModule rewrite_module modules/mod_rewrite.so` と記載されている行があるはずのため、これを探す。  
見つかったら、その行以降に、次の内容を追記する。

```apacheconf [/opt/bitnami/apache/conf/httpd.conf]
Define CUSTOM_DOMAIN_NAME "example.com" # 1.リダイレクト先ドメイン
RewriteEngine On
<VirtualHost *:80 *:443>
    ServerName xxxxxxxxxxxxx.cloudfront.net # 2.ディストリビューションのデフォルトドメイン
    RewriteRule ^/(.*) https://${CUSTOM_DOMAIN_NAME}/$1 [R=301,L]
</VirtualHost>

<VirtualHost *:80 *:443>
    ServerName xxx.xxx.xxx.xxx # 3.インスタンスの静的IP
    RewriteRule ^/(.*) https://${CUSTOM_DOMAIN_NAME}/$1 [R=301,L]
</VirtualHost>
```

## Apache再起動

bitnamiはApacheの起動・停止・起動のコマンドが若干異なる点に注意。

```bash[Lightsailインスタンス内で]
sudo apachectl configtest
sudo /opt/bitnami/ctlscript.sh restart apache
```

## 参考
* https://zenn.dev/kaorumori/articles/e333f9b896a267
* https://weblabo.oscasierra.net/apache-rewritecond-base/
* https://www.javadrive.jp/apache/htaccess/index6.html
* https://docs.bitnami.com/aws/faq/administration/control-services/
