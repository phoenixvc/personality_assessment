#!/usr/bin/env node

const { runDirectAdmin, colors } = require('./utils');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Enabling Windows Features for WSL${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to enable required Windows features
async function enableWindowsFeatures() {
  console.log(`${colors.yellow}Enabling required Windows features...${colors.reset}`);
  
  try {
    // Enable Virtual Machine Platform
    console.log(`${colors.yellow}Enabling Virtual Machine Platform...${colors.reset}`);
    await runDirectAdmin('DISM.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart');
    
    // Enable WSL
    console.log(`${colors.yellow}Enabling Windows Subsystem for Linux...${colors.reset}`);
    await runDirectAdmin('DISM.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart');
    
    console.log(`${colors.green}Windows features enabled successfully.${colors.reset}`);
    console.log(`${colors.yellow}A system restart may be required for these changes to take effect.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error enabling Windows features: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run the function and exit
enableWindowsFeatures()
  .then(() => {
    console.log(`${colors.green}Feature enabling process completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });