#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

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
console.log(`${colors.bright}${colors.cyan}    Installing All Dependencies${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to execute a command and return a promise
function executeCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.yellow}Executing: ${command}${colors.reset}`);
    
    const shell = os.platform() === 'win32' ? true : '/bin/bash';
    const shellArgs = os.platform() === 'win32' ? [] : ['-c'];
    
    const childProcess = spawn(
      os.platform() === 'win32' ? 'cmd' : '/bin/bash', 
      os.platform() === 'win32' ? ['/c', command] : ['-c', command], 
      { stdio: 'inherit', shell: true, cwd }
    );
    
    childProcess.on('error', (error) => {
      console.error(`${colors.red}Error executing command: ${error.message}${colors.reset}`);
      reject(error);
    });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`${colors.green}Command completed successfully${colors.reset}`);
        resolve();
      } else {
        console.error(`${colors.red}Command failed with exit code: ${code}${colors.reset}`);
        reject(new Error(`Command failed with exit code: ${code}`));
      }
    });
  });
}

// Main installation function
async function installDependencies() {
  try {
    // 1. Restore .NET packages
    console.log(`${colors.bright}${colors.blue}Restoring .NET packages...${colors.reset}`);
    await executeCommand('dotnet restore aspire/PersonalityFramework.sln');
    
    // 2. Install Web ClientApp dependencies
    const clientAppPath = path.join(process.cwd(), 'aspire/PersonalityFramework.Web/ClientApp');
    
    if (fs.existsSync(clientAppPath)) {
      console.log(`${colors.bright}${colors.blue}Installing Web ClientApp dependencies...${colors.reset}`);
      await executeCommand('npm install', clientAppPath);
    } else {
      console.log(`${colors.red}ClientApp directory not found at: ${clientAppPath}${colors.reset}`);
    }
    
    // 3. Check for any other package.json files in the project
    const webAppPath = path.join(process.cwd(), 'aspire/PersonalityFramework.Web');
    
    if (fs.existsSync(path.join(webAppPath, 'package.json'))) {
      console.log(`${colors.bright}${colors.blue}Installing Web App dependencies...${colors.reset}`);
      await executeCommand('npm install', webAppPath);
    }
    
    console.log();
    console.log(`${colors.bright}${colors.green}All dependencies installed successfully!${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.bright}${colors.red}Failed to install dependencies: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the installation
installDependencies();