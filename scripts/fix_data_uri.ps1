$path = 'c:\Users\ranve\Downloads\My Portfolio\dist\assets\index-CJGHWEqA.css'
$s = Get-Content -Raw $path
$s = $s.Replace("url('%23noiseFilter')", "url(%27%23noiseFilter%27)")
Set-Content -Path $path -Value $s
Write-Output 'done'