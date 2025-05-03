#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { colors } = require('./utils');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Enhanced WSL Troubleshooter for Docker${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Check if running on Windows
if (os.platform() !== 'win32') {
  console.log(`${colors.yellow}This script is only for Windows systems. You're running on ${os.platform()}.${colors.reset}`);
  process.exit(1);
}

// Function to run a script
function runScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  console.log(`${colors.blue}Running ${scriptName}...${colors.reset}`);
  
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], {
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

// Function to check if WSL is installed
function checkWSLInstalled() {
  try {
    execSync('wsl --status', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check Windows version
function checkWindowsVersion() {
  try {
    const versionInfo = execSync('systeminfo | findstr /B /C:"OS Name" /C:"OS Version"').toString();
    console.log(`${colors.blue}Windows version information:${colors.reset}`);
    console.log(versionInfo);
    
    // Extract build number
    const buildMatch = versionInfo.match(/Build (\d+)/);
    if (buildMatch && buildMatch[1]) {
      return parseInt(buildMatch[1], 10);
  }
    return 0;
  } catch (error) {
    console.error(`${colors.red}Error checking Windows version: ${error.message}${colors.reset}`);
    return 0;
  }
}
  
// Function to check Docker Desktop status
function checkDockerDesktop() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
    console.log(`${colors.green}Docker CLI is installed.${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.yellow}Docker CLI not found or not in PATH.${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.bright}${colors.yellow}This script will attempt to fix WSL issues affecting Docker Desktop.${colors.reset}`);
  console.log(`${colors.bright}${colors.yellow}Several operations require administrator privileges.${colors.reset}`);
  console.log();
  
  // Check Windows version
  const buildNumber = checkWindowsVersion();
  const isNewerBuild = buildNumber >= 20000;
  
  if (isNewerBuild) {
    console.log(`${colors.yellow}You're running a newer Windows build (${buildNumber}).${colors.reset}`);
    console.log(`${colors.yellow}This may require additional troubleshooting steps.${colors.reset}`);
  }
  
  // Check Docker Desktop
  const dockerInstalled = checkDockerDesktop();
  
  // Check if WSL is installed
  const wslInstalled = checkWSLInstalled();
  
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}    Choose Troubleshooting Option${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log();
  console.log(`${colors.yellow}1. Fix WSL Issues (Run all WSL repair scripts)${colors.reset}`);
  console.log(`${colors.yellow}2. Configure Hyper-V as Docker Backend${colors.reset}`);
  console.log(`${colors.yellow}3. Create No-Containers Aspire Option${colors.reset}`);
  console.log(`${colors.yellow}4. Run All Options${colors.reset}`);
  console.log();

  // In a real interactive environment, we would get user input here
  // For this script, we'll default to option 4 (run all)
  const option = 4;
  
  if (option === 1 || option === 4) {
    console.log(`${colors.bright}${colors.cyan}Running WSL repair scripts...${colors.reset}`);
    
    if (!wslInstalled) {
      console.log(`${colors.yellow}WSL does not appear to be installed or is not functioning correctly.${colors.reset}`);
      // Enable required Windows features
      await runScript('enable-features.js');
    } else {
      console.log(`${colors.green}WSL is installed.${colors.reset}`);
    }
    
    // Run WSL repair script
    await runScript('repair-wsl.js');
  }
  
  if (option === 2 || option === 4) {
    console.log(`${colors.bright}${colors.cyan}Configuring Hyper-V as alternative...${colors.reset}`);
    await runScript('configure-hyperv.js');
  }
  
  if (option === 3 || option === 4) {
    console.log(`${colors.bright}${colors.cyan}Creating no-containers option for Aspire...${colors.reset}`);
    await runScript('create-no-containers.js');
  }
  
  console.log();
  console.log(`${colors.bright}${colors.green}WSL troubleshooting completed.${colors.reset}`);
  console.log(`${colors.yellow}If you continue to experience issues, you may need to restart your computer.${colors.reset}`);
  console.log(`${colors.yellow}After restarting, try running Docker Desktop again.${colors.reset}`);
  
  // Suggest Windows Insider Program opt-out if on a very new build
  if (buildNumber > 25000) {
    console.log();
    console.log(`${colors.bright}${colors.yellow}You're on a very new Windows build (${buildNumber}).${colors.reset}`);
    console.log(`${colors.yellow}Consider opting out of Windows Insider Program for better stability:${colors.reset}`);
    console.log(`${colors.cyan}1. Open Settings > Windows Update > Windows Insider Program${colors.reset}`);
    console.log(`${colors.cyan}2. Click "Stop getting preview builds"${colors.reset}`);
    console.log(`${colors.cyan}3. Follow the prompts to unenroll your device${colors.reset}`);
  }
}

// Run the main function
main().catch((error) => {
  console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
  process.exit(1);
});