# PowerShell script to fix WSL registry issues

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
Write-Host "$($colors.Bright)$($colors.Cyan)    Fixing WSL Registry Settings$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

# Function to fix WSL registry issues
function Repair-WSLRegistry {
    Write-Host "$($colors.Yellow)Attempting to fix WSL registry issues...$($colors.Reset)"
    
    try {
        # Create a temporary registry fix file
        $tempDir = Join-Path -Path $env:TEMP -ChildPath "wsl-fix"
        $regFixPath = Join-Path -Path $tempDir -ChildPath "wsl-fix.reg"
        
        if (-not (Test-Path -Path $tempDir)) {
            New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
        }
        
        # Registry entries to fix common WSL issues
        $regContent = @"
Windows Registry Editor Version 5.00

; Fix WSL class registration issues
[HKEY_CLASSES_ROOT\Installer\Products\8A0F8A56CF0F3B0429584D0D7382DF07]
"ProductName"="Windows Subsystem for Linux Update"
"PackageName"="wsl_update_x64.msi"
"Language"=dword:00000409
"Version"=dword:0100000a
"Assignment"=dword:00000001
"AdvertiseFlags"=dword:00000184
"ProductIcon"=""
"InstanceType"=dword:00000000
"AuthorizedLUAApp"=dword:00000000
"DeploymentFlags"=dword:00000003
"Clients"=hex(7):00,00
"PackageCode"="{44E7EABD-FCC7-4CB2-9C48-9CB0D6D8BDFC}"

; Ensure WSL feature is enabled
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss]
"DefaultDistribution"="{00000000-0000-0000-0000-000000000000}"
"DefaultVersion"=dword:00000002
"@
        
        Set-Content -Path $regFixPath -Value $regContent
        
        # Import the registry fix
        Write-Host "$($colors.Yellow)Importing registry fixes...$($colors.Reset)"
        
        # This requires elevation, so we'll create a script to run elevated
        $elevatedScriptPath = Join-Path -Path $tempDir -ChildPath "import-registry.ps1"
        $elevatedScriptContent = @"
# Import registry file
reg import "$regFixPath"
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
            Write-Host "$($colors.Green)Registry fixes applied.$($colors.Reset)"
        }
        else {
            Write-Host "$($colors.Red)Failed to apply registry fixes. Exit code: $($process.ExitCode)$($colors.Reset)"
        }
        
        return $true
    }
    catch {
        Write-Host "$($colors.Red)Error fixing registry: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Run the function
try {
    $result = Repair-WSLRegistry
    if ($result) {
        Write-Host "$($colors.Green)Registry fixing process completed.$($colors.Reset)"
    }
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}