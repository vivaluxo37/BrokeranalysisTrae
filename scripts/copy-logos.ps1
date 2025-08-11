# PowerShell script to copy broker logos

$sourceDir = "Resources from other sites\img.brokersview.com\prod\ico\square"
$targetDir = "public\assets\brokers\logos\square"

Write-Host "Copying broker logos from $sourceDir to $targetDir"

# Ensure target directory exists
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
    Write-Host "Created directory: $targetDir"
}

# Copy all PNG files
$logoFiles = Get-ChildItem -Path $sourceDir -Filter "*.png"
foreach ($file in $logoFiles) {
    $targetPath = Join-Path $targetDir $file.Name
    Copy-Item $file.FullName $targetPath -Force
    Write-Host "Copied: $($file.Name)"
}

Write-Host "Logo copying completed. Copied $($logoFiles.Count) files."

# List the copied files
Write-Host "\nCopied files:"
Get-ChildItem -Path $targetDir -Filter "*.png" | ForEach-Object { Write-Host "  - $($_.Name)" }