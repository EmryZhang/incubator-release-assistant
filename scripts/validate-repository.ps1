#Requires -Version 5.1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$releaseSkill = Join-Path $root "skills\incubator-release-assistant"
$handbookSkill = Join-Path $root "skills\apache-incubator-handbook"

$pairs = @(
    @((Join-Path $root "config\release.schema.json"), (Join-Path $releaseSkill "assets\release.schema.json")),
    @((Join-Path $root "config\examples\casbin-go.json"), (Join-Path $releaseSkill "assets\examples\casbin-go.json")),
    @((Join-Path $root "config\release-queue.schema.json"), (Join-Path $releaseSkill "assets\release-queue.schema.json")),
    @((Join-Path $root "config\examples\casbin-release-queue.json"), (Join-Path $releaseSkill "assets\examples\casbin-release-queue.json"))
)

# Canonical policy is maintained in docs; installed skills must carry it too.
foreach ($skillName in @("incubator-release-assistant", "ira-workbench", "apache-incubator-handbook")) {
    $skillEntry = Get-Content -LiteralPath (Join-Path $root "skills\$skillName\SKILL.md") -Raw
    foreach ($policyFile in @("release-readiness.md", "release-readiness-record.md", "release-preparation.md")) {
        $pairs += ,@((Join-Path $root "docs\$policyFile"), (Join-Path $root "skills\$skillName\references\$policyFile"))
        if ($skillEntry -notmatch [regex]::Escape("references/$policyFile")) {
            throw "Skill $skillName does not route to required readiness resource: $policyFile"
        }
    }
}

foreach ($pair in $pairs) {
    $left = (Get-FileHash -LiteralPath $pair[0] -Algorithm SHA256).Hash
    $right = (Get-FileHash -LiteralPath $pair[1] -Algorithm SHA256).Hash
    if ($left -ne $right) {
        throw "Skill asset drift: $($pair[0]) != $($pair[1]); run scripts/sync-skill-assets.ps1"
    }
}

Get-Content -LiteralPath (Join-Path $root "config\release.schema.json") -Raw | ConvertFrom-Json | Out-Null
Get-Content -LiteralPath (Join-Path $root "config\examples\casbin-go.json") -Raw | ConvertFrom-Json | Out-Null
Get-Content -LiteralPath (Join-Path $root "config\release-queue.schema.json") -Raw | ConvertFrom-Json | Out-Null
Get-Content -LiteralPath (Join-Path $root "config\examples\casbin-release-queue.json") -Raw | ConvertFrom-Json | Out-Null
Get-Content -LiteralPath (Join-Path $releaseSkill "evals\evals.json") -Encoding UTF8 -Raw | ConvertFrom-Json | Out-Null
Get-Content -LiteralPath (Join-Path $handbookSkill "evals\evals.json") -Encoding UTF8 -Raw | ConvertFrom-Json | Out-Null

$releaseSkillText = Get-Content -LiteralPath (Join-Path $releaseSkill "SKILL.md") -Raw
if ($releaseSkillText -notmatch "(?s)^---\s*\r?\nname:\s*incubator-release-assistant\s*\r?\ndescription:\s*.+?\r?\n---") {
    throw "Release Skill frontmatter is missing or invalid"
}

$releaseReadiness = Join-Path $root "docs\release-readiness.md"
if (-not (Test-Path -LiteralPath $releaseReadiness -PathType Leaf)) {
    throw "Release readiness standard is missing: docs/release-readiness.md"
}
$releaseReadinessText = Get-Content -LiteralPath $releaseReadiness -Raw
$readinessRecordText = Get-Content -LiteralPath (Join-Path $root "docs\release-readiness-record.md") -Raw
foreach ($gate in @("PREP-01", "PREP-02", "PREP-03", "PREP-04", "PREP-05", "PREP-06", "PREP-07", "PREP-08")) {
    if ($releaseReadinessText -notmatch "(?m)^### $gate\b" -or
        $readinessRecordText -notmatch "(?m)^\| $gate \| pending \|") {
        throw "Mandatory readiness gate is absent from policy or pending template: $gate"
    }
}
# Structural guard only: presence and mirrored bytes do not verify audit evidence.
foreach ($audit in @("AUDIT-01", "AUDIT-02", "AUDIT-03", "AUDIT-04", "AUDIT-05", "AUDIT-06", "AUDIT-07")) {
    if ($releaseReadinessText -notmatch "(?m)^### $audit\b" -or
        $readinessRecordText -notmatch "(?m)^\| $audit \| pending \|") {
        throw "Mandatory detailed audit is absent from policy or pending template: $audit"
    }
}
foreach ($requiredReadinessPattern in @(
    "CI\s+answers whether the selected commit passed",
    "Run Apache RAT on that final source archive",
    "zero unexplained RAT findings",
    "independently unpack the source archive, build it",
    "unknown, stale, unreviewed, or unresolved evidence is NOT a pass",
    "generic Apache-2.0 license header is not proof",
    "Zero OSV/advisory matches is not license clearance",
    "not only\s+a DISCLAIMER file inside an archive",
    "States are not interchangeable",
    "invalidate affected conclusions",
    "do not\s+claim new server-side or Go-engine enforcement"
)) {
    if ($releaseReadinessText -notmatch $requiredReadinessPattern) {
        throw "Release readiness standard is missing required rule: $requiredReadinessPattern"
    }
}
foreach ($requiredSkillPattern in @(
    [regex]::Escape("CI is necessary evidence, not release approval"),
    [regex]::Escape("RAT report for the **final source archive**"),
    "independent reviewer must unpack, build,\s+and test"
)) {
    if ($releaseSkillText -notmatch $requiredSkillPattern) {
        throw "Release Skill is missing required release-readiness rule: $requiredSkillPattern"
    }
}

foreach ($required in @(
    "scripts\ira\go.mod",
    "scripts\ira\cmd\ira\main.go",
    "scripts\run.ps1",
    "scripts\run.sh",
    "assets\release.schema.json",
    "assets\examples\casbin-go.json",
    "assets\release-queue.schema.json",
    "assets\examples\casbin-release-queue.json",
    "references\configuration.md"
)) {
    if (-not (Test-Path -LiteralPath (Join-Path $releaseSkill $required) -PathType Leaf)) {
        throw "Release Skill resource is missing: $required"
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $root ".github\workflows\ci.yml") -PathType Leaf)) {
    throw "Lightweight CI workflow is missing: .github/workflows/ci.yml"
}

$engineText = Get-Content -LiteralPath (Join-Path $releaseSkill "scripts\ira\internal\release\engine.go") -Raw
foreach ($forbidden in @("go test", "runCasbinGoTests", "casbinGoTestCommand")) {
    if ($engineText -match [regex]::Escape($forbidden)) {
        throw "IRA prepare must not execute target-project tests: found $forbidden in engine.go"
    }
}

$ciText = Get-Content -LiteralPath (Join-Path $root ".github\workflows\ci.yml") -Raw
foreach ($requiredCheck in @("go test ./...", "go vet ./...", "gofmt -l", "bash -n", "validate-repository.ps1")) {
    if ($ciText -notmatch [regex]::Escape($requiredCheck)) {
        throw "Lightweight CI is missing required repository check: $requiredCheck"
    }
}

$powerShellWrapper = Get-Content -LiteralPath (Join-Path $releaseSkill "scripts\run.ps1") -Raw
$bashWrapper = Get-Content -LiteralPath (Join-Path $releaseSkill "scripts\run.sh") -Raw
foreach ($contract in @(
    @($powerShellWrapper, "IRA_SECRET_DIR", "PowerShell wrapper does not export the external secret directory"),
    @($powerShellWrapper, "GNUPGHOME", "PowerShell wrapper does not isolate the GPG home"),
    @($powerShellWrapper, "outside the repository", "PowerShell wrapper does not reject repository-contained secrets"),
    @($bashWrapper, "IRA_SECRET_DIR", "Bash wrapper does not export the external secret directory"),
    @($bashWrapper, "GNUPGHOME", "Bash wrapper does not isolate the GPG home"),
    @($bashWrapper, "outside the repository", "Bash wrapper does not reject repository-contained secrets")
)) {
    if ($contract[0] -notmatch [regex]::Escape($contract[1])) {
        throw $contract[2]
    }
}

$gitIgnore = Get-Content -LiteralPath (Join-Path $root ".gitignore") -Raw
if ($gitIgnore -notmatch "(?m)^secretkey/\r?$") {
    throw ".gitignore must exclude a mistakenly created repository-local secretkey directory"
}

$handbookSkillText = Get-Content -LiteralPath (Join-Path $handbookSkill "SKILL.md") -Raw
if ($handbookSkillText -notmatch "(?s)^---\s*\r?\nname:\s*apache-incubator-handbook\s*\r?\ndescription:\s*.+?\r?\n---") {
    throw "Handbook Skill frontmatter is missing or invalid"
}

foreach ($required in @(
    "references\README.md",
    "references\01-lifecycle-and-roles.md",
    "references\02-governance-and-reporting.md",
    "references\03-releases-voting-and-distribution.md",
    "references\04-ip-and-licensing.md",
    "references\05-branding-and-websites.md",
    "references\06-community-graduation-and-retirement.md",
    "references\07-infrastructure-accounts-and-security.md",
    "references\official-sources.md"
)) {
    if (-not (Test-Path -LiteralPath (Join-Path $handbookSkill $required) -PathType Leaf)) {
        throw "Handbook Skill resource is missing: $required"
    }
}

$workbenchSkill = Join-Path $root "skills\ira-workbench\SKILL.md"
$workbenchText = Get-Content -LiteralPath $workbenchSkill -Raw
if ($workbenchText -notmatch "(?s)^---\s*\r?\nname:\s*ira-workbench\s*\r?\ndescription:\s*.+?\r?\n---") {
    throw "Workbench Skill frontmatter is missing or invalid"
}
foreach ($required in @("isa.ps1", "isa.sh", "docs\workbench.md", "package.json", "package-lock.json", "src\server\cli.ts", "src\shared\model.ts", "web\index.html")) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $required) -PathType Leaf)) {
        throw "Workbench entry point is missing: $required"
    }
}

$nodePackage = Get-Content -LiteralPath (Join-Path $root "package.json") -Raw | ConvertFrom-Json
foreach ($command in @("dev", "build", "start", "test", "ira", "isa")) {
    if (-not $nodePackage.scripts.$command) { throw "Missing npm entry point: $command" }
}

Write-Host "Repository, workbench and Skill contracts are valid."
