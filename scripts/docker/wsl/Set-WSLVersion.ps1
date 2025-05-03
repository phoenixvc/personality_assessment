# PowerShell script to set WSL default version

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
Write-Host "$($colors.Bright)$($colors.Cyan)    Setting WSL Default Version$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Function to check and set WSL default version
function Set-WSLDefaultVersion {
    Write-Host "$($colors.Yellow)Setting WSL default version to 2...$($colors.Reset)"
    
    try {
        # Create a script to run with elevation
        $tempDir = Join-Path -Path $env:TEMP -ChildPath "wsl-version"
        if (-not (Test-Path -Path $tempDir)) {
            New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
        }
        
        $elevatedScriptPath = Join-Path -Path $tempDir -ChildPath "set-wsl-version.ps1"
        $elevatedScriptContent = @"
# Set WSL default version to 2
wsl --set-default-version 2
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
            Write-Host "$($colors.Green)WSL default version set to 2.$($colors.Reset)"
        }
        else {
            Write-Host "$($colors.Red)Failed to set WSL default version. Exit code: $($process.ExitCode)$($colors.Reset)"
        }
        
        return $true
    }
    catch {
        Write-Host "$($colors.Red)Error setting WSL default version: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Run the function
try {
    $result = Set-WSLDefaultVersion
    if ($result) {
        Write-Host "$($colors.Green)WSL version setting completed.$($colors.Reset)"
    }
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}