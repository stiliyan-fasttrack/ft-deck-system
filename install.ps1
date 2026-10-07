# ft-deck installer for Windows 10/11. Run in PowerShell:  Set-ExecutionPolicy -Scope Process Bypass; .\install.ps1
# Installs Node.js, Python 3, LibreOffice (winget); the ft-deck skill into %USERPROFILE%\.claude\skills; its Node packages;
# a Python venv for the project; the three brand fonts (user scope). Ends with a smoke build.
$ErrorActionPreference = 'Stop'; $Here = $PSScriptRoot
function Say($m) { Write-Host "`n> $m" -ForegroundColor Yellow }
Say "1/6 Node.js, Python, LibreOffice (winget)"
foreach ($id in 'OpenJS.NodeJS.LTS', 'Python.Python.3.12', 'TheDocumentFoundation.LibreOffice') { winget install -e --id $id --accept-package-agreements --accept-source-agreements --silent | Out-Null }
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
Say "2/6 Skill -> $env:USERPROFILE\.claude\skills\ft-deck"
$Skill = "$env:USERPROFILE\.claude\skills\ft-deck"; New-Item -ItemType Directory -Force -Path $Skill | Out-Null; robocopy "$Here\skill" $Skill /MIR /NFL /NDL /NJH /NJS | Out-Null
Say "3/6 Node packages for the engine"; Push-Location "$Skill\scripts"; npm install --silent --no-audit --no-fund; Pop-Location
Say "4/6 Python environment for the project"; Push-Location "$Here\project"; if (-not (Test-Path .venv)) { python -m venv .venv }; .\.venv\Scripts\pip install -q --upgrade pip; .\.venv\Scripts\pip install -q -r requirements.txt; Pop-Location
Say "5/6 Fonts (Fast Track licence - internal use only)"
$FontDir = "$env:LOCALAPPDATA\Microsoft\Windows\Fonts"; New-Item -ItemType Directory -Force -Path $FontDir | Out-Null
Get-ChildItem "$Here\skill\assets\fonts\*.otf" | ForEach-Object { Copy-Item $_.FullName $FontDir -Force; New-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts' -Name ($_.BaseName + ' (OpenType)') -Value "$FontDir\$($_.Name)" -PropertyType String -Force | Out-Null }
Say "6/6 Smoke build"; node "$Skill\scripts\build_deck.js" "$Here\project\maps-ft.json" "$Here\project\out\smoke-test.pptx"
Write-Host "`nInstalled. Open project\out\smoke-test.pptx in PowerPoint. Next: README.md -> 'Make a deck'." -ForegroundColor Green
Write-Host "Render for QA: project\.venv\Scripts\python $Skill\scripts\render.py project\out\smoke-test.pptx"
