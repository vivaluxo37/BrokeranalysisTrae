# PowerShell script to fix broker.rating references in all broker files

$brokerDir = "C:\Users\LENOVO\Desktop\New folder (2)\brokeranalysis\src\pages\brokers"
$files = Get-ChildItem -Path $brokerDir -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace broker.rating with brokerData.rating
    $updatedContent = $content -replace 'renderStars\(broker\.rating\)', 'renderStars(brokerData.rating)'
    
    # Only write if content changed
    if ($content -ne $updatedContent) {
        Set-Content -Path $file.FullName -Value $updatedContent -NoNewline
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "All broker rating references have been fixed!"