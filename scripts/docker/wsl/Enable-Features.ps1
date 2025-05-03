# PowerShell script to enable required Windows features for WSL

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
Write-Host "$($colors.Bright)$($colors.Cyan)    Enabling Windows Features for WSL$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Function to enable required Windows features
function Enable-WindowsFeatures {
    Write-Host "$($colors.Yellow)Enabling required Windows features...$($colors.Reset)"
    
    try {
        # Create a script to run with elevation
        $tempDir = Join-Path -Path $env:TEMP -ChildPath "wsl-features"
        if (-not (Test-Path -Path $tempDir)) {
            New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
        }
        
        $elevatedScriptPath = Join-Path -Path $tempDir -ChildPath "enable-features.ps1"
        $elevatedScriptContent = @"
# Enable Virtual Machine Platform
Write-Host "Enabling Virtual Machine Platform..."
DISM.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Enable WSL
Write-Host "Enabling Windows Subsystem for Linux..."
DISM.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

Write-Host "Windows features enabled successfully."
Write-Host "A system restart may be required for these changes to take effect."
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
            Write-Host "$($colors.Green)Windows features enabled successfully.$($colors.Reset)"
            Write-Host "$($colors.Yellow)A system restart may be required for these changes to take effect.$($colors.Reset)"
        }
        else {
            Write-Host "$($colors.Red)Failed to enable Windows features. Exit code: $($process.ExitCode)$($colors.Reset)"
        }
        
        return $true
    }
    catch {
        Write-Host "$($colors.Red)Error enabling Windows features: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Run the function
try {
    $result = Enable-WindowsFeatures
    if ($result) {
        Write-Host "$($colors.Green)Feature enabling process completed.$($colors.Reset)"
    }
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}