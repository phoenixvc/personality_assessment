#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { runDirectAdmin, colors } = require('./utils');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Repairing WSL Installation${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to run a script
function runScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  console.log(`${colors.blue}Running ${scriptName}...${colors.reset}`);
  
  return new Promise((resolve, reject) => {
    const child = require('child_process').spawn('node', [scriptPath], {
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.log(`${colors.yellow}Script ${scriptName} exited with code ${code}${colors.reset}`);
        resolve(); // Continue with other scripts even if one fails
      }
    });
    
    child.on('error', (err) => {
      console.error(`${colors.red}Error running script: ${err.message}${colors.reset}`);
      resolve(); // Continue with other scripts even if one fails
    });
  });
}

// Function to fix specific registry issues for newer Windows builds
async function fixAdvancedRegistryIssues() {
  console.log(`${colors.yellow}Applying advanced registry fixes for newer Windows builds...${colors.reset}`);
  
  try {
    const tempDir = path.join(os.tmpdir(), 'wsl-fix-advanced');
    const regFixPath = path.join(tempDir, 'wsl-fix-advanced.reg');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Advanced registry fixes for newer Windows builds
    const regContent = `Windows Registry Editor Version 5.00

; Fix WSL class registration issues for newer Windows builds
[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Component Based Servicing\\PackageDetect\\Microsoft-Windows-Subsystem-Linux]
"Visibility"=dword:00000001

; Fix potential COM registration issues
[HKEY_LOCAL_MACHINE\\SOFTWARE\\Classes\\CLSID\\{1C0BECB4-71B4-4383-AEA5-7E1AAA0F6E99}]
@="WSL COM Registration"
"AppID"="{1C0BECB4-71B4-4383-AEA5-7E1AAA0F6E99}"

[HKEY_LOCAL_MACHINE\\SOFTWARE\\Classes\\CLSID\\{1C0BECB4-71B4-4383-AEA5-7E1AAA0F6E99}\\InprocServer32]
@="C:\\\\Windows\\\\System32\\\\wslapi.dll"
"ThreadingModel"="Both"

; Additional WSL settings
[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Lxss]
"DefaultDistribution"="{00000000-0000-0000-0000-000000000000}"
"DefaultVersion"=dword:00000002
`;
    
    fs.writeFileSync(regFixPath, regContent);
    
    // Import the registry fix using a direct command
    console.log(`${colors.yellow}Importing advanced registry fixes...${colors.reset}`);
    await runDirectAdmin(`regedit /s "${regFixPath}"`);
    
    console.log(`${colors.green}Advanced registry fixes applied.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error applying advanced registry fixes: ${error.message}${colors.reset}`);
    return false;
  }
}

// Function to repair Windows components
async function repairWindowsComponents() {
  console.log(`${colors.yellow}Repairing Windows components...${colors.reset}`);
  
  try {
    // Run SFC scan
    console.log(`${colors.yellow}Running System File Checker...${colors.reset}`);
    await runDirectAdmin('sfc /scannow');
    
    // Run DISM health restoration
    console.log(`${colors.yellow}Running DISM to restore health...${colors.reset}`);
    await runDirectAdmin('DISM /Online /Cleanup-Image /RestoreHealth');
    
    console.log(`${colors.green}Windows component repair completed.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error repairing Windows components: ${error.message}${colors.reset}`);
    return false;
  }
}

// Function to check and uninstall problematic KB updates
async function checkProblematicUpdates() {
  console.log(`${colors.yellow}Checking for problematic Windows updates...${colors.reset}`);
  
  try {
    // Get installed updates
    const updates = execSync('wmic qfe list brief').toString();
    
    // List of potentially problematic KB updates for WSL
    const problematicKBs = ['KB5004296', 'KB5004442', 'KB5022282'];
    
    let found = false;
    for (const kb of problematicKBs) {
      if (updates.includes(kb)) {
        console.log(`${colors.red}Found potentially problematic update: ${kb}${colors.reset}`);
        found = true;
        
        // Ask user if they want to uninstall the update
        console.log(`${colors.yellow}To uninstall this update, run the following command as administrator:${colors.reset}`);
        console.log(`${colors.cyan}wusa /uninstall /kb:${kb.replace('KB', '')} /quiet /norestart${colors.reset}`);
      }
    }
    
    if (!found) {
      console.log(`${colors.green}No known problematic updates found.${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error checking for problematic updates: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.bright}${colors.yellow}This script will attempt to repair WSL issues.${colors.reset}`);
  console.log(`${colors.bright}${colors.yellow}Several operations require administrator privileges.${colors.reset}`);
  console.log();
  
  // Check Windows version
  try {
    const versionInfo = execSync('systeminfo | findstr /B /C:"OS Name" /C:"OS Version"').toString();
    console.log(`${colors.blue}Windows version information:${colors.reset}`);
    console.log(versionInfo);
    
    // Extract build number
    const buildMatch = versionInfo.match(/Build (\d+)/);
    if (buildMatch && buildMatch[1]) {
      const buildNumber = parseInt(buildMatch[1], 10);
      const isNewerBuild = buildNumber >= 20000;
      
      if (isNewerBuild) {
        console.log(`${colors.yellow}You're running a newer Windows build (${buildNumber}).${colors.reset}`);
        console.log(`${colors.yellow}This may require additional troubleshooting steps.${colors.reset}`);
        
        // Apply advanced registry fixes for newer Windows builds
        await fixAdvancedRegistryIssues();
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error checking Windows version: ${error.message}${colors.reset}`);
  }
  
  // Fix WSL registry issues
  await runScript('fix-registry.js');
  
  // Check for problematic Windows updates
  await checkProblematicUpdates();
  
  // Repair Windows components
  await repairWindowsComponents();
  
  // Download and install WSL update
  await runScript('install-update.js');
  
  // Set WSL default version
  await runScript('set-version.js');
  
  // Reset WSL
  await runScript('reset-wsl.js');
  
  console.log();
  console.log(`${colors.bright}${colors.green}WSL repair completed.${colors.reset}`);
  console.log(`${colors.yellow}You may need to restart your computer for changes to take effect.${colors.reset}`);
}

// Run the main function
main().catch((error) => {
  console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
  process.exit(1);
});