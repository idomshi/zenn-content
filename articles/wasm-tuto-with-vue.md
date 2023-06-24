---
title: "Vue + ViteでRustのWebAssemblyチュートリアルを動かしたい"
emoji: "🦀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["vue", "vite", "rust", "wasm"]
published: false
---

RustのWebAssemblyチュートリアルには「とりあえずwebpackを使いなさい（意訳）」と書いてあります。しかし私はViteが使いたかったのです。

検索すると``--target web``をつけてwasmファイルをビルドすればwebpack無しで動かせるという記事がいくつも出てきます。たしかに動きました。しかし``memory``にアクセスする方法がイマイチ見つからない……ので、その方法を書きます。

## おおもとのチュートリアルはこちら

[Introduction - Rust and WebAssembly](https://rustwasm.github.io/docs/book/introduction.html)

## Hello, World! まで

元のチュートリアルの4.2. Hello, World!をやっていきます。

Rustのコードはチュートリアル通りに書きます。

### Vue + Viteのプロジェクトを作成する

その後、Putting it into a Web Pageの節でフロントエンド部分を構築するのですが、この時にViteのプロジェクトを作ります。今回は``vue-ts``テンプレートを使用しました。

```sh
npm create vite@latest www -- --template vue-ts
cd www
npm install
```

### wasmのビルドコマンド

さらに、以下のようにオプションを付けてwasmファイルをビルドします。

```sh
wasm-pack build --target web --out-dir www/assets/pkg
```

``--out-dir``はApp.vueから参照できればどこでもいいと思うのですが、www/の中に入れておきましょう。


### vueに読み込む

<!-- script setupの中に読み込む -->

## Implementing Life まで

4.4 Implementing Lifeのセクションの前半、文字でライフゲームを表示するところまでは問題なく進められると思います。

### memoryはどこにあるか

その後``memory``を拾いだすところで、

### 動かしてみる

## まとめ

* RustのWebAssemblyチュートリアルはwebpackを使っているけどViteでやりたい
* WebAssemblyのメモリには``onMounted``の中で``memory = (await init()).memory``とすれば良さそう！
