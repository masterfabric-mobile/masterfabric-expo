#!/bin/bash

# Recipio Test Script
# Simple script to test Recipio app

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Recipio Test Script${NC}"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}📁 Directory: $SCRIPT_DIR${NC}"
echo ""

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found! Please install Node.js.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found! Please install npm.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm: $(npm --version)${NC}"

if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Expo CLI available${NC}"
echo ""

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 node_modules not found, installing dependencies...${NC}"
    npm install
    echo ""
else
    echo -e "${GREEN}✅ node_modules exists${NC}"
    echo ""
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found!${NC}"
    exit 1
fi

if [ ! -f "App.tsx" ]; then
    echo -e "${RED}❌ App.tsx not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All files exist${NC}"
echo ""

echo -e "${YELLOW}🧹 Cleaning cache...${NC}"
rm -rf .expo
rm -rf node_modules/.cache
echo -e "${GREEN}✅ Cache cleaned!${NC}"
echo ""

echo -e "${YELLOW}🎯 Starting Expo...${NC}"
echo -e "${YELLOW}   Press 'i' for iOS${NC}"
echo -e "${YELLOW}   Press 'a' for Android${NC}"
echo -e "${YELLOW}   Press 'w' for Web${NC}"
echo -e "${YELLOW}   Scan QR code with Expo Go app${NC}"
echo ""

npx expo start --clear
