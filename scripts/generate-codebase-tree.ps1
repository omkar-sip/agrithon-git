param(
    [string]$Root = ".",
    [string]$Output = "CODEBASE_TREE.md",
    [string[]]$ExcludeDirs = @(".git", "node_modules", ".tmp")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path -LiteralPath $Root).Path

function Get-RelativePaths {
    param(
        [string]$RootPath,
        [string[]]$IgnoreDirs
    )

    if (Get-Command rg -ErrorAction SilentlyContinue) {
        $rgArgs = @("--files", "--hidden")
        foreach ($dir in $IgnoreDirs) {
            $rgArgs += @("-g", "!$dir/**")
            $rgArgs += @("-g", "!$dir")
        }

        $items = & rg @rgArgs 2>$null
        if ($LASTEXITCODE -ne 0 -and -not $items) {
            return @()
        }
        return $items
    }

    $files = Get-ChildItem -LiteralPath $RootPath -Recurse -File -Force
    $relative = @()
    foreach ($file in $files) {
        $path = $file.FullName.Substring($RootPath.Length).TrimStart("\")
        $parts = $path -split "[\\/]"
        $skip = $false
        foreach ($part in $parts) {
            if ($IgnoreDirs -contains $part) {
                $skip = $true
                break
            }
        }
        if (-not $skip) {
            $relative += $path
        }
    }
    return $relative
}

function Build-Tree {
    param(
        [string[]]$Paths
    )

    $root = [ordered]@{}

    foreach ($path in $Paths) {
        if (-not $path) {
            continue
        }

        $normalized = $path -replace "\\", "/"
        $segments = $normalized -split "/"
        $children = $root

        for ($i = 0; $i -lt $segments.Length; $i++) {
            $segment = $segments[$i]
            if (-not $segment) {
                continue
            }

            $isFile = $i -eq ($segments.Length - 1)
            if (-not $children.Contains($segment)) {
                $children[$segment] = [ordered]@{
                    isFile = $isFile
                    children = [ordered]@{}
                }
            } elseif ($isFile) {
                $children[$segment].isFile = $true
            }

            $children = $children[$segment].children
        }
    }

    return $root
}

function Get-SortedNodeNames {
    param(
        $Children
    )

    return $Children.Keys | Sort-Object `
        @{ Expression = { if ($Children[$_].isFile) { 1 } else { 0 } } }, `
        @{ Expression = { $_.ToLowerInvariant() } }, `
        @{ Expression = { $_ } }
}

function Render-Tree {
    param(
        $Children,
        [string]$Prefix,
        [System.Collections.Generic.List[string]]$Lines
    )

    $names = @(Get-SortedNodeNames -Children $Children)
    for ($index = 0; $index -lt $names.Count; $index++) {
        $name = $names[$index]
        $node = $Children[$name]
        $isLast = $index -eq ($names.Count - 1)

        $branch = if ($isLast) { "\-- " } else { "|-- " }
        $suffix = if ($node.isFile) { "" } else { "/" }
        $Lines.Add("$Prefix$branch$name$suffix")

        if (-not $node.isFile) {
            $nextPrefix = if ($isLast) { "$Prefix    " } else { "$Prefix|   " }
            Render-Tree -Children $node.children -Prefix $nextPrefix -Lines $Lines
        }
    }
}

$relativePaths = Get-RelativePaths -RootPath $rootPath -IgnoreDirs $ExcludeDirs |
    Sort-Object -Unique

$tree = Build-Tree -Paths $relativePaths

$treeLines = New-Object System.Collections.Generic.List[string]
$treeLines.Add(".")
Render-Tree -Children $tree -Prefix "" -Lines $treeLines

$timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss zzz")
$excluded = ($ExcludeDirs | Sort-Object) -join ", "

$outputPath = Join-Path $rootPath $Output
$doc = @(
    "# Codebase Tree",
    "",
    "This file is a lightweight path index to quickly locate code and reduce repeated repository scans.",
    "",
    "- Generated: $timestamp",
    "- Root: $rootPath",
    "- Excluded directories: $excluded",
    "- Regenerate: powershell -ExecutionPolicy Bypass -File scripts/generate-codebase-tree.ps1",
    "",
    "~~~text"
) + $treeLines + @(
    "~~~",
    ""
)

Set-Content -LiteralPath $outputPath -Value $doc -Encoding UTF8

Write-Output "Wrote $Output with $($relativePaths.Count) files."
