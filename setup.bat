@echo off
echo.
echo ========================================
echo    🚀 AUCTION DAPP SETUP SCRIPT
echo ========================================
echo.

echo 📋 Step 1: Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found!
echo.

echo 📋 Step 2: Checking MongoDB installation...
mongod --version
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB not found! 
    echo    Download from: https://www.mongodb.com/try/download/community
    echo    Or install with: winget install MongoDB.MongoDB
    echo.
    set /p continue="Continue without MongoDB? (y/n): "
    if /i "!continue!" neq "y" exit /b 1
) else (
    echo ✅ MongoDB found!
)
echo.

echo 📋 Step 3: Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed!
echo.

echo 📋 Step 4: Setting up environment...
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration!
)
echo.

echo ========================================
echo    🎉 SETUP COMPLETE!
echo ========================================
echo.
echo 🚀 To start the backend server:
echo    cd backend
echo    npm run dev
echo.
echo 📚 Read MONGODB_LEARNING_GUIDE.md for MongoDB basics
echo.
pause
