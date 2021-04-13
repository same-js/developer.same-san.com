---
title: Python3 実行方法
description:
createdAt: 2021-04-13
updatedAt: 2021-04-13
hashtag: 
  - Python
  - Python3
  - CLI
---

Python3 を動かすためには、複数の方法がある。

## とりあえず動かす

とりあえず動かすだけなら、コードを直接書いて実行するだけで良い。

```py
print('Hello, World.')
```

上記ファイルを「01.py」として保存した場合、下記コマンドで実行可能。
```sh
$ python 01.py
# 'Hello, World.'
```

## 関数化して呼び出す

最初に動く関数を `main()` と定義するのが慣習的だが、実は何でもいい。  
関数 を先に定義し、一番最後に関数の呼び出し処理を実装する。

```py
def main(text: str='') -> None:
    end = sub()
    print(text + ' ' + end)

def sub() -> str:
    return 'World.'
    
main(text='Hello,')

```

上記ファイルを「02.py」として保存した場合、下記コマンドで実行可能。
```sh
$ python 02.py
# 'Hello, World.'
```

## クラス化して呼び出す

クラス化して呼び出す場合、クラス内関数の引数には必ず  `self` を定義する必要がある。  
（呼び出し側では `self` を引数として渡す必要はない）

class を先に定義し、一番最後に クラスのインスタンス化 および 関数の呼び出し処理 を実装する。

```py
class MyClass:
    def main(self, text: str='') -> None:
        end = self.sub(subText='World.')
        self.setDelimiter()
        print(text + self.delimiter + end)
    
    def sub(self, subText: str='') -> str:
        return subText
    
    def setDelimiter(self) -> None:
        self.delimiter = ', '

myClass = MyClass()
myClass.main(text='Hello')
```

上記ファイルを「03.py」として保存した場合、下記コマンドで実行可能。
```sh
$ python 03.py
# 'Hello, World.'
```
