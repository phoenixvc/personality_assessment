#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const readline = require('readline');
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

// Function to check if Docker is running
function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Define available commands
const commands = {
  'a': { name: 'Aspire AppHost', command: 'npm run start:aspire', description: 'Run the Aspire AppHost (full application)' },
  'n': { name: 'Aspire (No Containers)', command: 'npm run start:aspire:no-containers', description: 'Run Aspire without containers' },
  'w': { name: 'Web Frontend', command: 'npm run start:web', description: 'Run only the web frontend' },
  'b': { name: 'API Backend', command: 'npm run start:api', description: 'Run only the API backend' },
  'd': { name: 'Start Docker', command: 'npm run start:docker', description: 'Start Docker Desktop' },
  'c': { name: 'Check Docker', command: 'npm run check:docker', description: 'Check Docker status' },
  'i': { name: 'Install Dependencies', command: 'npm run install:all', description: 'Install all dependencies' },
  'x': { name: 'Clean', command: 'npm run clean', description: 'Clean the solution' },
  't': { name: 'Test', command: 'npm run test', description: 'Run all tests' },
  'q': { name: 'Quit', command: null, description: 'Exit the application' }
};

// Print the header
function printHeader() {
  console.clear();
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}    Personality Framework Runner${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
  console.log();
}

// Print Docker status
function printDockerStatus() {
  const dockerRunning = isDockerRunning();
  if (dockerRunning) {
    console.log(`${colors.green}Docker Status: Running ✓${colors.reset}`);
  } else {
    console.log(`${colors.red}Docker Status: Not Running ✗${colors.reset}`);
    console.log(`${colors.yellow}Use option '${colors.green}d${colors.yellow}' to start Docker or '${colors.green}n${colors.yellow}' to run without containers${colors.reset}`);
  }
  console.log();
}

// Print available commands
function printCommands() {
  console.log(`${colors.bright}Available Commands:${colors.reset}`);
  
  Object.entries(commands).forEach(([key, value]) => {
    console.log(`  ${colors.green}${key}${colors.reset} - ${colors.yellow}${value.name}${colors.reset}: ${value.description}`);
  });
  
  console.log();
  console.log(`${colors.bright}Enter a command:${colors.reset}`);
}

// Execute a command
function executeCommand(key) {
  const command = commands[key];
  
  if (!command || !command.command) {
    if (key === 'q') {
      console.log(`${colors.bright}${colors.blue}Exiting...${colors.reset}`);
      process.exit(0);
    }
    console.log(`${colors.red}Invalid command: ${key}${colors.reset}`);
    return;
  }
  
  // Special handling for Aspire with Docker check
  if (key === 'a') {
    if (!isDockerRunning()) {
      console.log(`${colors.yellow}Docker is not running. You have two options:${colors.reset}`);
      console.log(`${colors.cyan}1. Start Docker with option 'd' and then run Aspire${colors.reset}`);
      console.log(`${colors.cyan}2. Run Aspire without containers with option 'n'${colors.reset}`);
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question(`${colors.bright}Do you want to run without containers? (y/n): ${colors.reset}`, (answer) => {
        rl.close();
        
        if (answer.toLowerCase() === 'y') {
          executeCommand('n');
        } else {
          console.log(`${colors.yellow}Please start Docker first with option 'd'${colors.reset}`);
          main();
        }
      });
      
      return;
    }
  }
  
  console.log(`${colors.bright}${colors.blue}Executing: ${command.name}...${colors.reset}`);
  
  // Determine the shell to use based on the platform
  const shell = os.platform() === 'win32' ? true : '/bin/bash';
  const shellArgs = os.platform() === 'win32' ? [] : ['-c'];
  
  const childProcess = spawn(
    os.platform() === 'win32' ? 'cmd' : '/bin/bash', 
    os.platform() === 'win32' ? ['/c', command.command] : ['-c', command.command], 
    { stdio: 'inherit', shell: true }
  );
  
  childProcess.on('error', (error) => {
    console.error(`${colors.red}Error executing command: ${error.message}${colors.reset}`);
  });
  
  childProcess.on('close', (code) => {
    console.log();
    console.log(`${colors.bright}${colors.blue}Command completed with exit code: ${code}${colors.reset}`);
    console.log(`${colors.bright}${colors.blue}Press Enter to return to the menu...${colors.reset}`);
  });
}

// Main function
function main() {
  printHeader();
  printDockerStatus();
  printCommands();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.on('line', (input) => {
    const command = input.trim().toLowerCase();
    
    if (command) {
      if (commands[command]) {
        rl.close();
        executeCommand(command);
      } else {
        console.log(`${colors.red}Invalid command: ${command}${colors.reset}`);
        printCommands();
      }
    } else {
      printHeader();
      printDockerStatus();
      printCommands();
    }
  });
}

// Start the application
main();