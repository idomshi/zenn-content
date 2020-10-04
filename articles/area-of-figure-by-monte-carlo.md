---
title: "図形を組み合わせた領域の面積をモンテカルロ法で求める"
emoji: "😎"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["JavaScript", "Vuejs", "モンテカルロ法"]
published: true
---

# 背景

仕事で円と長方形を組み合わせてできる図形の面積を求める必要がありまして、しかも組み合わせかた（各々の図形の位置・サイズ・数）を自由に変えられるようにしなければいけないという条件が付いていました。数式を立てて一般化するアプローチはムリそうだったので、ある程度の精度を犠牲にして力業で求めました。

具体的に言うとこういう図の赤部分の面積が求めたいということです。

![求めたい面積の図](https://storage.googleapis.com/zenn-user-upload/cdnarjhwo1oyi1fp7ulufrt5qkgd)

# 実装

## デモ

動くコードはこちら。計算ボタンを押すと計算を始めます。結果が出るまで6～7秒かかります。

@[jsfiddle](https://jsfiddle.net/b19fxwud/1/)

## 方針 

モンテカルロ法を使う方針とします。モンテカルロ法をご存じですか。

> シミュレーションや数値計算を乱数を用いて行う手法の総称。（[Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%A2%E3%83%B3%E3%83%86%E3%82%AB%E3%83%AB%E3%83%AD%E6%B3%95])）

だそうです。私は円周率を求める話でたまに出てくるので知っていました。

平面領域（仮にAとしましょう）に均一に分布するランダム点をたくさん生成し、全ランダム点のうち面積を求めたい領域（Bとしましょう）の中に入った点の数を数えます。すると、
$$\text{Bの面積} = \frac{\text{Bの中に入った点の数}}{\text{すべての点の数}} \times \text{Aの面積}$$
となります。

求める領域は円と長方形の組み合わせなので、それぞれの形についてランダムに生成した座標の内外判定を行い、AndやOrで組み合わせて最終的な内外判定をすればいいでしょう。

## 入力データ

組み合わせは下記のようにS式風の配列で表現することにして、このS式と点の座標を与えると再帰的に内外判定をする関数を考えます。上記のデモではVueのインスタンスの中に直接書き込んでいます。

```js
// input（上のデモではVueのインスタンスの中）
shape: [
  "and",
  [
    "or",
    ["rectangle", -500, -500, 500, 250]
  ],
  [
    "or",
    ["circle", 100, 100, 300],
    ["circle", -100, 100, 300]
  ]
]
```

## バウンディングボックス

ランダム点の密度が高い方が精度がいいはずなので、ランダム点を生成する範囲を限定します。これも入力の疑似S式を再帰的に評価してxmin～xmax、ymin～ymaxを決めます。

```js
// 面積を求める領域を囲む長方形を求める
boundingBox (shape) {
  if (shape[0] === "and") {
    return shape.slice(1).map(this.boundingBox.bind(this))
      .reduce((p, c) => [
        Math.max(p[0], c[0]),
        Math.max(p[1], c[1]),
        Math.min(p[2], c[2]),
        Math.min(p[3], c[3])
      ])

  } else if (shape[0] === "or") {
    return shape.slice(1).map(this.boundingBox.bind(this))
      .reduce((p, c) => [
        Math.min(p[0], c[0]),
        Math.min(p[1], c[1]),
        Math.max(p[2], c[2]),
        Math.max(p[3], c[3])
      ])
  
  } else if (shape[0] === "rectangle") {
    return shape.slice(1)
  
  } else if (shape[0] === "circle") {
    return [
      shape[1] - shape[3],
      shape[2] - shape[3],
      shape[1] + shape[3],
      shape[2] + shape[3]
    ]
  }
}
```

## ランダム点

[xmin, xmax), [ymin, ymax)の範囲でランダム点を生成します。

```js
// min～maxの実数乱数を生成する関数
randBetween(min, max) {
  return Math.random() * (max - min) + min
}
```

## 領域の内外判定

pointで与えられた点が領域の内側か外側かを判定する処理です。ここも疑似S式を評価するため、再帰処理しています。あと、andの処理では`false`が1つでもあれば、また、orの処理では`true`が1つでもあればその時点で`return`してしまいます。早めに`return`してあげることで目に見えてスピードが上がります。

```js
// 点が面積を求めたい図形の内側だったらtrueを返す
// shapeデータが図形の組み合わせなので、再帰的にチェックする
isInner (shape, point) {
  if (shape[0] === "and") {
    for (let i = 1; i < shape.length; i++) {
      if (!this.isInner(shape[i], point)) return false
    }
    return true

  } else if (shape[0] === "or") {
    for (let i = 1; i < shape.length; i++) {
      if (this.isInner(shape[i], point)) return true
    }
    return false
  
  } else if (shape[0] === "rectangle") {
    return shape[1] <= point[0] && point[0] < shape[3]
      && shape[2] <= point[1] && point[1] < shape[4]
  
  } else if (shape[0] === "circle") {
    return (point[0] - shape[1]) ** 2 + (point[1] - shape[2]) ** 2
      <= shape[3] ** 2
  }
}
```

## 面積の計算

さあ、やっと面積を求められます。モンテカルロ法で面積を求める場合、有効n桁の精度が欲しいとしたら$10^{2n}\,\text{個}$くらいのランダム点を生成しなければならないようです。たぶん面積（$x \times y$）だから$10^n \times 10^n$なのでしょう。必要な点の数を`imax`とします。

`imax`回のループの中でランダム点の座標をひとつづつ求め、面積を求める領域の内側に入っている場合だけ`count`をインクリメントします。最終的に`count / imax`がランダム点が領域の内側に入る確率です。

```js
// 計算起点
calc (digits, shape) {
  this.innerPoints = []
  this.outerPoints = []
  const imax = (10 ** digits) ** 2
  const [xmin, ymin, xmax, ymax] = this.boundingBox(shape)
  let count = 0
  
  for (let i = 0; i < imax; i++) {
    const point = [
      this.randBetween(xmin, xmax),
      this.randBetween(ymin, ymax)
    ]

    // 計算結果を図で表示したかったので、生成した点を図形内外で分けて保持している
    // 図にする必要が無ければ、次のように1行で済ませていい
    // if (this.isInner(shape, point)) this.count++
    if (this.isInner(shape, point)) {
      count++
      this.innerPoints.push(point)
    } else {
      this.outerPoints.push(point)
    }
  }
  this.area = this.roundDigits(
    digits,
    (xmax - xmin) * (ymax - ymin) * count / imax
  )
}
```

やっと面積が求まりました。欲しい制度が出ているか確認するために、本当なら検算をするのですが今回は省略させてください。

# おわりに

Excelのシート上の一機能として使いたかったので、実際はVBAで実装（ちなみにこちらは検算し、期待通りに計算できていることを確認してます）しました、実は。しかし計算に10～20秒かかるので一度に数十パターン計算しようとすると10分以上かかることになり、個人的にはちょっと不満です。

もっとも、場合によってはCADで図を描いて面積を求めていたので（さすがにそれは1箇所20秒ではできない）、時間も手間も大幅改善ではあります。
