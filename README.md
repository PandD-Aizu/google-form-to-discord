[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

# google-form-to-discord
Google Form の内容を Discord のチャンネルに投稿する

## ディレクトリ構造
以下のようになっています

```
.
├── LICENSE
├── README.md
├── project-A
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── appsscript.json
│       └── ここに project-A のソースコード達
└── project-B
    ├── package-lock.json
    ├── package.json
    └── src
        ├── appsscript.json
        └── ここに project-B のソースコード達
```

プロジェクトごとに package.json があり、使用ツールはプロジェクトごとに異なっても問題ありません


## 使用ツール

temp-entrance2022(仮入部フォーム)やquestion-form2022(質問箱)では以下のツールを使用しています

- [clasp](https://github.com/google/clasp)
- [types/google-apps-script](https://www.npmjs.com/package/@types/google-apps-script)


### clasp を使用する際の使い方
Google Formの投稿をDiscordのチャンネルに横流しする場合の参考サイトや手順を以下に載せます

#### 参考サイト
基本的には以下のサイトが参考になります

- [claspを使ってGoogle Apps Scriptの開発環境を構築してみた](https://dev.classmethod.jp/articles/vscode-clasp-setting/)

- [Googleフォームで投函した内容を Discord に横流しする](https://zenn.dev/akaregi/articles/2e8963e6fd9c50)

- [【GAS】コードにAPIトークンやIDのベタ書きを避ける（プロパティサービスの活用）](https://qiita.com/massa-potato/items/2209ff367d65c5dd6181)

- [Google FormsとDiscordでApex中毒の弟の勉強を監視する](https://qiita.com/Papillon6814/items/afcc3a61f5d827908266)


#### 既存プロジェクトと同じツールの場合
ここからはtemp-entrance2022と同じツールを使用する場合の手順を記述します

##### 環境構築

以下のコマンドで出てくる `新しいプロジェクト名` の部分は置き換えてください

```bash
# 現在 LISENCE や README.md などと同じディレクトリにいる状態で実行
$ mkdir 新しいプロジェクト名

# 中身をコピー
$ cp -r temp-entrance2022/* 新しいプロジェクト名

# 移動
$ cd question-form2022

# 依存関係をインストール
$ npm i

# Google Apps Scirpt プロジェクトを作る
# id の部分は使用するGoogle FormのURLにある部分
# https://docs.google.com/forms/d/{id}/edit
$ npx clasp create --parentId "ここにid"

# すでに src/ にコピーした appsscript.json があるので新しく作られたのは消す
$ rm appsscript.json

# ローカル環境でログイン
$ npx clasp login --no-localhost
```

ここまでで、環境構築はあらかた終了です


##### Webhook URLをプロパティに入れる

次にブラウザで https://script.google.com/home を開き、新しく作成したプロジェクトに WEBHOOK_URL のプロパティを追加します

1. エディタを開き、クラシックエディタに変更する。（したい設定がクラシックエディタからしかできない）

2. クラシックエディタにしたら、「ファイル」→「プロジェクトのプロパティ」→「スクリプトのプロパティ」でプロパティを設定する（環境変数のようなもの）

3. ここで、DiscordのチャンネルのWebHook URLを値としていれる


##### 関数を書く

[Googleフォームで投函した内容を Discord に横流しする](https://zenn.dev/akaregi/articles/2e8963e6fd9c50) が参考になります

注意点として、DiscordにBotからメッセージを送るということは `:pray:` みたいなのが書かれているとそのままパースされてしまうので若干の注意は必要です（ただしく表示させたいのであればマークダウン記法をエスケープみたいなことをする必要あり？）

##### トリガーを設定する

[Google FormsとDiscordでApex中毒の弟の勉強を監視する](https://qiita.com/Papillon6814/items/afcc3a61f5d827908266) が参考になります


#### テストする
試しにGoogle Formから送ってみて動いていれば成功です

関数ごとに動きを確かめたい場合は Google Apps Script のエディタなどから動作を確かめることができます(clasp からでもできるっぽい？)

もし、Google Apps Script の動きを見たかったら、ブラウザエディタの左側にあるアイコンの「実行数」から見ることができます

#### その他
プロジェクトを管理する際の注意点です

- **parentId は後から変更できない**  
  .clasp.json に `parentId` の値が文字列配列で書かれますが、その値を変更して `clasp push` しても変化はありません  
  実際に.clasp.jsonから `parentId` の値を空配列にして `clasp push` してもエラーが出されませんでした(`clasp --version` をして出たバージョンは2.4.1)

- **TypeScript を使用するかは要相談**  
  TypeScript を使用してコードを書いたとしても、.gsファイルに変換されるときに日本語などがおかしくなる場合があります(実際にバッククオートで日本語を囲った文字列は文字化けしてしまいました)
