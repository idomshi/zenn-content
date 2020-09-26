---
title: "ExcelのVBAで画面の更新を止めるいつものコードを、1行で書く"
emoji: "🐈"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["VBA", "Excel", "クラスモジュール"]
published: true
---

Excelのマクロの実行時間を短縮するテクニックとして、マクロ実行中のセル数式の計算や画面の更新を一時的に止めるというのは有名かと思います。以下のようなコードです。

```vba
Application.ScreenUpdating = false
Application.Calculation = xlCaluculationManual

' ～時間のかかる処理～

Application.Calculation = xlCalculationAutomatic
Application.ScreenUpdating = true
```

セルの中身を書き換える回数が多いときには特に有効なのでよく使うのですが、わざわざ4行も使って記述するのは面倒だと思いませんか。ただでさえ行数が多くなりがちなVBAのコードでは、たかが4行、されど4行です。

そこで、この定型処理をクラスモジュールに閉じ込めて、実際に使う場面では1行で書けるようにする方法をご紹介します。

# クラスモジュールを使ったコード

まずはコードをご覧ください。

```vba
' ViewStopperクラス
Dim suTmp As Boolean
Dim calcTmp As Long

' newでインスタンスを生成したタイミングで勝手に実行される
Public Sub Class_Initialize()
    With Application
        suTmp = .ScreenUpdating
        calcTmp = .calculation
        .ScreenUpdating = False
        .calculation = xlCalculationManual
    End With
End Sub

' インスタンスが破棄されるタイミングで勝手に実行される
Public Sub Class_Terminate()
    With Application
        .Calculate
        .calculation = calcTmp
        .ScreenUpdating = suTmp
    End With
End Sub
```

コンストラクタとデストラクタに処理がまとまっていることが分かるかと思います。newでインスタンスを生成した時と、インスタンスが破棄されるときに、「いつもの」処理をやってもらうわけですね。

このクラスモジュールをプロジェクトに追加して、画面の更新を止めたい処理をするときに、次のようにnewするだけです。

```vba
' 実際の処理（標準モジュール）
Public Sub main()
    Dim vs as ViewStopper: set vs = new ViewStopper

    ' ～時間のかかる処理～
End Sub
```

なんと、4行使っていた処理がにまとめて書けてしまいました。

生成したインスタンスは放っておけばEnd Subのタイミングでガベージコレクションされるようなので（詳しい仕様は知りませんが、いまのところ期待通りに動いています）、生成後は何もする必要がありません。

# おわりに

わたしはこのようなモジュールを1か所にまとめてあり、使うときはプロジェクトツリーにドラッグアンドドロップするだけでいいようにしています。

処理の本質ではないけれど、おまじないのように入れなければいけないコードは、できるだけ省力化・省スペース化していきたいですね。