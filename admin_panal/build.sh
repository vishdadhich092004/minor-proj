#!/bin/bash

# Exit on error
set -e

echo "=== Starting Flutter Build Process ==="

# Set Flutter directory
FLUTTER_DIR="$HOME/flutter"

# Install Flutter if not cached
if [ ! -d "$FLUTTER_DIR" ]; then
    echo "Installing Flutter SDK..."
    git clone https://github.com/flutter/flutter.git -b stable --depth 1 $FLUTTER_DIR
else
    echo "Flutter SDK found in cache"
fi

# Add Flutter to PATH
export PATH="$FLUTTER_DIR/bin:$PATH"
export PATH="$FLUTTER_DIR/bin/cache/dart-sdk/bin:$PATH"

# Check Flutter version
echo "Flutter version:"
flutter --version || echo "Flutter version check failed, continuing anyway..."

# Disable analytics and crash reporting
flutter config --no-analytics
flutter config --no-cli-animations

# Enable Flutter web
echo "Enabling Flutter web..."
flutter config --enable-web

# Clean any previous builds
echo "Cleaning previous builds..."
flutter clean || echo "Clean failed, continuing anyway..."

# Get dependencies
echo "Getting dependencies..."
flutter pub get

# Build web app
echo "Building Flutter web app..."
flutter build web --release --web-renderer html

echo "=== Flutter build completed successfully! ==="
