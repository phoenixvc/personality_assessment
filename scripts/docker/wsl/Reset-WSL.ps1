# PowerShell script to reset WSL

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
Write-Host "$($colors.Bright)$($colors.Cyan)    Resetting WSL$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Function to reset WSL
function Reset-WSLInstance {
    Write-Host "$($colors.Yellow)Resetting WSL...$($colors.Reset)"
    
    try {
        # Create a script to run with elevation
        $tempDir = Join-Path -Path $env:TEMP -ChildPath "wsl-reset"
        if (-not (Test-Path -Path $tempDir)) {
            New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
        }
        
        $elevatedScriptPath = Join-Path -Path $tempDir -ChildPath "reset-wsl.ps1"
        $elevatedScriptContent = @"
# Reset WSL by shutting it down
wsl --shutdown
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
            Write-Host "$($colors.Green)WSL reset successfully.$($colors.Reset)"
        }
        else {
            Write-Host "$($colors.Red)Failed to reset WSL. Exit code: $($process.ExitCode)$($colors.Reset)"
        }
        
        return $true
    }
    catch {
        Write-Host "$($colors.Red)Error resetting WSL: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Run the function
try {
    $result = Reset-WSLInstance
    if ($result) {
        Write-Host "$($colors.Green)WSL reset completed.$($colors.Reset)"
    }
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}