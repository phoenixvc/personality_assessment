#!/usr/bin/env node

const { runElevated, colors } = require('./utils');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Resetting WSL${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

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

// Run the function and exit
resetWSL()
  .then(() => {
    console.log(`${colors.green}WSL reset completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });