#!/usr/bin/env node

const { runDirectAdmin, colors } = require('./utils');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Fixing WSL Registry Settings${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to fix WSL registry issues
async function fixWSLRegistry() {
  console.log(`${colors.yellow}Attempting to fix WSL registry issues...${colors.reset}`);
  
  try {
    // Create a temporary registry fix file
    const tempDir = path.join(os.tmpdir(), 'wsl-fix');
    const regFixPath = path.join(tempDir, 'wsl-fix.reg');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Registry entries to fix common WSL issues
    const regContent = `Windows Registry Editor Version 5.00

; Fix WSL class registration issues
[HKEY_CLASSES_ROOT\\Installer\\Products\\8A0F8A56CF0F3B0429584D0D7382DF07]
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
[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Lxss]
"DefaultDistribution"="{00000000-0000-0000-0000-000000000000}"
"DefaultVersion"=dword:00000002
`;
    
    fs.writeFileSync(regFixPath, regContent);
    
    // Import the registry fix using a direct command
    console.log(`${colors.yellow}Importing registry fixes...${colors.reset}`);
    await runDirectAdmin(`regedit /s "${regFixPath}"`);
    
    console.log(`${colors.green}Registry fixes applied.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error fixing registry: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run the function and exit
fixWSLRegistry()
  .then(() => {
    console.log(`${colors.green}Registry fixing process completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });