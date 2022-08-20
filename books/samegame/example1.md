---
title: "さめがめを作ろう"
---

## つくるもの

- ブラウザで遊べるさめがめ（samegame）を作ります
- 超初心者向けで「とにかく動く」を目指します
- HTMLファイルひとつ（+画像1枚）で完結するので気軽に始められます

## コードサンプルの見方

以降のコードサンプルは **追加した行** と **削除した行** が分かるように書いてあります。

先頭に ``+`` が表示されている行は新しく追加した行です。先頭の ``+`` は入力せず、その後ろを行末まで追加してください。

先頭に ``-`` が表示されている行は削除した行です。既に入力されている行を丸ごと削除してください。

次の例のように ``-`` の行（の塊）と ``+`` の行（の塊）が続けて書いてある場合は、その行を書き換えてください。

```diff html
 <!-- 「template」を「さめがめ」に書き換える -->
-  <title>template</title>
+  <title>さめがめ</title>
```

それでは作っていきましょう。

## テンプレートをダウンロードする

下のリンクを開くとDownload ZIPというボタンがあります。これをダウンロードして、中のHTMLのテンプレート（template.html）を自分で分かるところに保存してください。

[Vue.js single-file-HTML template](https://gist.github.com/idomshi/883cc00c9f3f8a0083e51e0cb96ae2d0)

迷ったらデスクトップに「さめがめ」というフォルダを作ってその中に入れればOKです。

### 動作確認をする

いまダウンロードしたHTMLファイルをブラウザのウィンドウにドラッグアンドドロップすると白いページが表示されると思います。
まだ何も表示するものを書いていないので白くてOKです。
これから1ステップ作業するごとにこのページをリロードして動作を確認していきましょう。

## 1 セルを1つ表示する

```diff html
@@ -2,15 +2,26 @@
 <html lang="ja">
 <head>
   <meta charset="UTF-8">
-  <title>template</title>
+  <title>さめがめ</title>
   <script src="https://unpkg.com/vue@3.2.37/dist/vue.global.js"></script>
   <style>
+    .cell {
+      width: 32px;
+      height: 32px;
+      border-radius: 4px;
+      background-color: #aaa;
+    }
 
     /* ↑ここにCSSを書く。 */
   </style>
 </head>
 <body>
   <div id="app">
+    <div class="container">
+      <div class="column">
+        <div class="cell"></div>
+      </div>
+    </div>
 
     <!-- ↑ここに表示するものを書く。 -->
   </div>
```

## 2 セルに色を付ける

```diff html
@@ -12,14 +12,16 @@
       background-color: #aaa;
     }
 
+    .a { background-color: crimson; }
+
     /* ↑ここにCSSを書く。 */
   </style>
 </head>
 <body>
   <div id="app">
     <div class="container">
-      <div class="column">
-        <div class="cell"></div>
+      <div class="column" v-for="(col, i) of cells" :key="i">
+        <div class="cell" v-for="(cell, j) of col" :key="j" :class="[cell]"></div>
       </div>
     </div>
 
@@ -29,6 +31,21 @@
   <script>
     const App = {
       setup() {
+        const cells = Vue.ref([])
+
+        // ゲームボードを生成する。
+        const genBoard = () => {
+          return [
+            ['a']
+          ]
+        }
+
+        // ゲームボードを生成する関数を実行する。
+        Vue.onMounted(() => cells.value = genBoard())
+
+        return {
+          cells,
+        }
 
         // ↑ここにJavaScriptを書く。
       },
```

## 3 乱数でセルの色を決める

```diff html
@@ -13,6 +13,11 @@
     }
 
     .a { background-color: crimson; }
+    .b { background-color: dodgerblue; }
+    .c { background-color: mediumseagreen; }
+    .d { background-color: orchid; }
+    .e { background-color: goldenrod; }
+    .f { background-color: slategrey; }
 
     /* ↑ここにCSSを書く。 */
   </style>
@@ -31,12 +36,21 @@
   <script>
     const App = {
       setup() {
+        const colors = ['a', 'b', 'c', 'd', 'e', 'f']
+
         const cells = Vue.ref([])
 
+        // generatorを使ってcolorsの要素をランダムに1つずつ返す関数を作る。
+        const genColor = (function* () {
+          while (true) {
+            yield colors[Math.floor(Math.random() * colors.length)]
+          }
+        })()
+
         // ゲームボードを生成する。
         const genBoard = () => {
           return [
-            ['a']
+            [genColor.next().value]
           ]
         }
```

## 4 セルの列を生成する

セルが縦に並んだ列を1つ生成できるようにします。

```diff html
@@ -37,6 +37,7 @@
     const App = {
       setup() {
         const colors = ['a', 'b', 'c', 'd', 'e', 'f']
+        const rows = 10
 
         const cells = Vue.ref([])
 
@@ -47,10 +48,19 @@
           }
         })()
 
+        // ゲームボードの縦一列を生成する。
+        const genCol = () => {
+          const result = []
+          for (let i = 0; i < rows; ++i) {
+            result.push(genColor.next().value)
+          }
+          return result
+        }
+
         // ゲームボードを生成する。
         const genBoard = () => {
           return [
-            [genColor.next().value]
+            genCol()
           ]
         }
```

## 5 列をたくさん生成する

前節で作った列をたくさん生成できるようにします。まだここでは列の並べ方を指定していないので、列同士が縦に並んでいます。

```diff html
@@ -38,6 +38,7 @@
       setup() {
         const colors = ['a', 'b', 'c', 'd', 'e', 'f']
         const rows = 10
+        const cols = 12
 
         const cells = Vue.ref([])
 
@@ -59,9 +60,11 @@
 
         // ゲームボードを生成する。
         const genBoard = () => {
-          return [
-            genCol()
-          ]
+          const result = []
+          for (let i = 0; i < cols; ++i) {
+            result.push(genCol())
+          }
+          return result
         }
 
         // ゲームボードを生成する関数を実行する。
```

## 6 列が横に並ぶようにする

列が横に並ぶようにします。また、盤面の背景色を設定します。

```diff html
@@ -5,6 +5,20 @@
   <title>さめがめ</title>
   <script src="https://unpkg.com/vue@3.2.37/dist/vue.global.js"></script>
   <style>
+    .container {
+      display: flex;
+      flex-direction: row;
+      justify-content: start;
+      gap: 4px;
+      background-color: rgb(211, 220, 227);
+    }
+
+    .column {
+      display: flex;
+      flex-direction: column-reverse;
+      gap: 4px;
+    }
+
     .cell {
       width: 32px;
       height: 32px;
@@ -24,7 +38,7 @@
 </head>
 <body>
   <div id="app">
-    <div class="container">
+    <div class="container" :style="boardSize">
       <div class="column" v-for="(col, i) of cells" :key="i">
         <div class="cell" v-for="(cell, j) of col" :key="j" :class="[cell]"></div>
       </div>
@@ -42,6 +56,9 @@
 
         const cells = Vue.ref([])
 
+        const boardSize = Vue.computed(() =>
+          `width: ${cols * (32 + 4) - 4}px; height: ${rows * (32 + 4) - 4}px;`)
+
         // generatorを使ってcolorsの要素をランダムに1つずつ返す関数を作る。
         const genColor = (function* () {
           while (true) {
@@ -72,6 +89,7 @@
 
         return {
           cells,
+          boardSize,
         }
 
         // ↑ここにJavaScriptを書く。
```

## 7 セルを削除する処理を作る

cellsの要素を削除すると該当するセルを消せます。この処理を ``remove`` 関数として追記します。
また、セルのクリックで ``remove`` が呼び出されるようにHTMLに ``@click`` を追記します。

```diff html
@@ -40,7 +40,7 @@
   <div id="app">
     <div class="container" :style="boardSize">
       <div class="column" v-for="(col, i) of cells" :key="i">
-        <div class="cell" v-for="(cell, j) of col" :key="j" :class="[cell]"></div>
+        <div class="cell" v-for="(cell, j) of col" :key="j" :class="[cell]" @click="remove(i, j)"></div>
       </div>
     </div>
 
@@ -84,12 +84,19 @@
           return result
         }
 
+        // クリックされたセルとそれに隣接する同色セルを消す。
+        const remove = (i, j) => {
+          cells.value[i].splice(j, 1)
+          cells.value = cells.value.filter((v) => v.length > 0)
+        }
+
         // ゲームボードを生成する関数を実行する。
         Vue.onMounted(() => cells.value = genBoard())
 
         return {
           cells,
           boardSize,
+          remove,
         }
 
         // ↑ここにJavaScriptを書く。
```

## 8 同じ色の隣接セルを探索する準備

同じ色のセルを再帰的に探索する ``search`` 関数を追加します。ただしここではまだ探索処理はせず、起点となるセルだけを返します。
また、 ``search`` 関数を ``remove`` 関数から呼び出すように修正します。

```diff html
@@ -84,9 +84,31 @@
           return result
         }
 
+        /**
+         * 再帰的にcolorと同じ色の隣接セルを探索してreservedにリストアップする。
+         * @type {(
+         *   color: string,
+         *   i: number,
+         *   j: number,
+         *   reserved: [number, number][],
+         *   checked: [number, number][]
+         * ) => [[number, number][], [number, number][]]}
+         */
+        const search = (color, i, j, reserved, checked) => {
+          reserved.push([i, j])
+          return [reserved, checked]
+        }
+
         // クリックされたセルとそれに隣接する同色セルを消す。
         const remove = (i, j) => {
-          cells.value[i].splice(j, 1)
+          const color = cells.value[i][j]
+          const [reserved] = search(color, i, j, [], [])
+
+          // 消す順番を間違えると違うの消しちゃうからソートしちゃう。
+          reserved.sort((a, b) => b[1] - a[1])
+
+          // で、上の方にあるやつから順番に消しますよと。
+          reserved.forEach(([i, j]) => cells.value[i].splice(j, 1))
           cells.value = cells.value.filter((v) => v.length > 0)
         }
 
```

## 9 再帰的に探索させる

``search`` 関数に探索処理を実装します。
処理の中で再帰的に ``search`` 関数を呼び出すようにし、隣接する同じ色のセルが見つかったら ``reserved`` に追加していきます。

```diff html
@@ -95,7 +95,30 @@
          * ) => [[number, number][], [number, number][]]}
          */
         const search = (color, i, j, reserved, checked) => {
+          // そもそもセルがあるかどうか。
+          if (i < 0 || i >= cells.value.length) return [reserved, checked]
+          if (j < 0 || j >= cells.value[i].length) return [reserved, checked]
+
+          // 足を踏み入れたセルのアドレスは必ずcheckedに記録する。
+          checked.push([i, j])
+
+          // 違う色だったらそのままreservedを返す。
+          if (cells.value[i][j] !== color) return [reserved, checked]
+        
+          // 同じ色だったらreservedに自身を追加して周囲の4セルをチェックする。
           reserved.push([i, j])
+          if (!checked.some((v) => v[0] === i - 1 && v[1] === j)) {
+            [reserved, checked] = search(color, i - 1, j, reserved, checked)
+          }
+          if (!checked.some((v) => v[0] === i + 1 && v[1] === j)) {
+            [reserved, checked] = search(color, i + 1, j, reserved, checked)
+          }
+          if (!checked.some((v) => v[0] === i && v[1] === j - 1)) {
+            [reserved, checked] = search(color, i, j - 1, reserved, checked)
+          }
+          if (!checked.some((v) => v[0] === i && v[1] === j + 1)) {
+            [reserved, checked] = search(color, i, j + 1, reserved, checked)
+          }
           return [reserved, checked]
         }
 
```

## 10 独立したセルは消さないようにする

探索した結果、消すべきセルは ``reserved`` にリストアップされています。
リストアップされたセルが2つ以上だった場合のみ削除処理が実行されるように ``remove`` 関数を修正します。

```diff html
@@ -126,6 +126,9 @@
         const remove = (i, j) => {
           const color = cells.value[i][j]
           const [reserved] = search(color, i, j, [], [])
+          
+          // 同じ色のセルがくっついていなかったら何もしない。
+          if (reserved.length < 2) return
 
           // 消す順番を間違えると違うの消しちゃうからソートしちゃう。
           reserved.sort((a, b) => b[1] - a[1])
```

これで完成です。色の数・行数・列数を変えるとゲームの難易度が調整できます。カスタマイズしてみてください。