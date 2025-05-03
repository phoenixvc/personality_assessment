#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// ANSI color codes for formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    WSL Troubleshooter for Docker${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Check if running on Windows
if (os.platform() !== 'win32') {
  console.log(`${colors.yellow}This script is only for Windows systems. You're running on ${os.platform()}.${colors.reset}`);
  process.exit(1);
}

// Function to run a command with elevated privileges
function runElevated(command, args = []) {
  console.log(`${colors.yellow}Running command with admin privileges: ${command} ${args.join(' ')}${colors.reset}`);
  console.log(`${colors.yellow}If prompted, please allow the User Account Control (UAC) dialog.${colors.reset}`);
  
  const elevatedProcess = spawn('powershell', [
    'Start-Process',
    '-FilePath', command,
    '-ArgumentList', `"${args.join(' ')}"`,
    '-Verb', 'RunAs',
    '-Wait'
  ], {
    shell: true,
    stdio: 'inherit'
  });
  
  return new Promise((resolve, reject) => {
    elevatedProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    elevatedProcess.on('error', (err) => {
      reject(err);
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

// Function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destination, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      reject(err);
    });
  });
}

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
    
    // Install the WSL update package
    await runElevated('msiexec', ['/i', wslUpdatePath, '/quiet']);
    
    console.log(`${colors.green}WSL update installed successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error installing WSL update: ${error.message}${colors.reset}`);
    return false;
  }
}

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
    
    // Import the registry fix
    await runElevated('reg', ['import', regFixPath]);
    
    console.log(`${colors.green}Registry fixes applied.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error fixing registry: ${error.message}${colors.reset}`);
    return false;
  }
}

// Function to enable required Windows features
async function enableWindowsFeatures() {
  console.log(`${colors.yellow}Enabling required Windows features...${colors.reset}`);
  
  try {
    // Enable Virtual Machine Platform
    await runElevated('dism.exe', ['/online', '/enable-feature', '/featurename:VirtualMachinePlatform', '/all', '/norestart']);
    
    // Enable WSL
    await runElevated('dism.exe', ['/online', '/enable-feature', '/featurename:Microsoft-Windows-Subsystem-Linux', '/all', '/norestart']);
    
    console.log(`${colors.green}Windows features enabled successfully.${colors.reset}`);
    console.log(`${colors.yellow}A system restart may be required for these changes to take effect.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error enabling Windows features: ${error.message}${colors.reset}`);
    return false;
  }
}

// Function to reset WSL
async function resetWSL() {
  console.log(`${colors.yellow}Resetting WSL...${colors.reset}`);
  
  try {
    // Reset WSL
    await runElevated('wsl', ['--shutdown']);
    
    console.log(`${colors.green}WSL reset successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error resetting WSL: ${error.message}${colors.reset}`);
    return false;
  }
}

// Function to check and set WSL default version
async function setWSLDefaultVersion() {
  console.log(`${colors.yellow}Setting WSL default version to 2...${colors.reset}`);
  
  try {
    await runElevated('wsl', ['--set-default-version', '2']);
    
    console.log(`${colors.green}WSL default version set to 2.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error setting WSL default version: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.bright}${colors.yellow}This script will attempt to fix WSL issues affecting Docker Desktop.${colors.reset}`);
  console.log(`${colors.bright}${colors.yellow}Several operations require administrator privileges.${colors.reset}`);
  console.log();
  
  // Check if WSL is installed
  const wslInstalled = checkWSLInstalled();
  
  if (!wslInstalled) {
    console.log(`${colors.yellow}WSL does not appear to be installed or is not functioning correctly.${colors.reset}`);
    
    // Enable required Windows features
    await enableWindowsFeatures();
  } else {
    console.log(`${colors.green}WSL is installed.${colors.reset}`);
  }
  
  // Fix WSL registry issues
  await fixWSLRegistry();
  
  // Download and install WSL update
  await downloadAndInstallWSLUpdate();
  
  // Set WSL default version
  await setWSLDefaultVersion();
  
  // Reset WSL
  await resetWSL();
  
  console.log();
  console.log(`${colors.bright}${colors.green}WSL troubleshooting completed.${colors.reset}`);
  console.log(`${colors.yellow}If you continue to experience issues, you may need to restart your computer.${colors.reset}`);
  console.log(`${colors.yellow}After restarting, try running Docker Desktop again.${colors.reset}`);
  console.log();
  console.log(`${colors.bright}${colors.cyan}To run Aspire without containers:${colors.reset}`);
  console.log(`${colors.cyan}npm run start:aspire:no-containers${colors.reset}`);
}

// Run the main function
main().catch((error) => {
  console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
  process.exit(1);
});