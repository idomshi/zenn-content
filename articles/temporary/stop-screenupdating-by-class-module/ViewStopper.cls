VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "ViewStopper"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit

' このViewStopperは終了処理をしなくていいのが素敵
' ただしDim vs As New ViewStopperってやっちゃうとInitializeされないので意味無いのは注意
Dim suSwap As Boolean
Dim calcSwap As Long

Public Sub Class_Initialize()

    With Application
        suSwap = .ScreenUpdating
        calcSwap = .calculation
        .ScreenUpdating = False
        .calculation = xlCalculationManual
    End With
    
End Sub

Public Sub Class_Terminate()

    restore

End Sub

Private Sub restore()
    
    With Application
        .Calculate
        .calculation = calcSwap
        .ScreenUpdating = suSwap
    End With

End Sub

' 設定を自動計算・更新に復元する
Public Sub autoSetting()
    
    suSwap = True
    calcSwap = xlCalculationAutomatic
    restore
    
End Sub
