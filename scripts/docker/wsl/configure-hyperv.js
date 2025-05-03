#!/usr/bin/env node

const { runDirectAdmin, colors } = require('./utils');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}    Configuring Hyper-V for Docker${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}========================================${colors.reset}`);
console.log();

// Function to configure Hyper-V
async function configureHyperV() {
  console.log(`${colors.yellow}Configuring Hyper-V as an alternative to WSL2...${colors.reset}`);
  
  try {
    // Check if Hyper-V is enabled
    let hyperVEnabled = false;
    try {
      const features = execSync('dism /online /get-features | findstr "Hyper-V"').toString();
      hyperVEnabled = features.includes('Enabled');
  } catch (error) {
      console.log(`${colors.yellow}Could not determine Hyper-V status.${colors.reset}`);
  }
    
    if (hyperVEnabled) {
      console.log(`${colors.green}Hyper-V is already enabled.${colors.reset}`);
    } else {
      // Enable Hyper-V feature
      console.log(`${colors.yellow}Enabling Hyper-V feature...${colors.reset}`);
      await runDirectAdmin('DISM.exe /online /enable-feature /featurename:Microsoft-Hyper-V /all /norestart');
      
      // Enable Hyper-V Management Tools
      console.log(`${colors.yellow}Enabling Hyper-V Management Tools...${colors.reset}`);
      await runDirectAdmin('DISM.exe /online /enable-feature /featurename:Microsoft-Hyper-V-Management-Clients /all /norestart');
      await runDirectAdmin('DISM.exe /online /enable-feature /featurename:Microsoft-Hyper-V-Management-PowerShell /all /norestart');
    }
    
    // Create Docker configuration file for Hyper-V
    const dockerConfigDir = path.join(os.homedir(), '.docker');
    const dockerConfigPath = path.join(dockerConfigDir, 'daemon.json');
    
    if (!fs.existsSync(dockerConfigDir)) {
      fs.mkdirSync(dockerConfigDir, { recursive: true });
    }
    
    // Check if config file exists
    let existingConfig = {};
    if (fs.existsSync(dockerConfigPath)) {
      try {
        existingConfig = JSON.parse(fs.readFileSync(dockerConfigPath, 'utf8'));
        console.log(`${colors.yellow}Existing Docker configuration found. Updating...${colors.reset}`);
      } catch (error) {
        console.log(`${colors.yellow}Could not parse existing Docker configuration. Creating new file.${colors.reset}`);
      }
    }
    
    // Docker configuration for Hyper-V - using the exact structure you provided
    const dockerConfig = {
      "builder": {
        "gc": {
          "defaultKeepStorage": "20GB",
          "enabled": true
        }
      },
      "experimental": false,
      "features": {
        "buildkit": true
      },
      "wslEngineEnabled": false
    };
    
    // Write Docker configuration
    fs.writeFileSync(dockerConfigPath, JSON.stringify(dockerConfig, null, 2));
    console.log(`${colors.green}Docker configuration for Hyper-V created at: ${dockerConfigPath}${colors.reset}`);
    
    // Create instructions file
    const instructionsPath = path.join(process.cwd(), 'docker-hyperv-instructions.md');
    const instructions = `# Using Docker with Hyper-V Instead of WSL2

## Configuration Steps

1. **Restart your computer** to complete the Hyper-V installation.

2. **Open Docker Desktop**:
   - Click on the Docker icon in the system tray
   - Select "Settings"
   - Go to "General" tab
   - Uncheck "Use the WSL 2 based engine"
   - Click "Apply & Restart"

3. **If Docker Desktop settings aren't accessible**:
   - The configuration file has been created at: %USERPROFILE%\\.docker\\daemon.json
   - This file is configured to use Hyper-V instead of WSL2
4. **Verify Docker is working**:
   - Open a command prompt
   - Run \`docker info\`
   - Check that it shows "Operating System: windows" rather than "WSL"

## Troubleshooting

If Docker fails to start after switching to Hyper-V:

1. Open Docker Desktop settings
2. Go to "Troubleshoot" tab
3. Click "Clean / Purge data"
4. Restart Docker Desktop

## Notes

- Hyper-V and WSL2 use different virtualization approaches
- Performance characteristics may differ from WSL2
- Container file sharing works differently in Hyper-V mode
`;
    
    fs.writeFileSync(instructionsPath, instructions);
    console.log(`${colors.green}Instructions saved to: ${instructionsPath}${colors.reset}`);
    
    console.log(`${colors.green}Hyper-V configured successfully.${colors.reset}`);
    console.log(`${colors.yellow}A system restart is required for these changes to take effect.${colors.reset}`);
    console.log(`${colors.yellow}After restarting, open Docker Desktop and ensure "Use the WSL 2 based engine" is unchecked in Settings.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error configuring Hyper-V: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run the function and exit
configureHyperV()
  .then(() => {
    console.log(`${colors.green}Hyper-V configuration completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error(`${colors.red}An error occurred: ${error.message}${colors.reset}`);
    process.exit(1);
  });