# 4. Create Web Project
# This script creates the Web frontend project in the Aspire solution

# Configuration
$SOLUTION_NAME = "PersonalityFramework"
$WORK_DIR = Join-Path $PWD "aspire-solution"
$SOURCE_WEB_PATH = Join-Path $PWD "ClientApp"  # Adjust this path to your actual web project location
$LOG_FILE = Get-ChildItem -Path $WORK_DIR -Filter "aspire-setup-*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName

# Log function
function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $logMessage = "[$timestamp] $Message"
  Write-Host $logMessage
    
  # Only write to log file if it exists
  if (Test-Path $LOG_FILE) {
    Add-Content -Path $LOG_FILE -Value $logMessage
  }
}

# Error handling
function Handle-Error {
  param([string]$Message)
  Write-Log "ERROR: $Message"
  exit 1
}

# Create Web project
function Create-WebProject {
  Write-Log "Creating Web frontend project..."
    
  # Change to workspace directory
  Set-Location $WORK_DIR
  if (-not $?) { Handle-Error "Failed to change to workspace directory" }
    
  $targetWebPath = Join-Path $WORK_DIR "${SOLUTION_NAME}.Web"
    
  # Create Web directory
  New-Item -ItemType Directory -Path $targetWebPath -Force | Out-Null
  if (-not $?) { Handle-Error "Failed to create Web directory" }
    
  # Check if source Web exists
  if (Test-Path $SOURCE_WEB_PATH) {
    Write-Log "Source Web found at $SOURCE_WEB_PATH"
        
    # Copy existing Web files
    Write-Log "Copying Web files from $SOURCE_WEB_PATH to $targetWebPath"
    Copy-Item -Path "$SOURCE_WEB_PATH\*" -Destination $targetWebPath -Recurse -Force
    if (-not $?) { Handle-Error "Failed to copy Web files" }
  }
  else {
    Write-Log "Source Web not found at $SOURCE_WEB_PATH"
    Write-Log "Creating basic Web project structure..."
        
    # Create basic structure
    New-Item -ItemType Directory -Path "$targetWebPath\public", "$targetWebPath\src" -Force | Out-Null
        
    # Copy package.json and vite.config.ts from the current directory if they exist
    if (Test-Path "package.json") {
      Copy-Item -Path "package.json" -Destination $targetWebPath
      Write-Log "Copied package.json to Web project"
    }
    else {
      # Create basic package.json
      $packageJsonContent = @"
{
  "name": "ocean-personality-dynamics",
  "version": "1.0.0",
  "description": "A web application for OCEAN Personality Dynamics",
  "type": "module",
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "chart.js": "^4.3.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.4.9",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.3.0",
    "@typescript-eslint/parser": "^6.3.0",
    "@vitejs/plugin-react": "^4.0.4",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.46.0",
    "eslint-plugin-react": "^7.33.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.1.6",
    "vite": "^4.4.9"
  }
}
"@
      Set-Content -Path "$targetWebPath\package.json" -Value $packageJsonContent
    }
        
    if (Test-Path "vite.config.ts") {
      Copy-Item -Path "vite.config.ts" -Destination $targetWebPath
      Write-Log "Copied vite.config.ts to Web project"
    }
    else {
      # Create vite.config.ts
      $viteConfigContent = @"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@styles": resolve(__dirname, "./src/styles"),
      "@models": resolve(__dirname, "./src/models")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});
"@
      Set-Content -Path "$targetWebPath\vite.config.ts" -Value $viteConfigContent
    }
        
    # Create basic index.html
    $indexHtmlContent = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Personality Framework</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
"@
    Set-Content -Path "$targetWebPath\public\index.html" -Value $indexHtmlContent
        
    # Create basic React components
    $indexTsxContent = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@
    Set-Content -Path "$targetWebPath\src\index.tsx" -Value $indexTsxContent
        
    $appTsxContent = @"
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Personality Framework</h1>
        <p>
          Personality Assessment and Analysis Platform
        </p>
      </header>
    </div>
  );
}

export default App;
"@
    Set-Content -Path "$targetWebPath\src\App.tsx" -Value $appTsxContent
        
    $appCssContent = @"
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}
"@
    Set-Content -Path "$targetWebPath\src\App.css" -Value $appCssContent
    Set-Content -Path "$targetWebPath\src\index.css" -Value ""
  }
    
  # Create Dockerfile for the web app
  $dockerfilePath = Join-Path $targetWebPath "Dockerfile"
  if (-not (Test-Path $dockerfilePath)) {
    $dockerfileContent = @"
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
"@
    Set-Content -Path $dockerfilePath -Value $dockerfileContent
    Write-Log "Created Dockerfile for Web project"
  }
    
  Write-Log "Web frontend project created successfully."
}

# Main function
function Main {
  Write-Log "Starting Web project creation..."
    
  # Create Web project
  Create-WebProject
    
  Write-Log "Web project creation completed."
}

# Execute the script
Main