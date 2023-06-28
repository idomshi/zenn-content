---
title: "RustのWebAssemblyチュートリアルをVue + Viteで動かしたい"
emoji: "🏁"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["vue", "vite", "rust", "wasm"]
published: false
---

RustのWebAssemblyチュートリアルをVue.jsとViteで動かすときに、wasmの``memory``オブジェクトの取得方法が分からなくて迷ったので、そのやり方について書きます。

RustのWebAssemblyチュートリアルには「とりあえずwebpackを使いなさい（意訳）」と書いてあります。しかし私はViteが使いたかったのです。

検索すると``--target web``をつけてwasmファイルをビルドすればwebpack無しで動かせるという記事がいくつも出てきます。たしかに動きました。しかし``memory``（WebAssemblyの線形メモリ）にアクセスする方法がイマイチ見つからない……ので、その方法を書きます。

## おおもとのチュートリアルはこちら

この記事では以下のチュートリアルの4.4. Implementing Lifeまで（ライフゲームが動くことを確認するところまで）やります。

https://rustwasm.github.io/docs/book/introduction.html

## Implementing Lifeのコーディング



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

### memoryはどこにあるか

4.4. Implementing Lifeのセクションの後半では``memory``をimportしています。しかし同じように``import { memory } from "./assets/wasm-game-of-life/wasm_game_of_life_bg";``としても動きません。

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

<!--  -->
4.4. Implementing Lifeまで完了したコード（App.vue）はこちらです。
もとのチュートリアルから変更した点について解説します。
* フロントエンドのプロジェクトはwww/に作成する
* wasmのビルドコマンドを変える
* init()の返り値からmemoryオブジェクトを拾う
* 動かしてみる
では実際に``npm run dev``して、ブラウザでアクセスしてみます。すると……。

<!-- 動いた画像を貼り付ける -->

動きました！

