# probe_powerpoint.ps1 deck.pptx — Windows: open the deck in PowerPoint through COM and report whether it opened without repair.
param([Parameter(Mandatory=$true)][string]$Path)
$pp = New-Object -ComObject PowerPoint.Application
try { $pres = $pp.Presentations.Open((Resolve-Path $Path).Path, $true, $false, $false); Write-Output "$(Split-Path $Path -Leaf): opened OK ($($pres.Slides.Count) slides)"; $pres.Close() }
catch { Write-Output "$(Split-Path $Path -Leaf): PowerPoint refused or repaired the file: $($_.Exception.Message)" }
finally { $pp.Quit() }
