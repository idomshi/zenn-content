---
title: "Vue + ViteでRustのWebAssemblyチュートリアルを動かしたい"
emoji: "🏁"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["vue", "vite", "rust", "wasm"]
published: false
---

RustのWebAssemblyチュートリアルには「とりあえずwebpackを使いなさい（意訳）」と書いてあります。しかし私はViteが使いたかったのです。

検索すると``--target web``をつけてwasmファイルをビルドすればwebpack無しで動かせるという記事がいくつも出てきます。たしかに動きました。しかし``memory``（WebAssemblyの線形メモリ）にアクセスする方法がイマイチ見つからない……ので、その方法を書きます。

## おおもとのチュートリアルはこちら

この記事では以下のチュートリアルの4.4. Implementing Lifeまで（ライフゲームが動くことを確認するところまで）やります。以降は私がまだこなしてないので……。

https://rustwasm.github.io/docs/book/introduction.html

## Hello, World! まで

元のチュートリアルの4.2. Hello, World!をやっていきます。Rustのコードはチュートリアル通りです。

### Vue + Viteのプロジェクトを作成する

その後、Putting it into a Web Pageの節でフロントエンド部分を構築するのですが、この時にViteのプロジェクトを作ります。今回は``vue-ts``テンプレートを使用しました。

```sh
npm create vite@latest www -- --template vue-ts
```

### wasmのビルドコマンド

webpackを使わないので、wasmのビルドには``--target web``の指定が必要です。また、必須ではありませんが、出力ディレクトリも変更します。

```sh
wasm-pack build --target web --out-dir www/assets/pkg
```

### vueに読み込む

<!-- script setupの中に読み込む -->
App.vueのコードをこんな感じに書くと無事にalertを呼べます。
```ts:App.vue
// App.vueでalertを表示するコードを貼り付ける。
```

## Implementing Life まで

続けて4.4 Implementing Lifeのセクションの前半までチュートリアルを進めます。文字でライフゲームを表示するところまでは問題なく作ることができました。

<!-- App.vueのコードを貼り付ける -->
```ts:App.vue
// App.vueでテキスト形式のlife gameを実行するコードを貼り付ける。
```

### memoryはどこにあるか

4.4.の後半では``memory``をimportしています。しかし同じように``import { memory } from "./assets/wasm-game-of-life/wasm_game_of_life_bg";``としても動きません。

そこで、今までimportしたものの型情報をよく見ると、``init``が何か返しています。これを変数で受け取ってみましょう。``script setup``の中に直接``await``を書くと動かないので、``onMounted``に書きます。

……``memory``がありますね。たぶん探していたものはこれだと思います。App.vueを書き直します。

```ts:App.vue
// 最終的なApp.vueを貼り付ける。
```

すると……。

<!-- 動いた画像を貼り付ける -->

動きました！

## まとめ

* RustのWebAssemblyチュートリアルはwebpackを使っているけどVue + Viteでやりたい
* WebAssemblyの``memory``オブジェクトを取得するには``onMounted``の中で``memory = (await init()).memory``とすれば良さそう！
