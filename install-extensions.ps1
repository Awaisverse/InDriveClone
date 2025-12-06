# Install VS Code Extensions for Mobile Development
# Run this script in PowerShell

Write-Host "Installing VS Code Extensions for Mobile Development..." -ForegroundColor Green
Write-Host ""

$extensions = @(
    "expo.vscode-expo-tools",
    "ms-vscode.vscode-react-native",
    "DiemasMichiels.emulate",
    "auchenberg.vscode-browser-preview",
    "formulahendry.code-runner"
)

foreach ($ext in $extensions) {
    Write-Host "Installing: $ext" -ForegroundColor Yellow
    code --install-extension $ext
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Installed: $ext" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed: $ext" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Extensions Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Reload VS Code (Ctrl+Shift+P -> Reload Window)" -ForegroundColor White
Write-Host "2. Install Android Studio: https://developer.android.com/studio" -ForegroundColor White
Write-Host "3. Create virtual devices in Android Studio" -ForegroundColor White
Write-Host "4. Start your app: cd frontend && npm start" -ForegroundColor White
Write-Host ""

