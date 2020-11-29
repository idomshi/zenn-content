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

' ����ViewStopper�͏I�����������Ȃ��Ă����̂��f�G
' ������Dim vs As New ViewStopper���Ă�����Ⴄ��Initialize����Ȃ��̂ňӖ������̂͒���
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

' �ݒ�������v�Z�E�X�V�ɕ�������
Public Sub autoSetting()
    
    suSwap = True
    calcSwap = xlCalculationAutomatic
    restore
    
End Sub