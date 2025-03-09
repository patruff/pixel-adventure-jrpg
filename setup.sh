#!/bin/bash

echo "Setting up Pixel Adventure JRPG"
echo "==============================="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create an empty .gitignore
echo "node_modules" > .gitignore
echo "dist" >> .gitignore
echo ".DS_Store" >> .gitignore

echo ""
echo "Setup complete! To start the game, run:"
echo "npm run dev"
echo ""
echo "The game will start with placeholder graphics. When you generate actual pixel art assets,"
echo "place them in the appropriate folders under src/assets/ and update the asset loader as needed."