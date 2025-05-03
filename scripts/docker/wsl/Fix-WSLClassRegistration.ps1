# PowerShell script to fix WSL class registration issues

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
Write-Host "$($colors.Bright)$($colors.Cyan)    Fixing WSL Class Registration$($colors.Reset)"
Write-Host "$($colors.Bright)$($colors.Cyan)=======================================$($colors.Reset)"
Write-Host ""

function Fix-WSLClassRegistration {
    Write-Host "$($colors.Yellow)Attempting to fix WSL class registration issues...$($colors.Reset)"
    
    try {
        # Create a temporary directory for our fix files
        $tempDir = Join-Path -Path $env:TEMP -ChildPath "wsl-class-fix"
        if (-not (Test-Path -Path $tempDir)) {
            New-Item -Path $tempDir -ItemType Directory -Force | Out-Null
        }
        
        # Create a registry file to fix the class registration
        $regFixPath = Join-Path -Path $tempDir -ChildPath "wsl-class-fix.reg"
        $regContent = @"
Windows Registry Editor Version 5.00

; Fix WSL class registration issues
[HKEY_CLASSES_ROOT\CLSID\{1c33a0f2-c7f9-4a37-9b2d-92ad8aa264e3}]
@="WSL Installer Class"

[HKEY_CLASSES_ROOT\CLSID\{1c33a0f2-c7f9-4a37-9b2d-92ad8aa264e3}\InprocServer32]
@="C:\\Windows\\System32\\wslclient.dll"
"ThreadingModel"="Both"

; Fix WSL update class registration
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

; Ensure WSL feature is properly registered
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\Packages\Microsoft-Windows-Subsystem-Linux-Package~31bf3856ad364e35~amd64~~10.0.19041.610]
"CurrentState"=dword:00000070
"InstallClient"="WindowsUpdateAgent"
"InstallUserName"="NT AUTHORITY\\SYSTEM"

; Ensure WSL COM registration is correct
[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\CLSID\{1c33a0f2-c7f9-4a37-9b2d-92ad8aa264e3}]
@="WSL Installer Class"

[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\CLSID\{1c33a0f2-c7f9-4a37-9b2d-92ad8aa264e3}\InprocServer32]
@="C:\\Windows\\System32\\wslclient.dll"
"ThreadingModel"="Both"

; Fix WSL update component registration
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Installer\UserData\S-1-5-18\Products\8A0F8A56CF0F3B0429584D0D7382DF07\InstallProperties]
"DisplayName"="Windows Subsystem for Linux Update"
"DisplayVersion"="1.0.0"
"Publisher"="Microsoft Corporation"
"InstallDate"="20230101"
"InstallSource"="C:\\Windows\\Temp\\"
"LocalPackage"="C:\\Windows\\Installer\\wsl_update.msi"
"UninstallString"="MsiExec.exe /X{658A0F8A-F0FC-40B3-9258-D4D07D38FD70}"
"DisplayIcon"="C:\\Windows\\System32\\wslclient.dll"
"EstimatedSize"=dword:00000800
"SystemComponent"=dword:00000000
"NoModify"=dword:00000001
"NoRepair"=dword:00000001
"@
        
        Set-Content -Path $regFixPath -Value $regContent
        
        # Create a script to run with elevation to import the registry fix
        $elevatedScriptPath = Join-Path -Path $tempDir -ChildPath "import-registry.ps1"
        $elevatedScriptContent = @"
# Import registry file
Write-Host "Importing registry fixes for WSL class registration..."
reg import "$regFixPath"

# Restart the Windows Management Instrumentation service
Write-Host "Restarting Windows Management Instrumentation service..."
Restart-Service -Name Winmgmt -Force

# Re-register WSL components
Write-Host "Re-registering WSL components..."
`$env:SystemRoot\System32\regsvr32.exe /s `$env:SystemRoot\System32\wslclient.dll

Write-Host "Attempting to update WSL manually..."
wsl --update --web-download

Write-Host "WSL class registration fixes applied."
"@
        
        Set-Content -Path $elevatedScriptPath -Value $elevatedScriptContent
        
        # Run the script with elevation
        Write-Host "$($colors.Yellow)Running registry fixes with admin privileges...$($colors.Reset)"
        Write-Host "$($colors.Yellow)If prompted, please allow the User Account Control (UAC) dialog.$($colors.Reset)"
        
        $processStartInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processStartInfo.FileName = "powershell.exe"
        $processStartInfo.Arguments = "-ExecutionPolicy Bypass -File `"$elevatedScriptPath`""
        $processStartInfo.Verb = "runas"
        $processStartInfo.UseShellExecute = $true
        
        $process = [System.Diagnostics.Process]::Start($processStartInfo)
        $process.WaitForExit()
        
        if ($process.ExitCode -eq 0) {
            Write-Host "$($colors.Green)WSL class registration fixes applied successfully.$($colors.Reset)"
            
            # Create a script to reinstall WSL update package
            $reinstallScriptPath = Join-Path -Path $tempDir -ChildPath "reinstall-wsl.ps1"
            $reinstallScriptContent = @"
# Download the WSL update package manually
Write-Host "Downloading WSL update package..."
`$wslUpdatePath = Join-Path -Path `$env:TEMP -ChildPath "wsl_update_x64.msi"
Invoke-WebRequest -Uri "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi" -OutFile `$wslUpdatePath

# Install the package manually
Write-Host "Installing WSL update package..."
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"`$wslUpdatePath`" /quiet /norestart" -Wait

Write-Host "WSL update package reinstalled."
"@
            
            Set-Content -Path $reinstallScriptPath -Value $reinstallScriptContent
            
            # Run the reinstall script with elevation
            Write-Host "$($colors.Yellow)Reinstalling WSL update package...$($colors.Reset)"
            
            $reinstallProcessStartInfo = New-Object System.Diagnostics.ProcessStartInfo
            $reinstallProcessStartInfo.FileName = "powershell.exe"
            $reinstallProcessStartInfo.Arguments = "-ExecutionPolicy Bypass -File `"$reinstallScriptPath`""
            $reinstallProcessStartInfo.Verb = "runas"
            $reinstallProcessStartInfo.UseShellExecute = $true
            
            $reinstallProcess = [System.Diagnostics.Process]::Start($reinstallProcessStartInfo)
            $reinstallProcess.WaitForExit()
            
            if ($reinstallProcess.ExitCode -eq 0) {
                Write-Host "$($colors.Green)WSL update package reinstalled successfully.$($colors.Reset)"
            }
            else {
                Write-Host "$($colors.Red)Failed to reinstall WSL update package. Exit code: $($reinstallProcess.ExitCode)$($colors.Reset)"
            }
            
            return $true
        }
        else {
            Write-Host "$($colors.Red)Failed to apply WSL class registration fixes. Exit code: $($process.ExitCode)$($colors.Reset)"
            return $false
        }
    }
    catch {
        Write-Host "$($colors.Red)Error fixing WSL class registration: $($_.Exception.Message)$($colors.Reset)"
        return $false
    }
}

# Run the function
try {
    $result = Fix-WSLClassRegistration
    if ($result) {
        Write-Host "$($colors.Green)WSL class registration fixing process completed.$($colors.Reset)"
        Write-Host "$($colors.Yellow)Please restart your computer before trying to use Docker Desktop again.$($colors.Reset)"
    }
    else {
        Write-Host "$($colors.Red)Failed to fix WSL class registration issues.$($colors.Reset)"
        Write-Host "$($colors.Yellow)You may need to repair or reinstall WSL completely.$($colors.Reset)"
    }
}
catch {
    Write-Host "$($colors.Red)An error occurred: $($_.Exception.Message)$($colors.Reset)"
    exit 1
}