#!/bin/bash
# Script to set up test environment

set -e

echo "======================================"
echo "Setting up Web Interface Tests"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Install npm dependencies
echo ""
echo "Installing npm dependencies..."
npm install

# Install Playwright browsers
echo ""
echo "Installing Playwright browsers..."
npx playwright install chromium --with-deps

echo ""
echo "======================================"
echo "✓ Setup complete!"
echo "======================================"
echo ""
echo "To run tests:"
echo "  1. Start the API: cd ../ProntuarioMedico.Api && dotnet run"
echo "  2. Start the Web: python3 -m http.server 8080"
echo "  3. Run tests: npm test"
echo ""
echo "Or use docker compose:"
echo "  cd .. && docker compose up"
echo "  npm test"
