---
title: "ジト目のロゴが可愛いJitoでxeyesを作ってみた"
emoji: "👀"
type: "tech"
topics: ["jito", "vite", "typescript"]
published: false
---

## 要約

- Jitoというジト目のロゴが可愛いWebコンポーネントライブラリで遊びました
- Vite + TypeScriptで開発しました
- xeyesを作ってみました
- Jitoなのにできたものがジト目じゃない……（これが言いたかっただけ）

## はじめに

JitoというWebコンポーネントライブラリが気になっていたので試しにxeyesを作ってみました。xeyesはマウスカーソルを目線で追いかけてくるアプリケーションです。今回はブラウザ上に表示するウェブアプリを作成します。

https://zenn.dev/itte/books/5ce6aac9166aed

## バージョンなど

今回使ったライブラリのバージョンは次の通りです。

- Node.js: 16.13.0
- typescript: 4.9.3
- vite: 4.2.0
- jito: 1.1.1

## プロジェクトの作成

今回はViteを使ってTypeScriptで作成します。vanilla-tsのテンプレートでプロジェクトフォルダを初期化し、Jitoもインストールしてしまいましょう。

```powershell
npm create vite@latest jito-eyes -- --template vanilla-ts
cd jito-eyes
npm install
npm install jito
npm run dev
```

これでファイルが自動リロードされるようになるので、気持ちよく開発できますね。

main.tsを次のように書き換えて、Jitoがインストール出来ていることを確認します。

```ts:main.ts
import {mount, compact } from 'jito'

const component = compact(`<strong>hello</strong>`)
mount('#app', component)
```

## xeyesの作成

早速ですが完成したコード全体は次のリポジトリで確認してください。以下ではポイントをいくつか紹介します。

https://github.com/idomshi/jito-eyes

### 子コンポーネントの作成と呼び出し

ルート要素の中で呼び出す子コンポーネントは ``compact`` 関数で作成します。今回はコンポーネントごとに別ファイルにしているので、``compact`` 関数の返り値を ``export`` しています。

```ts:JitoEyes.ts
// この要素をmain.tsでimportしてcompactに渡す。
export const JitoEyes = compact(
  `
<!-- （略） -->
<div id="jitoeyes">
  <jito-eye />
  <jito-eye />
</div>`,
  main,
);
```

main.ts内で作成しているのがアプリのルートになるコンポーネントです。 子コンポーネントは ``main`` 関数で ``return`` すると使えるようになります。

最後に ``mount`` 関数でindex.htmlのdiv#app要素の下にマウントします。

```ts:main.ts
import { JitoEye } from "./JitoEye";

const main: Main = () => {
  return [
    {
      // ここに書くと子コンポーネントが使えるようになる。
      "jito-eye": JitoEye,
    },
  ];
};

const component = compact(
  `
<div id="id">
  <jito-eyes style="position: absolute;top: 250px; left: 80px;" />
  <jito-eyes style="position: absolute;top: 30px; left: 640px;" />
</div>`,
  main,
);

// div#appにマウントする
mount("#app", component);
```


### 要素の大きさを取得する

JitoEyeは片目を表現するコンポーネントです。 この中では座標計算のために自身の要素サイズを取得したいので、初期化関数の引数でrootを受け取って、自コンポーネントの要素にアクセスします。

また、テンプレートに ``root`` タグを追加するとコンポーネントルートのイベントを購読できるようです。イベントハンドラは ``main`` 関数の中に書きます。

```ts:JitoEye.ts
const main: Main = ({ root }) => {
  const state = watch<{
    elo: HTMLElement | null;
    eli: HTMLElement | null;
    left: number;
    top: number;
    border: number;
  }>({
    elo: null,
    eli: null,
    left: 0,
    top: 0,
    border: 10,
  });

  const patched = () => {
    state.elo = root.getElementById("outer");
    state.eli = root.getElementById("inner");
    const recto = state.elo?.getBoundingClientRect();
    const recti = state.eli?.getBoundingClientRect();
    if (recto === undefined) return;
    if (recti === undefined) return;
    state.left = recto.width / 2 - recti.width / 2 - state.border;
    state.top = recto.height / 2 - recti.height / 2 - state.border;
  };
};

export const JitoEye = compact(
  `
<!-- （略） -->
<root onpatch="patched(event)" @if="!elo" />
<div id="outer" class="outer">
<div id="inner" class="inner"></div>
</div>`,
  main,
);
```

### マウス座標を取得する

ウェブアプリのページ上では、マウスカーソルがどこにいても座標を取得したいので、JitoEyeコンポーネントのテンプレートに ``window`` タグを追加して、``pointermove`` イベントを購読します。こちらもイベントハンドラを ``main`` 関数のなかで定義します。

```ts:JitoEye.ts
const main: Main = ({ root }) => {

  const onMove = (ev: PointerEvent) => {
    // ev.clientX, ev.clientYでマウス座標が拾える。
  };
  return [
    state,
    {
      onMove,
    },
  ];
};

export const JitoEye = compact(
  `
<window onpointermove="onMove(event)" />
<div id="outer" class="outer">
<div id="inner" class="inner"></div>
</div>`,
  main,
);
```

マウスの位置によって黒目の座標を計算します。数式はちょっと自信ないです。

### 目玉の形状について

作る前は、目玉の形状はSVGで描こうと思っていたんですが、なぜかSVGが表示されませんでした。デベロッパーツールで確認すればページ上にSVG要素は見えるのですが、サイズが0×0という状態で……。

これが私のコードのせいなのか、それともJitoやShadow DOMなどの仕様なのか、ほかの原因か判断できず、今回はdiv要素で作成することになりました。CSSを書いてそれっぽく見えるようにします。

## おわりに

ジト目のロゴだというだけで気になっていたJitoで遊んでみました。

Shadow DOMを使っているJitoはコンポーネント外からのCSSなどの干渉防げるのがメリットなので、ひとつのウェブアプリ全体をJitoで作るのはあんまり想定されていないのかもしれないですね。うまい感じにモジュールとして公開する開発ワークフローを考えようかな？

そして、公式のドキュメントは昨日（2023/04/15）付で完成したようです。この記事を書き始めた時は執筆中になっていたので、あとでもう一度読み直さなければ。