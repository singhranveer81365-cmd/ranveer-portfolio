$path = 'c:\Users\ranve\Downloads\My Portfolio\dist\assets\index-CJGHWEqA.css'
$s = Get-Content -Raw $path
$startIndex = 0
$issues = @()
while ($true) {
    $i = $s.IndexOf("url('data:", $startIndex)
    if ($i -lt 0) { break }
    $openQuote = $s.IndexOf("'", $i + 4)
    $closeQuote = $s.IndexOf("'", $openQuote + 1)
    if ($openQuote -ge 0 -and $closeQuote -gt $openQuote) {
        $content = $s.Substring($openQuote+1, $closeQuote - $openQuote -1)
        if ($content.IndexOf("'") -ge 0) { $issues += $i }
        $startIndex = $closeQuote + 1
    } else { break }
}
if ($issues.Count -eq 0) { Write-Output 'NO_ISSUES' } else { Write-Output ('ISSUES: ' + ($issues -join ',')) }
