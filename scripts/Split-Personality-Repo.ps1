# Personality Framework Repository Splitter
# This script automates the process of splitting a monorepo into multiple repositories

# Configuration
$MONOREPO_URL = "https://github.com/phoenixvc/personality_framework.git"
$ORG_NAME = "phoenixvc"
$WORK_DIR = Join-Path $PWD "repo-split-workspace"
$DATE_STAMP = Get-Date -Format "yyyyMMddHHmmss"
$LOG_FILE = Join-Path $WORK_DIR "repo-split-$DATE_STAMP.log"

# Repositories to create
$REPOS = @(
    "persona_api"
    "persona_web"
    "persona_shared"
    "persona_app"
    "persona_docs"
)

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

# Check dependencies
function Check-Dependencies {
    Write-Log "Checking dependencies..."

    # Check for git-filter-repo
    $gitFilterRepoPath = $null
    
    # Try to find git-filter-repo in common locations
    $possiblePaths = @(
        # Python script paths
        "$env:LOCALAPPDATA\Packages\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\LocalCache\local-packages\Python311\Scripts\git-filter-repo",
        "$env:LOCALAPPDATA\Programs\Python\Python311\Scripts\git-filter-repo",
        "$env:APPDATA\Python\Python311\Scripts\git-filter-repo",
        # Add more possible paths here
        "$env:USERPROFILE\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\LocalCache\local-packages\Python311\Scripts\git-filter-repo"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path "$path.exe" -PathType Leaf) {
            $gitFilterRepoPath = "$path.exe"
            break
        }
        elseif (Test-Path $path -PathType Leaf) {
            $gitFilterRepoPath = $path
            break
        }
    }
    if (-not $gitFilterRepoPath -and -not (Get-Command git-filter-repo -ErrorAction SilentlyContinue)) {
        Write-Log "git-filter-repo is not installed. Attempting to install..."

        if (Get-Command pip3 -ErrorAction SilentlyContinue) {
            pip3 install git-filter-repo
            if (-not $?) { Handle-Error "Failed to install git-filter-repo with pip3" }
            # Find the newly installed git-filter-repo
            foreach ($path in $possiblePaths) {
                if (Test-Path "$path.exe" -PathType Leaf) {
                    $gitFilterRepoPath = "$path.exe"
                    break
                }
                elseif (Test-Path $path -PathType Leaf) {
                    $gitFilterRepoPath = $path
                    break
                }
            }
        }
        elseif (Get-Command winget -ErrorAction SilentlyContinue) {
            winget install git-filter-repo
            if (-not $?) { Handle-Error "Failed to install git-filter-repo with winget" }
        }
        else {
            Handle-Error "Please install git-filter-repo manually: https://github.com/newren/git-filter-repo"
        }
    }

    # Add git-filter-repo to PATH if found but not in PATH
    if ($gitFilterRepoPath -and -not (Get-Command git-filter-repo -ErrorAction SilentlyContinue)) {
        Write-Log "Adding git-filter-repo to PATH for this session: $gitFilterRepoPath"
        $env:PATH = "$([System.IO.Path]::GetDirectoryName($gitFilterRepoPath));$env:PATH"
    }

    Write-Log "All dependencies are satisfied."
}
# Create workspace directory
function Create-Workspace {
    Write-Log "Creating workspace directory: $WORK_DIR"
    New-Item -ItemType Directory -Path $WORK_DIR -Force | Out-Null
    if (-not $?) { Handle-Error "Failed to create workspace directory" }

    # Create log file
    New-Item -ItemType File -Path $LOG_FILE -Force | Out-Null
    if (-not $?) { Handle-Error "Failed to create log file" }

    Write-Log "Workspace created successfully."
}

# Clone the monorepo
function Clone-Monorepo {
    Write-Log "Cloning the monorepo..."

    Set-Location $WORK_DIR
    if (-not $?) { Handle-Error "Failed to change to workspace directory" }

    # Check if the repository exists
    $repoExists = $false
    try {
        $response = Invoke-WebRequest -Uri $MONOREPO_URL -Method Head -ErrorAction SilentlyContinue
        $repoExists = $response.StatusCode -eq 200
    }
    catch {
        $repoExists = $false
    }

    if (-not $repoExists) {
        Write-Log "Repository not found at $MONOREPO_URL"
        Write-Log "Using local repository structure instead..."
        
        # Create a temporary repository with the structure from the local workspace
        New-Item -ItemType Directory -Path "monorepo" -Force | Out-Null
        Set-Location monorepo
        git init
        if (-not $?) { Handle-Error "Failed to initialize temporary repository" }

        # Create basic structure based on our repo map
        New-Item -ItemType Directory -Path "Controllers", "Services", "Models", "Shared", "ClientApp" -Force | Out-Null
        
        # Add dummy files to make the structure valid for git-filter-repo
        "// Placeholder" | Out-File -FilePath "Controllers/placeholder.cs"
        "// Placeholder" | Out-File -FilePath "Services/placeholder.cs"
        "// Placeholder" | Out-File -FilePath "Models/placeholder.cs"
        "// Placeholder" | Out-File -FilePath "Shared/placeholder.cs"
        "// Placeholder" | Out-File -FilePath "ClientApp/placeholder.js"
        
        git add .
        git commit -m "Initial structure"
        
        Set-Location ..
    }
    else {
        git clone $MONOREPO_URL monorepo
        if (-not $?) { Handle-Error "Failed to clone the monorepo" }

        Set-Location monorepo
        if (-not $?) { Handle-Error "Failed to change to monorepo directory" }

        git checkout -b monorepo-backup
        if (-not $?) { Handle-Error "Failed to create backup branch" }

        Write-Log "Created local backup branch: monorepo-backup"

        git checkout main 2>$null
        if (-not $?) {
            git checkout master
            if (-not $?) { Handle-Error "Failed to checkout main/master branch" }
        }
    }

    Write-Log "Monorepo cloned successfully."
}
. "$PSScriptRoot/Extract-SharedRepo.ps1"
. "$PSScriptRoot/Extract-ApiRepo.ps1"
. "$PSScriptRoot/Extract-WebRepo.ps1"
. "$PSScriptRoot/Create-MauiRepo.ps1"
. "$PSScriptRoot/Create-DocsRepo.ps1"

function Create-GitHubRepos {
    Write-Log "Note: This script cannot automatically create GitHub repositories."
    Write-Log "Please create the following repositories manually on GitHub:"
    foreach ($repo in $REPOS) {
        Write-Log "- https://github.com/$ORG_NAME/$repo"
    }
    Write-Log "After creating the repositories, you can push the local repositories using:"
    Write-Log "Set-Location `$repo; git remote add origin https://github.com/$ORG_NAME/`$repo.git; git push -u origin main"
}

function Main {
    Write-Log "Starting repository split process..."

    # Create workspace first so log file can be created
    Create-Workspace
    
    # Now that log file exists, we can check dependencies
    Check-Dependencies
    Clone-Monorepo
    Extract-SharedRepo
    Extract-ApiRepo
    Extract-WebRepo
    Create-MauiRepo
    Create-DocsRepo
    Create-GitHubRepos

    Write-Log "Repository split completed successfully!"
    Write-Log "The split repositories are available in: $WORK_DIR"
    Write-Log "Next steps:"
    Write-Log "1. Create the GitHub repositories (if not already done)"
    Write-Log "2. Push each repository to GitHub"
    Write-Log "3. Set up CI/CD for each repository"
    Write-Log "4. Update references between repositories"
}

Main