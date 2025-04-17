# install-dotnet8-winget.ps1
# Script to install .NET 8 SDK and Runtime using winget

Write-Host "Checking if winget is available..." -ForegroundColor Cyan
try {
    $wingetVersion = & winget --version
    Write-Host "Winget is available: $wingetVersion" -ForegroundColor Green
}
catch {
    Write-Host "Winget is not available on this system. Please install it from the Microsoft Store or use the manual installation method." -ForegroundColor Red
    exit 1
}

Write-Host "Installing .NET 8 SDK using winget..." -ForegroundColor Cyan
try {
    & winget install Microsoft.DotNet.SDK.8 --accept-source-agreements --accept-package-agreements
    Write-Host ".NET 8 SDK installation completed." -ForegroundColor Green
}
catch {
    Write-Host "Error installing .NET 8 SDK: $_" -ForegroundColor Red
}

Write-Host "Installing .NET 8 Runtime using winget..." -ForegroundColor Cyan
try {
    & winget install Microsoft.DotNet.Runtime.8 --accept-source-agreements --accept-package-agreements
    Write-Host ".NET 8 Runtime installation completed." -ForegroundColor Green
}
catch {
    Write-Host "Error installing .NET 8 Runtime: $_" -ForegroundColor Red
}

Write-Host "Installing ASP.NET Core 8 Runtime using winget..." -ForegroundColor Cyan
try {
    & winget install Microsoft.DotNet.AspNetCore.8 --accept-source-agreements --accept-package-agreements
    Write-Host "ASP.NET Core 8 Runtime installation completed." -ForegroundColor Green
}
catch {
    Write-Host "Error installing ASP.NET Core 8 Runtime: $_" -ForegroundColor Red
}

# Verify installation
Write-Host "`nVerifying .NET 8 installation..." -ForegroundColor Cyan
try {
    Write-Host ".NET SDKs:" -ForegroundColor Green
    & dotnet --list-sdks
    
    Write-Host "`n.NET Runtimes:" -ForegroundColor Green
    & dotnet --list-runtimes
}
catch {
    Write-Host "Error verifying .NET installation: $_" -ForegroundColor Red
    Write-Host "Please ensure the installation completed successfully and that the dotnet command is in your PATH." -ForegroundColor Yellow
}

Write-Host "`n.NET 8 installation process completed." -ForegroundColor Green
Write-Host "You may need to restart your terminal or IDE for the changes to take effect." -ForegroundColor Cyan