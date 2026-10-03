$ErrorActionPreference = "Continue"

$projectRoot = "C:\Users\hnahm\Documents\CareVerity ECM"
$nodePath = "C:\Program Files\nodejs\node.exe"
$nextBin = Join-Path $projectRoot "node_modules\next\dist\bin\next"
$logPath = Join-Path $projectRoot "next-dev.ps1.log"

Set-Location -LiteralPath $projectRoot
"Starting CareVerity preview at $(Get-Date -Format o)" | Out-File -LiteralPath $logPath -Encoding utf8
& $nodePath $nextBin dev *>> $logPath
