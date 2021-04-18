---
title: Bash Curl 使い方
description:
createdAt: 2021-04-18
updatedAt: 2021-04-18
hashtag: 
  - Bash
  - Curl
---

curlコマンドの備忘。

## オプション

オプション | 内容
---  | ---
`--fail` または `-f` | HTTPエラーが発生した場合に、その内容を表示しない。
`--output` または `-o` | 指定したパスに、curlで取得した結果を保存する。
`--silent` または `-s` | curlの進捗を表示しない。
`--show-error` または `-S` | curlの進捗は表示しないが、 エラーメッセージは表示する。<BR>（　`--silent` と併用することが前提 ）

## 取得した内容をファイルに出力

`--output` または `-o` で出力可能・・・だが、これは404などの場合でも出力してしまう。

```bash
curl --silent --output $SAVE_PATH --show-error --fail $URL
```

次の方法のように、HTTPコードが200であることを確認してから出力するほうが安全そう。

```bash
response=$(curl -silent --fail -w "%{http_code}" $URL)
http_code=$(tail -n 1 <<< "$response")  # get the last line
content=$(sed '$ d' <<< "$response")   # get all but the last line which contains the status code

if [ "$http_code" = '200' ]; then
  "$content" > $SAVE_PATH
  printf $SUCCESS_FORMAT "Save completed."
else
  printf $ERROR_FORMAT "Save failed. http_code=[${http_code}]"
fi
```

### 参考
https://www.it-mure.jp.net/ja/shell-script/%E3%82%B7%E3%82%A7%E3%83%AB%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%81%A7curl%E3%81%8B%E3%82%89http%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%89%E3%81%A8%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E3%81%AE%E4%B8%A1%E6%96%B9%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B/962323556/
