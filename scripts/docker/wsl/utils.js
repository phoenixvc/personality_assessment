// Common utility functions for WSL troubleshooting scripts
const { spawn, execSync, exec } = require('child_process');
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

// Function to run a command directly (without elevation)
function runCommand(command, args = []) {
  const cmdString = `${command} ${args.join(' ')}`;
  console.log(`${colors.yellow}Running command: ${cmdString}${colors.reset}`);
  
  try {
    execSync(cmdString, { stdio: 'inherit' });
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error(`Command failed with exit code: ${error.status}`));
  }
}

// Function to run an elevated command using a simpler approach
function runElevated(command, args = []) {
  const cmdString = `${command} ${args.join(' ')}`;
  console.log(`${colors.yellow}Running command with admin privileges: ${cmdString}${colors.reset}`);
  console.log(`${colors.yellow}If prompted, please allow the User Account Control (UAC) dialog.${colors.reset}`);
  
  return new Promise((resolve, reject) => {
    // For Windows, use runas to elevate privileges
    const elevatedCmd = `powershell -Command "Start-Process '${command}' -ArgumentList '${args.join(' ')}' -Verb RunAs -Wait"`;
    
    exec(elevatedCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}Execution error: ${error}${colors.reset}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`${colors.yellow}Command stderr: ${stderr}${colors.reset}`);
      }
      
      if (stdout) {
        console.log(`${colors.green}Command output: ${stdout}${colors.reset}`);
      }
      
      resolve();
    });
  });
}

// Function to run a direct admin command with a simpler approach
function runDirectAdmin(fullCommand) {
  console.log(`${colors.yellow}Running admin command: ${fullCommand}${colors.reset}`);
  console.log(`${colors.yellow}If prompted, please allow the User Account Control (UAC) dialog.${colors.reset}`);
  
  return new Promise((resolve, reject) => {
    // Escape quotes in the command for PowerShell
    const escapedCommand = fullCommand.replace(/"/g, '\\"');
    
    // Use PowerShell to run the command with elevation
    const elevatedCmd = `powershell -Command "Start-Process powershell -ArgumentList '-Command \\"${escapedCommand}\\"' -Verb RunAs -Wait"`;
    
    exec(elevatedCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}Execution error: ${error}${colors.reset}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`${colors.yellow}Command stderr: ${stderr}${colors.reset}`);
      }
      
      if (stdout) {
        console.log(`${colors.green}Command output: ${stdout}${colors.reset}`);
      }
      
      resolve();
    });
  });
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

module.exports = {
  colors,
  runCommand,
  runElevated,
  runDirectAdmin,
  downloadFile
};