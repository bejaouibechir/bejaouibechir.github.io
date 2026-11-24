# Hydra tutorials watcher - runs ONLY .bat files that live in tools\tutorials\run\.
# Protocol: a file queue\go-<anything>.txt whose first line is the name of a .bat in run\ (e.g. run-block-fallback.bat).
# One job at a time. Everything is logged in queue\watcher.log. Close this window (or Ctrl+C) to stop.
$ErrorActionPreference = 'Continue'
$root  = Split-Path -Parent $MyInvocation.MyCommand.Path          # ...\tools\tutorials\watcher
$run   = (Resolve-Path (Join-Path $root '..\run')).Path
$queue = Join-Path $root 'queue'
$log   = Join-Path $queue 'watcher.log'
New-Item -ItemType Directory -Force -Path $queue | Out-Null
function Log($m) { $l = "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m; Add-Content -Path $log -Value $l -Encoding UTF8; Write-Host $l }
Log "watcher started. Allowed folder: $run"
while ($true) {
  $go = Get-ChildItem -Path $queue -Filter 'go-*.txt' -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime | Select-Object -First 1
  if ($go) {
    $name = ((Get-Content -Path $go.FullName -TotalCount 1 -ErrorAction SilentlyContinue) | Out-String).Trim()
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    if ($name -notmatch '^[A-Za-z0-9_.-]+\.bat$') {
      Log "REFUSED '$name' (not a plain .bat name)"
    } elseif (-not (Test-Path (Join-Path $run $name))) {
      Log "REFUSED '$name' (not found in run\)"
    } else {
      $bat = (Resolve-Path (Join-Path $run $name)).Path
      if ((Split-Path -Parent $bat) -ne $run) { Log "REFUSED '$name' (outside run\)" }
      else {
        Log "RUN $name"
        $p = Start-Process -FilePath 'cmd.exe' -ArgumentList "/c `"`"$bat`" < nul`"" -WorkingDirectory $run -Wait -PassThru -WindowStyle Minimized
        Log "END $name exit=$($p.ExitCode)"
      }
    }
    Rename-Item -Path $go.FullName -NewName ("done-{0}-{1}.txt" -f $stamp, ($go.BaseName -replace '^go-','')) -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 3
}
