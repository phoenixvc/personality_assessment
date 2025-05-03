# PowerShell script to troubleshoot WSL issues for Docker Desktop

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
Write-Host "$($colors.Bright)$($colors.Cyan)    WSL Troubleshooter for Docker$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Check if running on Windows
if (-not ($PSVersionTable.Platform -eq $null -or $PSVersionTable.Platform -eq "Win32NT")) {
    Write-Host "$($colors.Yellow)This script is only for Windows systems. You're running on $($PSVersionTable.OS).$($colors.Reset)"
    exit 1
}

# Function to run a script
function Invoke-Script {
    param (
        [string]$ScriptName
    )
    
    $scriptPath = Join-Path -Path $PSScriptRoot -ChildPath $ScriptName
    Write-Host "$($colors.Blue)Running $ScriptName...$($colors.Reset)"
    
    try {
        & $scriptPath
        return $true
    }
    catch {
        Write-Host "$($colors.Yellow)Script $ScriptName exited with an error: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Function to check if WSL is installed
function Test-WSLInstalled {
    try {
        $null = wsl --status 2>$null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if Docker Desktop is installed
function Test-DockerDesktop {
    try {
        $null = docker --version 2>$null
        Write-Host "$($colors.Green)Docker CLI is installed.$($colors.Reset)"
        return $true
    }
    catch {
        Write-Host "$($colors.Yellow)Docker CLI not found or not in PATH.$($colors.Reset)"
        return $false
    }
}

# Function to check Windows version
function Get-WindowsBuildNumber {
    try {
        $osInfo = Get-CimInstance -ClassName Win32_OperatingSystem
        Write-Host "$($colors.Blue)Windows version information:$($colors.Reset)"
        Write-Host "OS Name: $($osInfo.Caption)"
        Write-Host "OS Version: $($osInfo.Version)"
        Write-Host "OS Build: $($osInfo.BuildNumber)"
        
        return [int]$osInfo.BuildNumber
    }
    catch {
        Write-Host "$($colors.Red)Error checking Windows version: $($_.Exception.Message)$($colors.Reset)"
        return 0
    }
}

# Function to configure Hyper-V as Docker backend
function Configure-HyperV {
    Write-Host "$($colors.Bright)$($colors.Cyan)Configuring Hyper-V as Docker Backend$($colors.Reset)"
    
    try {
        # Create a script to run with elevation that will check and enable Hyper-V
        $tempDir = Join-Path -Path $env:TEMP -ChildPath "docker-hyperv"
        if (-not (Test-Path -Path $tempDir)) {
            New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
        }
        
        $elevatedScriptPath = Join-Path -Path $tempDir -ChildPath "configure-hyperv.ps1"
        $elevatedScriptContent = @"
# Check if Hyper-V is enabled
Write-Host "Checking if Hyper-V is enabled..."
`$hyperVEnabled = (Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V).State -eq "Enabled"

if (-not `$hyperVEnabled) {
    Write-Host "Hyper-V is not enabled. Enabling Hyper-V..."
    # Enable Hyper-V feature
    Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All -NoRestart
    Write-Host "Hyper-V has been enabled. A system restart may be required."
} else {
    Write-Host "Hyper-V is already enabled."
}

# Configure Docker to use Hyper-V instead of WSL
Write-Host "Configuring Docker Desktop to use Hyper-V backend..."

`$dockerConfigPath = "`$env:USERPROFILE\.docker\daemon.json"
`$dockerConfigDir = [System.IO.Path]::GetDirectoryName(`$dockerConfigPath)

if (-not (Test-Path -Path `$dockerConfigDir)) {
    New-Item -Path `$dockerConfigDir -ItemType Directory -Force | Out-Null
}

`$dockerConfig = @{
    "builder" = @{
        "gc" = @{
            "defaultKeepStorage" = "20GB"
            "enabled" = `$true
        }
    }
    "experimental" = `$false
    "features" = @{
        "buildkit" = `$true
    }
    "wslEngineEnabled" = `$false
}

`$dockerConfig | ConvertTo-Json -Depth 10 | Set-Content -Path `$dockerConfigPath

Write-Host "Docker Desktop configured to use Hyper-V backend."
Write-Host "Please restart Docker Desktop for changes to take effect."
"@
        
        Set-Content -Path $elevatedScriptPath -Value $elevatedScriptContent
        
        Write-Host "$($colors.Yellow)Running Hyper-V configuration with admin privileges...$($colors.Reset)"
        Write-Host "$($colors.Yellow)If prompted, please allow the User Account Control (UAC) dialog.$($colors.Reset)"
        
        # Run the script with elevation
        $processStartInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processStartInfo.FileName = "powershell.exe"
        $processStartInfo.Arguments = "-ExecutionPolicy Bypass -File `"$elevatedScriptPath`""
        $processStartInfo.Verb = "runas"
        $processStartInfo.UseShellExecute = $true
        
        $process = [System.Diagnostics.Process]::Start($processStartInfo)
        $process.WaitForExit()
        
        if ($process.ExitCode -eq 0) {
            Write-Host "$($colors.Green)Hyper-V configuration completed successfully.$($colors.Reset)"
            Write-Host "$($colors.Yellow)Please restart Docker Desktop for changes to take effect.$($colors.Reset)"
            return $true
        }
        else {
            Write-Host "$($colors.Red)Failed to configure Hyper-V. Exit code: $($process.ExitCode)$($colors.Reset)"
            return $false
        }
    }
    catch {
        Write-Host "$($colors.Red)Error configuring Hyper-V: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Function to suggest alternative solutions
function Show-AlternativeSolutions {
    Write-Host "$($colors.Bright)$($colors.Magenta)Alternative Container Solutions:$($colors.Reset)"
    Write-Host "$($colors.Magenta)1. Use Rancher Desktop: An alternative to Docker Desktop that works well with WSL$($colors.Reset)"
    Write-Host "$($colors.Magenta)   https://rancherdesktop.io/$($colors.Reset)"
    Write-Host ""
    Write-Host "$($colors.Magenta)2. Use Podman: A daemonless container engine$($colors.Reset)"
    Write-Host "$($colors.Magenta)   https://podman.io/$($colors.Reset)"
    Write-Host ""
    Write-Host "$($colors.Magenta)3. For .NET development, consider using DevContainer or GitHub Codespaces$($colors.Reset)"
    Write-Host "$($colors.Magenta)   https://code.visualstudio.com/docs/devcontainers/containers$($colors.Reset)"
}

# Main function
function Start-Troubleshooting {
    Write-Host "$($colors.Bright)$($colors.Yellow)This script will help troubleshoot and fix WSL issues affecting Docker Desktop.$($colors.Reset)"
    Write-Host "$($colors.Bright)$($colors.Yellow)Several operations require administrator privileges.$($colors.Reset)"
    Write-Host ""
    
    # Check Windows version
    $buildNumber = Get-WindowsBuildNumber
    $isNewerBuild = $buildNumber -ge 20000
    
    if ($isNewerBuild) {
        Write-Host "$($colors.Yellow)You're running a newer Windows build ($buildNumber).$($colors.Reset)"
        Write-Host "$($colors.Yellow)This may require additional troubleshooting steps.$($colors.Reset)"
    }
    
    # Check Docker Desktop
    $dockerInstalled = Test-DockerDesktop
    
    # Check if WSL is installed
    $wslInstalled = Test-WSLInstalled
    
    Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
    Write-Host "$($colors.Bright)$($colors.Cyan)    Choose Troubleshooting Option$($colors.Reset)"
    Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
    Write-Host ""
    Write-Host "$($colors.Yellow)1. Fix WSL Issues (Run all WSL repair scripts)$($colors.Reset)"
    Write-Host "$($colors.Yellow)2. Configure Hyper-V as Docker Backend$($colors.Reset)"
    Write-Host "$($colors.Yellow)3. Create No-Containers Aspire Option$($colors.Reset)"
    Write-Host "$($colors.Yellow)4. Show Alternative Solutions$($colors.Reset)"
    Write-Host "$($colors.Yellow)5. Fix WSL Class Registration Issues (For REGDB_E_CLASSNOTREG errors)$($colors.Reset)"
    Write-Host "$($colors.Yellow)6. Run All Options$($colors.Reset)"
    Write-Host ""
    
    $option = Read-Host "Select an option (1-6)"
    
    if ($option -eq "1" -or $option -eq "6") {
        Write-Host "$($colors.Bright)$($colors.Cyan)Running WSL repair scripts...$($colors.Reset)"
        
        if (-not $wslInstalled) {
            Write-Host "$($colors.Yellow)WSL does not appear to be installed or is not functioning correctly.$($colors.Reset)"
            # Enable required Windows features
            Invoke-Script -ScriptName "Enable-Features.ps1"
        }
        else {
            Write-Host "$($colors.Green)WSL is installed.$($colors.Reset)"
        }
        
        # Fix WSL registry issues
        Invoke-Script -ScriptName "Fix-Registry.ps1"
        
        # Download and install WSL update
        Invoke-Script -ScriptName "Install-WSLUpdate.ps1"
        
        # Set WSL default version
        Invoke-Script -ScriptName "Set-WSLVersion.ps1"
        
        # Reset WSL
        Invoke-Script -ScriptName "Reset-WSL.ps1"
    }
    
    if ($option -eq "2" -or $option -eq "6") {
        Write-Host "$($colors.Bright)$($colors.Cyan)Configuring Hyper-V as alternative...$($colors.Reset)"
        Configure-HyperV
    }
    
    if ($option -eq "3" -or $option -eq "6") {
        Write-Host "$($colors.Bright)$($colors.Cyan)Creating no-containers option for Aspire...$($colors.Reset)"
        Invoke-Script -ScriptName "Create-NoContainers.ps1"
    }
    
    if ($option -eq "4" -or $option -eq "6") {
        Write-Host "$($colors.Bright)$($colors.Cyan)Showing alternative solutions...$($colors.Reset)"
        Show-AlternativeSolutions
    }
    
    if ($option -eq "5" -or $option -eq "6") {
        Write-Host "$($colors.Bright)$($colors.Cyan)Fixing WSL class registration issues...$($colors.Reset)"
        Invoke-Script -ScriptName "Fix-WSLClassRegistration.ps1"
    }
    
    Write-Host ""
    Write-Host "$($colors.Bright)$($colors.Green)WSL troubleshooting completed.$($colors.Reset)"
    Write-Host "$($colors.Yellow)If you continue to experience issues, you may need to restart your computer.$($colors.Reset)"
    Write-Host "$($colors.Yellow)After restarting, try running Docker Desktop again.$($colors.Reset)"
    
    # Suggest Windows Insider Program opt-out if on a very new build
    if ($buildNumber -gt 25000) {
        Write-Host ""
        Write-Host "$($colors.Bright)$($colors.Yellow)You're on a very new Windows build ($buildNumber).$($colors.Reset)"
        Write-Host "$($colors.Yellow)Consider opting out of Windows Insider Program for better stability:$($colors.Reset)"
        Write-Host "$($colors.Cyan)1. Open Settings > Windows Update > Windows Insider Program$($colors.Reset)"
        Write-Host "$($colors.Cyan)2. Click "Stop getting preview builds"$($colors.Reset)"
        Write-Host "$($colors.Cyan)3. Follow the prompts to unenroll your device$($colors.Reset)"
    }
}

# Run the main function
try {
    Start-Troubleshooting
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}