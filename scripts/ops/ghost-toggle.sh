#!/bin/bash
# ----------------------------------------------------------------
# GHOST-TOGGLE PROTOCOL
# Purpose: Swaps between "Noir" (Focus/Backend) and "Neon" (Energy/Frontend)
# ----------------------------------------------------------------

# Define the two themes we will toggle between
# These should match the names in your 'Appearance > Colors' settings
THEME_NOIR="BreezeNoir"
THEME_NEON="Daemon2"

# Get the current active color scheme from KDE globals
CURRENT_THEME=$(kreadconfig6 --group General --key colorScheme)

echo "Ghost-Link: Current status is $CURRENT_THEME"

# Logic gate to switch themes
if [ "$CURRENT_THEME" == "$THEME_NOIR" ]; then
    echo "Ghost-Link: Activating NEON mode (Frontend/Creative)..."
    # plasma-apply-colors is a KDE utility to change schemes via CLI
    plasma-apply-colors $THEME_NEON
    # Optional: Change VSCode profile or theme here in the future
else
    echo "Ghost-Link: Activating NOIR mode (Backend/Deep Focus)..."
    plasma-apply-colors $THEME_NOIR
fi
