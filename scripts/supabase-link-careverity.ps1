param(
  [string]$ProjectRef = "phuozecmafnmsfppicqp"
)

$ErrorActionPreference = "Stop"

try {
  $ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
  Set-Location -Path $ProjectRoot

  $CliHome = Join-Path $ProjectRoot ".supabase-cli-home"
  New-Item -ItemType Directory -Force -Path $CliHome | Out-Null

  $env:USERPROFILE = $CliHome
  $env:HOME = $CliHome
  $env:XDG_CONFIG_HOME = $CliHome
  $env:npm_config_cache = ".npm-cache"

  Write-Host "CareVerity ECM project:" $ProjectRoot
  Write-Host "Using project-local Supabase CLI profile. Do not commit or share .supabase-cli-home."
  Write-Host "Checking Supabase CLI..."

  & "C:\Program Files\nodejs\npx.cmd" --yes supabase@latest --version
  if ($LASTEXITCODE -ne 0) {
    throw "Supabase CLI version check failed with exit code $LASTEXITCODE."
  }

  if (-not $env:SUPABASE_ACCESS_TOKEN) {
    Write-Host "No SUPABASE_ACCESS_TOKEN detected. Starting Supabase login."
    Write-Host "Enter the token in this PowerShell window only if prompted. Do not paste it into chat."
    & "C:\Program Files\nodejs\npx.cmd" --yes supabase@latest login
    if ($LASTEXITCODE -ne 0) {
      throw "Supabase login failed or was cancelled with exit code $LASTEXITCODE."
    }
  }

  Write-Host "Linking Supabase project:" $ProjectRef
  & "C:\Program Files\nodejs\npx.cmd" --yes supabase@latest link --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) {
    throw "Supabase project link failed with exit code $LASTEXITCODE."
  }

  Write-Host ""
  Write-Host "FINAL_STATUS=SUCCESS"
  Write-Host "PROJECT_REF=$ProjectRef"
  Write-Host "NEXT_STEP=Run npm run staging:check"
  exit 0
} catch {
  Write-Host ""
  Write-Host "FINAL_STATUS=ERROR"
  Write-Host "ERROR_SUMMARY=$($_.Exception.Message)"
  Write-Host "NEXT_STEP=Share only these FINAL_STATUS, ERROR_SUMMARY, and NEXT_STEP lines."
  exit 1
}
