# 0. Run All Scripts
# This script runs all migration scripts in sequence

# Configuration
$SCRIPT_DIR = $PSScriptRoot

# Log function
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
}

# Error handling
function Handle-Error {
    param(
        [string]$Message,
        [string]$ScriptName
    )
    Write-Host "ERROR: $Message" -ForegroundColor Red
    
    # Prompt for action
    $choices = @(
        [System.Management.Automation.Host.ChoiceDescription]::new("&Continue", "Continue to the next script")
        [System.Management.Automation.Host.ChoiceDescription]::new("&Retry", "Retry this script")
        [System.Management.Automation.Host.ChoiceDescription]::new("E&xit", "Exit the entire process")
    )
    
    $decision = $Host.UI.PromptForChoice(
        "Script Error",
        "The script '$ScriptName' encountered an error. What would you like to do?",
        $choices,
        2  # Default to Exit
    )
    
    switch ($decision) {
        0 { 
            Write-Log "Continuing to the next script after error in $ScriptName"
            return "continue" 
}
        1 { 
            Write-Log "Retrying script $ScriptName"
            return "retry" 
        }
        2 { 
            Write-Log "Exiting due to error in $ScriptName"
            exit 1 
        }
    }
}

# Prompt to continue
function Prompt-Continue {
    param(
        [string]$NextScript
    )
    
    $choices = @(
        [System.Management.Automation.Host.ChoiceDescription]::new("&Proceed", "Run the next script")
        [System.Management.Automation.Host.ChoiceDescription]::new("&Skip", "Skip the next script")
        [System.Management.Automation.Host.ChoiceDescription]::new("E&xit", "Exit the entire process")
    )
    
    $decision = $Host.UI.PromptForChoice(
        "Next Script",
        "Ready to run script: $NextScript",
        $choices,
        0  # Default to Proceed
    )
    
    switch ($decision) {
        0 { return "proceed" }
        1 { return "skip" }
        2 { 
            Write-Log "User chose to exit the process"
            exit 0 
        }
    }
}

# Main function
function Main {
    Write-Log "Starting complete Aspire + Arc migration..."
    
    # Run all scripts in sequence
    $scripts = @(
        "1-Create-AspireWorkspace.ps1",
        "2-Create-AspireSolution.ps1",
        "3-Create-ApiProject.ps1",
        "4-Create-WebProject.ps1",
        "5-Create-SharedLibrary.ps1",
        "6-Update-AppHost.ps1",
        "7-Create-Infrastructure.ps1",
        "8-Create-CiCd.ps1",
        "9-Create-Documentation.ps1",
        "10-Create-LocalDevSetup.ps1",
        "11-Create-DockerCompose.ps1",
        "12-Create-AzureDeployment.ps1",
        "13-Create-Readme.ps1"
    )
    
    $i = 0
    while ($i -lt $scripts.Count) {
        $script = $scripts[$i]
        $scriptPath = Join-Path $SCRIPT_DIR $script
        
        if (Test-Path $scriptPath) {
            # Prompt before running the script
            $action = Prompt-Continue -NextScript $script
            
            if ($action -eq "skip") {
                Write-Log "Skipping script: $script"
                $i++
                continue
            }
            
            Write-Log "Running script: $script"
            
            try {
                # Execute the script and capture any errors
                $output = & $scriptPath 2>&1
                $lastExitCode = $LASTEXITCODE
                # Create a new PowerShell instance to run the script
                # This ensures we get the proper exit code and output
                $scriptBlock = [ScriptBlock]::Create("& '$scriptPath'")
                $result = Invoke-Command -ScriptBlock $scriptBlock -ErrorVariable scriptError 2>&1
                
                # Output the script's output
                $output | ForEach-Object { $_ }
                $result | ForEach-Object { $_ }
                
                if ($lastExitCode -ne 0) {
                    $action = Handle-Error -Message "Script $script exited with code $lastExitCode" -ScriptName $script
                    
                    switch ($action) {
                        "continue" { $i++ }
                        "retry" { <# Stay on the same script index #> }
                        default { exit 1 }
                    }
                }
                else {
                    Write-Log "Script $script completed successfully."
                    $i++
                }
            }
            catch {
                $errorMessage = $_.Exception.Message
                $action = Handle-Error -Message "Script $script failed with error: $errorMessage" -ScriptName $script
                # Check for errors in the output
                $errorInOutput = $result | Where-Object { $_ -is [System.Management.Automation.ErrorRecord] }
                $errorMessage = $scriptError | ForEach-Object { $_.Exception.Message }
                
                if ($errorInOutput -or $errorMessage) {
                    $errorText = if ($errorMessage) { $errorMessage } else { "Check the output for details" }
                    $action = Handle-Error -Message "Script $script encountered errors: $errorText" -ScriptName $script
                    
                switch ($action) {
                    "continue" { $i++ }
                    "retry" { <# Stay on the same script index #> }
                    default { exit 1 }
                }
            }
        }
        else {
            Write-Log "Warning: Script $script not found. Skipping."
            $i++
                    # Look for success message in the output
                    $successIndicator = $result | Where-Object { 
                        $_ -match "completed successfully" -or 
                        $_ -match "created successfully" -or
                        $_ -match "completed\.$" 
        }
                    
                    if ($successIndicator) {
                        Write-Log "Script $script completed successfully."
                        $i++
    }
                    else {
                        # Ask user if script completed successfully
                        $choices = @(
                            [System.Management.Automation.Host.ChoiceDescription]::new("&Yes", "Script completed successfully")
                            [System.Management.Automation.Host.ChoiceDescription]::new("&No", "Script failed")
                        )
    
    Write-Log "Migration to Aspire + Arc solution completed successfully!"
    Write-Log "The solution is available in the 'aspire-solution' directory."
                        $decision = $Host.UI.PromptForChoice(
                            "Script Completion",
                            "Did script $script complete successfully?",
                            $choices,
                            0  # Default to Yes
                        )
                        
                        if ($decision -eq 0) {
                            Write-Log "User confirmed script $script completed successfully."
                            $i++
}
                        else {
                            $action = Handle-Error -Message "User indicated script $script failed" -ScriptName $script

                            switch ($action) {
                                "continue" { $i++ }
                                "retry" { <# Stay on the same script index #> }
                                default { exit 1 }
                            }
                        }
                    }
                }
            }
            catch {
                $errorMessage = $_.Exception.Message
                $action = Handle-Error -Message "Script $script failed with error: $errorMessage" -ScriptName $script
                
                switch ($action) {
                    "continue" { $i++ }
                    "retry" { <# Stay on the same script index #> }
                    default { exit 1 }
                }
            }
        }
        else {
            Write-Log "Warning: Script $script not found. Skipping."
            $i++
        }
    }
    
    Write-Log "Migration to Aspire + Arc solution completed successfully!"
    Write-Log "The solution is available in the 'aspire-solution' directory."
}

# Execute the script
Main