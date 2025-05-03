#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
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
console.log(`${colors.bright}${colors.cyan}    Checking Docker Status${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to check if Docker is installed
function isDockerInstalled() {
  try {
    const command = os.platform() === 'win32' ? 'where docker' : 'which docker';
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check if Docker is running
function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check Docker Desktop status on Windows
function checkDockerDesktopOnWindows() {
  try {
    // Check if Docker Desktop process is running
    const processes = execSync('tasklist /fi "imagename eq Docker Desktop.exe"', { encoding: 'utf8' });
    return processes.includes('Docker Desktop.exe');
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

// Function to install Docker on Windows
async function installDockerOnWindows() {
  console.log(`${colors.yellow}Starting Docker Desktop installation...${colors.reset}`);
  
  const tempDir = path.join(os.tmpdir(), 'docker-installer');
  const installerPath = path.join(tempDir, 'DockerDesktopInstaller.exe');
  
  try {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    console.log(`${colors.yellow}Downloading Docker Desktop installer...${colors.reset}`);
    
    // Docker Desktop installer URL
    const dockerInstallerUrl = 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe';
    
    await downloadFile(dockerInstallerUrl, installerPath);
    
    console.log(`${colors.green}Download complete. Starting installation...${colors.reset}`);
    console.log(`${colors.yellow}This will launch the Docker Desktop installer. Please follow the on-screen instructions.${colors.reset}`);
    
    // Run the installer
    const child = spawn(installerPath, ['install', '--accept-license'], {
      detached: true,
      stdio: 'inherit'
    });
    
    child.on('error', (err) => {
      console.error(`${colors.red}Failed to start installer: ${err.message}${colors.reset}`);
    });
    
    // Wait for the installer to complete
    await new Promise((resolve) => {
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`${colors.green}Docker Desktop installation completed successfully.${colors.reset}`);
        } else {
          console.log(`${colors.yellow}Docker Desktop installation exited with code ${code}.${colors.reset}`);
          console.log(`${colors.yellow}You may need to complete the installation manually.${colors.reset}`);
        }
        resolve();
      });
    });
    
    console.log(`${colors.yellow}Please restart your computer to complete the Docker Desktop installation.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error installing Docker Desktop: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Please download and install Docker Desktop manually from:${colors.reset}`);
    console.log(`${colors.cyan}https://www.docker.com/products/docker-desktop/${colors.reset}`);
    
    return false;
  }
}

// Function to install Docker on Linux (Ubuntu/Debian)
async function installDockerOnLinux() {
  console.log(`${colors.yellow}Starting Docker installation on Linux...${colors.reset}`);
  
  try {
    // Check if we're on Ubuntu/Debian
    const isUbuntuOrDebian = fs.existsSync('/etc/debian_version');
    
    if (!isUbuntuOrDebian) {
      console.log(`${colors.yellow}Automatic installation is only supported on Ubuntu/Debian.${colors.reset}`);
      console.log(`${colors.yellow}Please follow the official Docker installation guide for your distribution:${colors.reset}`);
      console.log(`${colors.cyan}https://docs.docker.com/engine/install/${colors.reset}`);
      return false;
    }
    
    console.log(`${colors.yellow}This will install Docker using the official Docker script.${colors.reset}`);
    console.log(`${colors.yellow}You may be prompted for your password to run commands with sudo.${colors.reset}`);
    
    // Run the Docker installation script
    await new Promise((resolve, reject) => {
      const child = spawn('bash', ['-c', 'curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh'], {
        stdio: 'inherit',
        shell: true
      });
      
      child.on('error', (err) => {
        reject(err);
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Installation script exited with code ${code}`));
        }
      });
    });
    
    // Add current user to the docker group
    await new Promise((resolve, reject) => {
      const child = spawn('sudo', ['usermod', '-aG', 'docker', os.userInfo().username], {
        stdio: 'inherit'
      });
      
      child.on('error', (err) => {
        reject(err);
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Failed to add user to docker group, exit code ${code}`));
        }
      });
    });
    
    console.log(`${colors.green}Docker installed successfully.${colors.reset}`);
    console.log(`${colors.yellow}You may need to log out and log back in for group changes to take effect.${colors.reset}`);
    
    // Start Docker service
    await new Promise((resolve, reject) => {
      const child = spawn('sudo', ['systemctl', 'start', 'docker'], {
        stdio: 'inherit'
      });
      
      child.on('error', (err) => {
        reject(err);
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Failed to start Docker service, exit code ${code}`));
        }
      });
    });
    
    console.log(`${colors.green}Docker service started.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error installing Docker: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Please install Docker manually following the official guide:${colors.reset}`);
    console.log(`${colors.cyan}https://docs.docker.com/engine/install/${colors.reset}`);
    
    return false;
  }
}

// Function to install Docker on macOS
function installDockerOnMac() {
  console.log(`${colors.yellow}To install Docker on macOS:${colors.reset}`);
  console.log(`${colors.cyan}1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/${colors.reset}`);
  console.log(`${colors.cyan}2. Open the downloaded .dmg file and drag Docker to your Applications folder${colors.reset}`);
  console.log(`${colors.cyan}3. Open Docker from your Applications folder${colors.reset}`);
  
  return false;
}

// Function to prompt for Docker installation
async function promptForDockerInstallation() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question(`${colors.yellow}Docker is not installed. Would you like to install it now? (y/n): ${colors.reset}`, async (answer) => {
      readline.close();
      
      if (answer.toLowerCase() === 'y') {
        let installed = false;
        
        if (os.platform() === 'win32') {
          installed = await installDockerOnWindows();
        } else if (os.platform() === 'linux') {
          installed = await installDockerOnLinux();
        } else if (os.platform() === 'darwin') {
          installed = installDockerOnMac();
        } else {
          console.log(`${colors.red}Unsupported operating system: ${os.platform()}${colors.reset}`);
        }
        
        resolve(installed);
      } else {
        console.log(`${colors.yellow}You can run the application without containers using:${colors.reset}`);
        console.log(`${colors.cyan}npm run start:aspire:no-containers${colors.reset}`);
        resolve(false);
      }
    });
  });
}

// Main function to check Docker status
async function checkDocker() {
  const isInstalled = isDockerInstalled();
  
  if (!isInstalled) {
    console.log(`${colors.red}Docker is not installed or not in PATH.${colors.reset}`);
    
    const installed = await promptForDockerInstallation();
    
    if (!installed) {
      process.exit(1);
    }
    
    // If we get here, Docker was installed, so we should check if it's running
    console.log(`${colors.green}✓ Docker is now installed${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Docker is installed${colors.reset}`);
  }
  
  const isRunning = isDockerRunning();
  
  if (!isRunning) {
    console.log(`${colors.red}Docker is installed but not running.${colors.reset}`);
    
    if (os.platform() === 'win32') {
      const isDockerDesktopRunning = checkDockerDesktopOnWindows();
      
      if (isDockerDesktopRunning) {
        console.log(`${colors.yellow}Docker Desktop is running but the Docker engine is not responding.${colors.reset}`);
        console.log(`${colors.yellow}This might be because Docker Desktop is still starting up or has an issue.${colors.reset}`);
      } else {
        console.log(`${colors.yellow}Docker Desktop is not running. Please start Docker Desktop.${colors.reset}`);
      }
      
      console.log(`${colors.yellow}You can also run the application without containers using:${colors.reset}`);
      console.log(`${colors.cyan}npm run start:aspire:no-containers${colors.reset}`);
    } else {
      console.log(`${colors.yellow}Please start the Docker service:${colors.reset}`);
      console.log(`${colors.cyan}sudo systemctl start docker${colors.reset}`);
      
      console.log(`${colors.yellow}You can also run the application without containers using:${colors.reset}`);
      console.log(`${colors.cyan}npm run start:aspire:no-containers${colors.reset}`);
    }
    
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ Docker is running${colors.reset}`);
  console.log(`${colors.bright}${colors.green}Docker is properly configured and ready to use!${colors.reset}`);
  process.exit(0);
}

// Run the check
checkDocker();