---
title: "15パズルを作ろう"
---

## つくるもの

- ブラウザで遊べる15パズルを作ります
- 超初心者向けで「とにかく動く」を目指します
- HTMLファイルひとつ（+画像1枚）で完結するので気軽に始められます

## テンプレートをダウンロードする

下のリンクを開くとDownload ZIPというボタンがあります。これをダウンロードして、中のHTMLのテンプレート（template.html）を自分で分かるところに保存してください。

[Vue.js single-file-HTML template](https://gist.github.com/idomshi/883cc00c9f3f8a0083e51e0cb96ae2d0)

迷ったらデスクトップに「15パズル」というフォルダを作ってその中に入れればOK。
同じ場所に画像ファイル（720px×720pxのjpgファイル）も入れてください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>template</title>
    <script src="https://unpkg.com/vue@3.2.37/dist/vue.global.js"></script>
    <style>

      /* ↑ここにCSSを書く。 */
    </style>
</head>
<body>
    <div id="app">

      <!-- ↑ここに表示するものを書く。 -->
    </div>
    
    <script>
        const App = {
            setup() {

                // ↑ここにJavaScriptを書く。
            },
        } 

        Vue.createApp(App).mount('#app')
    </script>
</body>
</html>
```

### 動作確認をする

いまダウンロードしたHTMLファイルをブラウザのウィンドウにドラッグアンドドロップすると白いページが表示されると思います。
まだ何も表示するものを書いていないので白くてOKです。
これから1ステップ作業するごとにこのページをリロードして動作を確認していきましょう。

## 画像を読み込む

まずはパズルにする画像を読み込みましょう。

``+`` で始まっている行は追加された行、``-`` で始まっている行は削除された行をそれぞれ表しています（次のコードには削除された行がありませんが）。実際には先頭の ``+`` や ``-`` は入力しません。

```diff html
@@ -6,12 +6,20 @@
     <title>template</title>
     <script src="https://unpkg.com/vue@3.2.37/dist/vue.global.js"></script>
     <style>
+        .piece {
+            width: 720px;
+            height: 720px;
+            background-image: url(./dog-rabbit-col.jpg);
+            box-sizing: border-box;
+            border: 1px solid #aaa;
+        }
 
         /* ↑ここにCSSを書く。 */
     </style>
 </head>
 <body>
     <div id="app">
+        <div class="piece"></div>
 
         <!-- ↑ここに表示するものを書く。 -->
     </div>
```

## ピースを並べる

前節で画像を読み込んだ要素のサイズを180px×180pxに変更してピースに見えるようにします。
また、ピースに0～15の番号を付けて16枚のピースが表示されるようにします。

```diff html
@@ -7,8 +7,8 @@
     <script src="https://unpkg.com/vue@3.2.37/dist/vue.global.js"></script>
     <style>
         .piece {
-            width: 720px;
-            height: 720px;
+            width: 180px;
+            height: 180px;
             background-image: url(./dog-rabbit-col.jpg);
             box-sizing: border-box;
             border: 1px solid #aaa;
@@ -19,7 +19,7 @@
 </head>
 <body>
     <div id="app">
-        <div class="piece"></div>
+        <div class="piece" v-for="(id, i) in arr" :key="id"></div>
 
         <!-- ↑ここに表示するものを書く。 -->
     </div>
@@ -27,6 +27,11 @@
     <script>
         const App = {
             setup() {
+                const arr = Vue.ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
+                
+                return {
+                    arr,
+                }
 
                 // ↑ここにJavaScriptを書く。
             },
```

まだこの段階では、全てのピースが左上のピースになっていると思います。
次に ``background-position`` を指定して、ピースごとに元画像の別々の場所が表示されるようにします。
タテヨコのpositionが``-1px`` されているのはピースの枠線幅の分です。

```diff html
@@ -14,12 +14,29 @@
             border: 1px solid #aaa;
         }
 
+        .piece00 { background-position: -1px -1px; }
+        .piece01 { background-position: -181px -1px; }
+        .piece02 { background-position: -361px -1px; }
+        .piece03 { background-position: -541px -1px; }
+        .piece04 { background-position: -1px -181px; }
+        .piece05 { background-position: -181px -181px; }
+        .piece06 { background-position: -361px -181px; }
+        .piece07 { background-position: -541px -181px; }
+        .piece08 { background-position: -1px -361px; }
+        .piece09 { background-position: -181px -361px; }
+        .piece10 { background-position: -361px -361px; }
+        .piece11 { background-position: -541px -361px; }
+        .piece12 { background-position: -1px -541px; }
+        .piece13 { background-position: -181px -541px; }
+        .piece14 { background-position: -361px -541px; }
+        .piece15 { background-position: -541px -541px; background: none; z-index: -1; }
+
         /* ↑ここにCSSを書く。 */
     </style>
 </head>
 <body>
     <div id="app">
-        <div class="piece" v-for="(id, i) in arr" :key="id"></div>
+        <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]"></div>
 
         <!-- ↑ここに表示するものを書く。 -->
     </div>
@@ -28,9 +45,11 @@
         const App = {
             setup() {
                 const arr = Vue.ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
+                const generateClassname = (id) => 'piece' + String(id).padStart(2, '0')
                 
                 return {
                     arr,
+                    generateClassname,
                 }
 
                 // ↑ここにJavaScriptを書く。

```

つづいて、16枚のピースを納める枠を追加します。枠のサイズを720px×720pxにすることで、ピースが4枚ずつ横に並ぶようになったと思います。

```diff html
@@ -6,6 +6,15 @@
     <title>template</title>
     <script src="https://unpkg.com/vue@3.2.37/dist/vue.global.js"></script>
     <style>
+        .piece-container {
+            width: 720px;
+            height: 720px;
+            display: flex;
+            flex-direction: row;
+            flex-wrap: wrap;
+            background-color: rgb(231, 225, 213);
+        }
+
         .piece {
             width: 180px;
             height: 180px;
@@ -36,7 +45,9 @@
 </head>
 <body>
     <div id="app">
-        <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]"></div>
+        <div class="piece-container">
+            <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]"></div>
+        </div>
 
         <!-- ↑ここに表示するものを書く。 -->
     </div>
```

## バラバラに崩す処理を作る

ピースをシャッフルする処理を作っていきます。

### ボタンを追加する

「シャッフル」ボタンを作ります。まだクリックしても何も起きません。

```diff html
@@ -40,6 +40,16 @@
         .piece14 { background-position: -361px -541px; }
         .piece15 { background-position: -541px -541px; background: none; z-index: -1; }
 
+        .button {
+            width: 720px;
+            background-color:rgb(179, 200, 134);
+            padding: 2rem;
+            display: flex;
+            justify-content: center;
+            align-items: center;
+            box-sizing: border-box;
+        }
+
         /* ↑ここにCSSを書く。 */
     </style>
 </head>
@@ -48,6 +58,7 @@
         <div class="piece-container">
             <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]"></div>
         </div>
+        <p class="button">シャッフル</p>
 
         <!-- ↑ここに表示するものを書く。 -->
     </div>
```

### ボタンに処理を割り当てる

ボタンをクリックしたときの処理 ``shuffle`` を作り、前節でつくったボタンに割り当てます。
配列 ``arr`` の中身の順番を変えるとピースの位置がその順番に並びます。

```diff html
@@ -58,7 +58,7 @@
         <div class="piece-container">
             <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]"></div>
         </div>
-        <p class="button">シャッフル</p>
+        <p @click="shuffle" class="button">シャッフル</p>
 
         <!-- ↑ここに表示するものを書く。 -->
     </div>
@@ -68,10 +68,22 @@
             setup() {
                 const arr = Vue.ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
                 const generateClassname = (id) => 'piece' + String(id).padStart(2, '0')
+
+                const shuffle = () => {
+                    const tmp = [...arr.value]
+                    for (let i = tmp.length - 1; i > 0; i--) {
+                        const r = Math.floor(Math.random() * (i + 1))
+                        const t = tmp[i]
+                        tmp[i] = tmp[r]
+                        tmp[r] = t
+                    }
+                    arr.value = tmp
+                }
                 
                 return {
                     arr,
                     generateClassname,
+                    shuffle,
                 }
 
                 // ↑ここにJavaScriptを書く。
```

ここまでで15パズルっぽい見た目になってきたと思います。しかしまだスライドできないので全然遊べませんね。

## スライド処理を作る

スライドする処理を作っていきます。スライド処理はピースのクリックに割り当て、空きセル（15番ピースのあるセル）の位置によって処理を分岐します。

### 左右にスライドする処理を作る

右にスライドする処理と左ににスライドする処理は1つの関数 ``slideX`` にまとめられます。

```diff html
@@ -56,7 +56,7 @@
 <body>
     <div id="app">
         <div class="piece-container">
-            <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]"></div>
+            <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]" @click="slide(i)"></div>
         </div>
         <p @click="shuffle" class="button">シャッフル</p>
 
@@ -79,11 +79,26 @@
                     }
                     arr.value = tmp
                 }
+
+                const slideX = (from, to) => {
+                    const tmp = [...arr.value]
+                    const [t] = tmp.splice(to, 1)
+                    tmp.splice(from, 0, t)
+                    arr.value = tmp
+                }
+
+                const slide = (from) => {
+                    const bIndex = arr.value.indexOf(15)
+                    if (Math.floor(bIndex / 4) === Math.floor(from / 4)) {
+                        slideX(from, bIndex)
+                    }
+                }
                 
                 return {
                     arr,
                     generateClassname,
                     shuffle,
+                    slide,
                 }
 
                 // ↑ここにJavaScriptを書く。
```

### 下にスライドする処理を作る

下にスライドするには、配列の要素を4個おきに入れ替えていきます。``slideD`` という関数を作ります。

```diff html
@@ -87,10 +87,26 @@
                     arr.value = tmp
                 }
 
+                const slideD = (from, to) => {
+                    const tmp = [...arr.value]
+                    let [t] = tmp.splice(to, 1)
+                    for (let i = from; i < to; i += 4) {
+                        [t] = tmp.splice(i, 1, t)
+                    }
+                    tmp.splice(to, 0, t)
+                    arr.value = tmp
+                }
+
                 const slide = (from) => {
                     const bIndex = arr.value.indexOf(15)
                     if (Math.floor(bIndex / 4) === Math.floor(from / 4)) {
                         slideX(from, bIndex)
+                    }
+
+                    if ((bIndex % 4) === (from % 4)) {
+                        if (bIndex > from) {
+                            slideD(from, bIndex)
+                        }
                     }
                 }
                 
```

### 上にスライドする処理を作る

上にスライドする処理 ``slideU`` は下にスライドする処理とそっくりですが、入れ替える順番が逆になります。そのために ``slideD`` とは別に作成します。

```diff html
@@ -97,6 +97,16 @@
                     arr.value = tmp
                 }
 
+                const slideU = (from, to) => {
+                    const tmp = [...arr.value]
+                    let [t] = tmp.splice(to, 1)
+                    for (let i = from; i > to; i -= 4) {
+                        [t] = tmp.splice(i - 1, 1, t)
+                    }
+                    tmp.splice(to, 0, t)
+                    arr.value = tmp
+                }
+
                 const slide = (from) => {
                     const bIndex = arr.value.indexOf(15)
                     if (Math.floor(bIndex / 4) === Math.floor(from / 4)) {
@@ -106,6 +116,8 @@
                     if ((bIndex % 4) === (from % 4)) {
                         if (bIndex > from) {
                             slideD(from, bIndex)
+                        } else {
+                            slideU(from, bIndex)
                         }
                     }
                 }
```

ここまで作るとパズルとして遊べるようになります。

### スライドにアニメーションを付ける

パズルとして最低限の機能は実装しましたが、ここからほんの少し修正するとピースをスライドさせるときの動きを付けられます。

```diff html
@@ -50,14 +50,18 @@
             box-sizing: border-box;
         }
 
+        .piece-group-move {
+            transition: transform 0.1s ease-in;
+        }
+
         /* ↑ここにCSSを書く。 */
     </style>
 </head>
 <body>
     <div id="app">
-        <div class="piece-container">
+        <transition-group name="piece-group" tag="div" class="piece-container">
             <div class="piece" v-for="(id, i) in arr" :key="id" :class="[generateClassname(id)]" @click="slide(i)"></div>
-        </div>
+        </transition-group>
         <p @click="shuffle" class="button">シャッフル</p>
 
         <!-- ↑ここに表示するものを書く。 -->
```

これで一応完成です。
……実は ``shuffle`` の処理で完成しない（最後の2ピースの順番が逆になってしまう）配置になってしまうことがあります。
完全にランダムにシャッフルしているせいなので、シャッフル処理の中にチェック処理を入れて、完成する配列になるまで再シャッフルすればいいのです。今回は間に合わなかったので省略させていただきました。
