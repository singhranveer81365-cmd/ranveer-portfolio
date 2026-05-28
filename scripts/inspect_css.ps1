$path = 'c:\Users\ranve\Downloads\My Portfolio\dist\assets\index-CJGHWEqA.css'
$s = Get-Content -Raw $path
$posList = @(51890,51930,51942,51957,52009,52014,52025,52037,52047)
foreach ($pos in $posList) {
    $start = [math]::Max(0, $pos - 80)
    $len = [math]::Min(200, $s.Length - $start)
    $snippet = $s.Substring($start, $len)
    Write-Output "--- around $pos ---"
    Write-Output $snippet
}
