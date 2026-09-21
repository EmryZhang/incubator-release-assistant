#Requires -Version 5.1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$skillAssets = Join-Path $root "skills\incubator-release-assistant\assets"

Copy-Item -LiteralPath (Join-Path $root "config\release.schema.json") `
    -Destination (Join-Path $skillAssets "release.schema.json") -Force
Copy-Item -LiteralPath (Join-Path $root "config\examples\casbin-go.json") `
    -Destination (Join-Path $skillAssets "examples\casbin-go.json") -Force
Copy-Item -LiteralPath (Join-Path $root "config\release-queue.schema.json") `
    -Destination (Join-Path $skillAssets "release-queue.schema.json") -Force
Copy-Item -LiteralPath (Join-Path $root "config\examples\casbin-release-queue.json") `
    -Destination (Join-Path $skillAssets "examples\casbin-release-queue.json") -Force

foreach ($skillName in @("incubator-release-assistant", "ira-workbench", "apache-incubator-handbook")) {
    $references = Join-Path $root "skills\$skillName\references"
    New-Item -ItemType Directory -Path $references -Force | Out-Null
    foreach ($policyFile in @("release-readiness.md", "release-readiness-record.md", "release-preparation.md")) {
        Copy-Item -LiteralPath (Join-Path $root "docs\$policyFile") `
            -Destination (Join-Path $references $policyFile) -Force
    }
}

Write-Host "Skill assets synchronized."
