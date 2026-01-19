#!/bin/bash

# Render 배포용 빌드 스크립트

echo "📦 Installing frontend dependencies..."
npm install

echo "🏗️ Building frontend..."
npm run build

echo "🐍 Installing backend dependencies..."
pip install -r server/requirements.txt

echo "✅ Build complete!"
