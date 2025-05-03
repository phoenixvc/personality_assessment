#!/usr/bin/env node

const { runDirectAdmin, downloadFile, colors } = require('./utils');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Installing WSL Update Package${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to download and install WSL update manually
async function downloadAndInstallWSLUpdate() {
  console.log(`${colors.yellow}Downloading WSL update package manually...${colors.reset}`);
  
  const tempDir = path.join(os.tmpdir(), 'wsl-update');
  const wslUpdatePath = path.join(tempDir, 'wslupdate.msi');
  
  try {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Download the WSL update package
    const wslUpdateUrl = 'https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi';
    
    await downloadFile(wslUpdateUrl, wslUpdatePath);
    
    console.log(`${colors.green}Download complete. Installing WSL update...${colors.reset}`);
    
    // Install the WSL update package using a direct admin command
    await runDirectAdmin(`msiexec /i "${wslUpdatePath}" /quiet`);
    
    console.log(`${colors.green}WSL update installed successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error installing WSL update: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run the function and exit
downloadAndInstallWSLUpdate()
  .then(() => {
    console.log(`${colors.green}WSL update installation completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });