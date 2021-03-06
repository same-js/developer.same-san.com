---
title: 【Mac】Vivaldi使用時のスクロール方向の設定（マウス・トラックパッド）
description:
createdAt: 2021-12-26
updatedAt: 2021-12-26
hashtag:
  - Mac
---

個人的なMacの設定の備忘。

## Scroll Reverserの設定

前提として、 `ver 1.8.1` 以上を使用していること。  
こちらは、マウス・トラックパッドどちらを使用する場合であっても、設定は完全に同じ。
<ArticleImage src="mac-scroll-settings/scroll-reverser-settings.png" alt="失敗時"></ArticleImage>

## Mac本体の設定
マウス使用時か、トラックパッド使用時かで、Mac設定 > トラックパッド の `スクロールの方向：ナチュラル` にチェックの有無を切り替える。

<ArticleImage src="mac-scroll-settings/mac-trackpad-settings.png"></ArticleImage>

### マウス使用時

Mac設定 > トラックパッド の `スクロールの方向：ナチュラル` のチェックを外す

### トラックパッド使用時

Mac設定 > トラックパッド の `スクロールの方向：ナチュラル` のチェックを入れる

## なぜこのような設定なのかという説明

理想は、あらかじめ好みのスクロール方向を設定をしておき、Mac本体のトラックパッド・外部マウスどちらを使用する場合であっても、設定変更を経ずに使用できることである。しかし、Vivaldi を使用する場合、どうやってもマウス・トラックパッド使用時で完全に同じスクロール方向を実現することはできない。

というのも、Vivaldiのタブのスクロールの方向だけは、いかなる設定にしたとしても、マウス・トラックパッド使用時で必ず逆になってしまう。厳密に言うと、これを揃えること自体は可能なのだが、そうすると、今度はそれ以外の場所におけるスクロール方向がマウス・トラックパッド使用時で逆になってしまう。これは結構色々な手段を試したのだが、解決できる方法がなかった。

つまり、トラックパッド・マウス使用時で完全に同じスクロール方向の操作感を得たいならば、どちらを使うかを切り替えるタイミングで必ず設定変更も経なければいけない。

結局、その設定変更が必要ということ自体は仕方のない作業ということで、受け入れることにした。しかし、その設定変更の手数は最小限にしたい、できるならば、ボタン1つで切り替えられるのが理想である・・・ということで、色々試行錯誤した結果が、この記事の手順ということである。