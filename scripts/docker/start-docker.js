#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

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
console.log(`${colors.bright}${colors.cyan}    Starting Docker Desktop${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to check if Docker is running
function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to find Docker Desktop path on Windows
function findDockerDesktopPath() {
  const commonPaths = [
    path.join(process.env['ProgramFiles'], 'Docker', 'Docker', 'Docker Desktop.exe'),
    path.join(process.env['ProgramFiles'], 'Docker Desktop', 'Docker Desktop.exe'),
    path.join(process.env['ProgramFiles(x86)'], 'Docker', 'Docker', 'Docker Desktop.exe'),
    path.join(process.env['ProgramFiles(x86)'], 'Docker Desktop', 'Docker Desktop.exe'),
    path.join(process.env['LocalAppData'], 'Docker', 'Docker', 'Docker Desktop.exe')
  ];

  for (const p of commonPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}

// Function to start Docker Desktop on Windows
function startDockerDesktopOnWindows() {
  const dockerPath = findDockerDesktopPath();
  
  if (!dockerPath) {
    console.log(`${colors.red}Could not find Docker Desktop executable.${colors.reset}`);
    console.log(`${colors.yellow}Please make sure Docker Desktop is installed.${colors.reset}`);
    console.log(`${colors.yellow}You can install it by running:${colors.reset}`);
    console.log(`${colors.cyan}npm run docker:install${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.blue}Found Docker Desktop at: ${dockerPath}${colors.reset}`);
  console.log(`${colors.yellow}Starting Docker Desktop...${colors.reset}`);
  
  try {
    const child = spawn(dockerPath, [], {
      detached: true,
      stdio: 'ignore'
    });
    
    child.unref();
    
    console.log(`${colors.green}Docker Desktop is starting. This may take a minute...${colors.reset}`);
    console.log(`${colors.yellow}Please wait until the Docker Desktop icon in the taskbar shows it's ready.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.log(`${colors.red}Failed to start Docker Desktop: ${error.message}${colors.reset}`);
    return false;
  }
}

// Function to start Docker on Linux
function startDockerOnLinux() {
  console.log(`${colors.yellow}Attempting to start Docker service...${colors.reset}`);
  
  try {
    execSync('sudo systemctl start docker', { stdio: 'inherit' });
    console.log(`${colors.green}Docker service started successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}Failed to start Docker service: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}You may need to manually start Docker with:${colors.reset}`);
    console.log(`${colors.cyan}sudo systemctl start docker${colors.reset}`);
    return false;
  }
}

// Function to check Docker status periodically
function checkDockerStatus() {
  console.log(`${colors.yellow}Checking if Docker is ready...${colors.reset}`);
  
  let attempts = 0;
  const maxAttempts = 30; // Check for up to 5 minutes (30 * 10 seconds)
  
  const checkInterval = setInterval(() => {
    attempts++;
    
    if (isDockerRunning()) {
      clearInterval(checkInterval);
      console.log(`${colors.green}Docker is now running and ready!${colors.reset}`);
      console.log();
      console.log(`${colors.bright}${colors.green}You can now run:${colors.reset}`);
      console.log(`${colors.cyan}npm run start:aspire${colors.reset}`);
      process.exit(0);
    } else {
      process.stdout.write('.');
      
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.log();
        console.log(`${colors.yellow}Docker is still not ready after ${maxAttempts * 10} seconds.${colors.reset}`);
        console.log(`${colors.yellow}You may need to check Docker Desktop status manually.${colors.reset}`);
        console.log();
        console.log(`${colors.bright}${colors.yellow}To run without Docker containers:${colors.reset}`);
        console.log(`${colors.cyan}npm run start:aspire:no-containers${colors.reset}`);
        process.exit(1);
      }
    }
  }, 10000); // Check every 10 seconds
}

// Main function
function main() {
  if (isDockerRunning()) {
    console.log(`${colors.green}Docker is already running.${colors.reset}`);
    process.exit(0);
  }
  
  let started = false;
  
  if (os.platform() === 'win32') {
    started = startDockerDesktopOnWindows();
  } else if (os.platform() === 'linux') {
    started = startDockerOnLinux();
  } else if (os.platform() === 'darwin') {
    console.log(`${colors.yellow}On macOS, please start Docker Desktop manually from the Applications folder.${colors.reset}`);
  } else {
    console.log(`${colors.red}Unsupported operating system: ${os.platform()}${colors.reset}`);
  }
  
  if (started) {
    console.log();
    console.log(`${colors.yellow}Waiting for Docker to become ready...${colors.reset}`);
    checkDockerStatus();
  } else {
    console.log();
    console.log(`${colors.bright}${colors.yellow}To run without Docker containers:${colors.reset}`);
    console.log(`${colors.cyan}npm run start:aspire:no-containers${colors.reset}`);
    process.exit(1);
  }
}

// Run the main function
main();