# PowerShell script to download and install WSL update

# ANSI color codes for formatting
$colors = @{
    Reset   = "`e[0m"
    Bright  = "`e[1m"
    Green   = "`e[32m"
    Yellow  = "`e[33m"
    Blue    = "`e[34m"
    Magenta = "`e[35m"
    Cyan    = "`e[36m"
    Red     = "`e[31m"
}

Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)    Installing WSL Update Package$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Function to download and install WSL update manually
function Install-WSLUpdate {
    Write-Host "$($colors.Yellow)Downloading WSL update package manually...$($colors.Reset)"
    
    $tempDir = Join-Path -Path $env:TEMP -ChildPath "wsl-update"
    $wslUpdatePath = Join-Path -Path $tempDir -ChildPath "wslupdate.msi"
    
    try {
        # Create temp directory if it doesn't exist
        if (-not (Test-Path -Path $tempDir)) {
            New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
        }
        
        # Download the WSL update package
        $wslUpdateUrl = "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi"
        
        Write-Host "$($colors.Yellow)Downloading from $wslUpdateUrl...$($colors.Reset)"
        
        # Use .NET WebClient to download the file
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($wslUpdateUrl, $wslUpdatePath)
        
        Write-Host "$($colors.Green)Download complete. Installing WSL update...$($colors.Reset)"
        
        # Install the WSL update package using msiexec
        # This requires elevation, so we'll create a script to run elevated
        $elevatedScriptPath = Join-Path -Path $tempDir -ChildPath "install-wsl-update.ps1"
        $elevatedScriptContent = @"
# Install WSL update
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$wslUpdatePath`" /quiet" -Wait -NoNewWindow
"@
        
        Set-Content -Path $elevatedScriptPath -Value $elevatedScriptContent
        
        # Run the script with elevation
        $processStartInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processStartInfo.FileName = "powershell.exe"
        $processStartInfo.Arguments = "-ExecutionPolicy Bypass -File `"$elevatedScriptPath`""
        $processStartInfo.Verb = "runas"
        $processStartInfo.UseShellExecute = $true
        
        $process = [System.Diagnostics.Process]::Start($processStartInfo)
        $process.WaitForExit()
        
        if ($process.ExitCode -eq 0) {
            Write-Host "$($colors.Green)WSL update installed successfully.$($colors.Reset)"
        }
        else {
            Write-Host "$($colors.Red)Failed to install WSL update. Exit code: $($process.ExitCode)$($colors.Reset)"
        }
        
        return $true
    }
    catch {
        Write-Host "$($colors.Red)Error installing WSL update: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Run the function and exit
try {
    $result = Install-WSLUpdate
    if ($result) {
        Write-Host "$($colors.Green)WSL update installation completed.$($colors.Reset)"
    }
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}