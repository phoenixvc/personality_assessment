# PowerShell script to configure Hyper-V for Docker Desktop

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
Write-Host "$($colors.Bright)$($colors.Cyan)    Configuring Hyper-V for Docker$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "$($colors.Red)This script needs to be run as Administrator. Please restart PowerShell as Administrator.$($colors.Reset)"
    exit 1
}

# Function to configure Hyper-V
function Configure-HyperV {
    Write-Host "$($colors.Yellow)Configuring Hyper-V as an alternative to WSL2...$($colors.Reset)"
    
    try {
        # Check if Hyper-V is enabled
        $hyperVFeature = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V
        
        if ($hyperVFeature.State -eq "Enabled") {
            Write-Host "$($colors.Green)Hyper-V is already enabled.$($colors.Reset)"
        }
        else {
            # Enable Hyper-V feature
            Write-Host "$($colors.Yellow)Enabling Hyper-V feature...$($colors.Reset)"
            Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All -NoRestart
            
            # Enable Hyper-V Management Tools
            Write-Host "$($colors.Yellow)Enabling Hyper-V Management Tools...$($colors.Reset)"
            Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-Management-Clients -All -NoRestart
            Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-Management-PowerShell -All -NoRestart
        }
        
        # Create Docker configuration file for Hyper-V
        $dockerConfigDir = Join-Path -Path $env:USERPROFILE -ChildPath ".docker"
        $dockerConfigPath = Join-Path -Path $dockerConfigDir -ChildPath "daemon.json"
        
        if (-not (Test-Path -Path $dockerConfigDir)) {
            New-Item -Path $dockerConfigDir -ItemType Directory -Force | Out-Null
        }
        
        # Docker configuration for Hyper-V - using the exact structure you provided
        $dockerConfig = @{
            "builder"          = @{
                "gc" = @{
                    "defaultKeepStorage" = "20GB"
                    "enabled"            = $true
                }
            }
            "experimental"     = $false
            "features"         = @{
                "buildkit" = $true
            }
            "wslEngineEnabled" = $false
        }
        
        # Write Docker configuration
        $dockerConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $dockerConfigPath
        Write-Host "$($colors.Green)Docker configuration for Hyper-V created at: $dockerConfigPath$($colors.Reset)"
        
        # Create instructions file
        $instructionsPath = Join-Path -Path (Get-Location) -ChildPath "docker-hyperv-instructions.md"
        $instructions = @"
# Using Docker with Hyper-V Instead of WSL2

## Configuration Steps

1. **Restart your computer** to complete the Hyper-V installation.

2. **Open Docker Desktop**:
   - Click on the Docker icon in the system tray
   - Select "Settings"
   - Go to "General" tab
   - Uncheck "Use the WSL 2 based engine"
   - Click "Apply & Restart"

3. **If Docker Desktop settings aren't accessible**:
   - The configuration file has been created at: %USERPROFILE%\.docker\daemon.json
   - This file is configured to use Hyper-V instead of WSL2

4. **Verify Docker is working**:
   - Open a command prompt
   - Run `docker info`
   - Check that it shows "Operating System: windows" rather than "WSL"

## Troubleshooting

If Docker fails to start after switching to Hyper-V:

1. Open Docker Desktop settings
2. Go to "Troubleshoot" tab
3. Click "Clean / Purge data"
4. Restart Docker Desktop

## Notes

- Hyper-V and WSL2 use different virtualization approaches
- Performance characteristics may differ from WSL2
- Container file sharing works differently in Hyper-V mode
"@
        
        Set-Content -Path $instructionsPath -Value $instructions
        Write-Host "$($colors.Green)Instructions saved to: $instructionsPath$($colors.Reset)"
        
        Write-Host "$($colors.Green)Hyper-V configured successfully.$($colors.Reset)"
        Write-Host "$($colors.Yellow)A system restart is required for these changes to take effect.$($colors.Reset)"
        Write-Host "$($colors.Yellow)After restarting, open Docker Desktop and ensure 'Use the WSL 2 based engine' is unchecked in Settings.$($colors.Reset)"
        
        return $true
    }
    catch {
        Write-Host "$($colors.Red)Error configuring Hyper-V: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Run the function
try {
    $result = Configure-HyperV
    
    if ($result) {
        Write-Host "$($colors.Green)Hyper-V configuration completed.$($colors.Reset)"
        
        # Ask if the user wants to restart now
        $restartNow = Read-Host "Do you want to restart your computer now to complete the setup? (y/n)"
        if ($restartNow -eq "y" -or $restartNow -eq "Y") {
            Write-Host "$($colors.Yellow)Restarting computer in 10 seconds...$($colors.Reset)"
            Start-Sleep -Seconds 10
            Restart-Computer -Force
        }
        else {
            Write-Host "$($colors.Yellow)Please remember to restart your computer later to complete the Hyper-V setup.$($colors.Reset)"
        }
    }
    else {
        Write-Host "$($colors.Red)Hyper-V configuration failed.$($colors.Reset)"
        exit 1
    }
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}