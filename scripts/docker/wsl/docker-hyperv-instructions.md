# Using Docker with Hyper-V Instead of WSL2

## Configuration Steps

1. **Restart your computer** to complete the Hyper-V installation.

2. **Open Docker Desktop**:
   - Click on the Docker icon in the system tray
   - Select "Settings"
   - Go to "General" tab
   - Uncheck "Use the WSL 2 based engine"
   - Click "Apply & Restart"

3. **If Docker Desktop settings aren't accessible**:
   - The configuration file has been created at: %USERPROFILE%\.docker\daemon.json
   - This file is configured to use Hyper-V instead of WSL2

4. **Verify Docker is working**:
   - Open a command prompt
   - Run docker info
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
