#!/bin/bash

echo "=== Starting Flutter Build Process ==="

# Set Flutter directory
FLUTTER_DIR="$HOME/flutter"

# Install Flutter if not cached
if [ ! -d "$FLUTTER_DIR" ]; then
    echo "Installing Flutter SDK..."
    git clone https://github.com/flutter/flutter.git -b stable --depth 1 $FLUTTER_DIR
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to clone Flutter repository"
        exit 1
    fi
else
    echo "Flutter SDK found in cache"
fi

# Add Flutter to PATH
export PATH="$FLUTTER_DIR/bin:$PATH"
export PATH="$FLUTTER_DIR/bin/cache/dart-sdk/bin:$PATH"

# Pre-cache Flutter artifacts
echo "Pre-caching Flutter artifacts..."
flutter precache --web || true

# Check Flutter doctor
echo "Running Flutter doctor..."
flutter doctor || true

# Disable analytics
flutter config --no-analytics 2>/dev/null || true

# Enable Flutter web
echo "Enabling Flutter web..."
flutter config --enable-web
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to enable Flutter web"
    exit 1
fi

# Get dependencies with verbose output
echo "Getting dependencies..."
flutter pub get --verbose
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to get dependencies"
    exit 1
fi

# Build web app with optimizations for limited resources
echo "Building Flutter web app..."
flutter build web \
    --release \
    --web-renderer html \
    --dart-define=FLUTTER_WEB_USE_SKIA=false \
    --source-maps

if [ $? -ne 0 ]; then
    echo "ERROR: Flutter build failed"
    exit 1
fi

# Verify build output
if [ ! -d "build/web" ]; then
    echo "ERROR: build/web directory not found"
    exit 1
fi

echo "=== Flutter build completed successfully! ==="
echo "Build output size:"
du -sh build/web

exit 0
