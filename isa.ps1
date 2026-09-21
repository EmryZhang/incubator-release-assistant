#Requires -Version 5.1
[CmdletBinding()]
param(
    [Parameter(Position=0)][ValidateSet('serve','api')][string]$Command='serve',
    [string]$DataDirectory,
    [string]$Address='127.0.0.1:8787',
    [string]$ApiPath='/api/state',
    [string]$BodyFile
)
$ErrorActionPreference='Stop'
$runner=Join-Path $PSScriptRoot 'node_modules\tsx\dist\cli.mjs'
if (-not (Test-Path -LiteralPath $runner)) { throw 'Run npm install in the IRA repository first.' }
$entry=Join-Path $PSScriptRoot 'src\server\cli.ts'
$isaArgs=@($runner,$entry,$Command)
if ($DataDirectory) { $isaArgs+=@('-data',[IO.Path]::GetFullPath($DataDirectory)) }
if ($Command -eq 'serve') { $isaArgs+=@('-addr',$Address,'--dev') }
else {
    $isaArgs+=@('-path',$ApiPath)
    if ($BodyFile) { $isaArgs+=@('-body',(Resolve-Path -LiteralPath $BodyFile).Path) }
}
Push-Location $PSScriptRoot
try { & node @isaArgs; $isaExit=$LASTEXITCODE } finally { Pop-Location }
if ($isaExit -ne 0) { exit $isaExit }
