param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$SeedFile
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$configPath = Join-Path $projectRoot "configuration.php"

if (-not (Test-Path $configPath)) {
    throw "configuration.php not found at $configPath"
}

if ([System.IO.Path]::IsPathRooted($SeedFile)) {
    $seedPath = $SeedFile
} else {
    $seedPath = Join-Path $projectRoot $SeedFile
}

if (-not (Test-Path $seedPath)) {
    throw "Seed file not found: $seedPath"
}

$configText = Get-Content $configPath -Raw

function Get-PhpConfigValue {
    param([string]$Name)
    $pattern = "\$$Name\s*=\s*'([^']*)';"
    $match = [regex]::Match($configText, $pattern)
    if (-not $match.Success) {
        throw "Missing config value: $Name"
    }
    return $match.Groups[1].Value
}

$dbHost = Get-PhpConfigValue "db_host"
$dbPort = Get-PhpConfigValue "db_port"
$dbUser = Get-PhpConfigValue "db_username"
$dbPass = Get-PhpConfigValue "db_password"
$dbName = Get-PhpConfigValue "db_name"

$mysqlExe = "F:\xampp\mysql\bin\mysql.exe"
if (-not (Test-Path $mysqlExe)) {
    $mysqlExe = "mysql"
}

Get-Content $seedPath -Raw | & $mysqlExe -h $dbHost -P $dbPort -u $dbUser "-p$dbPass" $dbName

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "Seed applied successfully: $seedPath"
