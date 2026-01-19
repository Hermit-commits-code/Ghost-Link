#!/bin/bash
# ----------------------------------------------------------------
# GHOST-ENV PROTOCOL (FINAL VERSION)
# Purpose: Installs VSCode, Mise, and Docker in strict logical order.
# ----------------------------------------------------------------

echo "Ghost-Link: Starting High-Level Infrastructure Build..."

# 1. Install System Binaries
# We need 'code' installed before we can touch extensions.
# We need 'curl' and 'git' to fetch Mise.
sudo pacman -Syu --noconfirm code docker docker-compose curl git nodejs npm

# 2. Install Mise (The Language Manager)
# This is the tool that replaces 'asdf'. It manages Node, Python, etc.
# We download the install script and execute it.
curl https://mise.jdx.dev/install.sh | sh

# 3. Inject Mise into your shell configuration
# We add it to .bashrc so the 'mise' command is available in every terminal session.
echo 'eval "$($HOME/.local/bin/mise activate bash)"' >> ~/.bashrc
# We manually source it for this specific session so the rest of the script works.
export PATH="$HOME/.local/bin:$PATH"
eval "$(mise activate bash)"

# 4. Install VSCode Extensions
# Now that 'code' exists from Step 1, we add our developer tools.
echo "Ghost-Link: Provisioning VSCode Extensions..."
code --install-extension esbenp.prettier-standard # Formatter
code --install-extension dbaeumer.vscode-eslint    # Linter
code --install-extension ms-python.python          # Python Support
code --install-extension bradlc.vscode-tailwindcss # Modern CSS Support

# 5. Docker Permissions
# Enable the service and allow your user to run containers without 'sudo'.
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

echo "----------------------------------------------------------------"
echo "Ghost-Link: Infrastructure is 100% Locked."
echo "ACTION REQUIRED: Run 'source ~/.bashrc' or restart your terminal."
echo "----------------------------------------------------------------"
