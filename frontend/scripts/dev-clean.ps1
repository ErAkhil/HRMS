$ErrorActionPreference = "SilentlyContinue"

# Stop any process listening on common frontend dev ports.
$ports = @(3000, 3002)
foreach ($port in $ports) {
  $pids = Get-NetTCPConnection -LocalPort $port | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pid in $pids) {
    if ($pid -and $pid -ne 0) {
      Stop-Process -Id $pid -Force
    }
  }
}

# Clear stale Next.js lock if it exists.
if (Test-Path ".next/dev/lock") {
  Remove-Item ".next/dev/lock" -Force
}

# Start Next.js dev server.
npx next dev --port 3000
