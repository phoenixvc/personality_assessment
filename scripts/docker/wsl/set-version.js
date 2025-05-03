#!/usr/bin/env node

const { runElevated, colors } = require('./utils');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Setting WSL Default Version${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to check and set WSL default version
async function setWSLDefaultVersion() {
  console.log(`${colors.yellow}Setting WSL default version to 2...${colors.reset}`);
  
  try {
    // Set WSL default version
    await runElevated('wsl', ['--set-default-version', '2']);
    
    console.log(`${colors.green}WSL default version set to 2.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error setting WSL default version: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run the function and exit
setWSLDefaultVersion()
  .then(() => {
    console.log(`${colors.green}WSL version setting completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });