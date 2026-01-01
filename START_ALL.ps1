# Complete Startup Script for Diner Project
# This script starts both frontend and backend

Write-Host "🚀 Starting Diner Project..." -ForegroundColor Cyan
Write-Host ""

# Check MongoDB
Write-Host "🔍 Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
$mongoRunning = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($mongoRunning) {
    Write-Host "✅ MongoDB is running!" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is not running!" -ForegroundColor Red
    Write-Host "Please set up MongoDB first:" -ForegroundColor Yellow
    Write-Host "  - MongoDB Atlas (Cloud): See QUICK_MONGODB_SETUP.md" -ForegroundColor White
    Write-Host "  - Local MongoDB: Run .\START_MONGODB.ps1" -ForegroundColor White
    Write-Host "  - Or install MongoDB locally" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Start Backend
Write-Host ""
Write-Host "🔧 Starting Backend..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "diner-backend"
if (Test-Path $backendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server' -ForegroundColor Green; npm run dev"
    Write-Host "✅ Backend starting in new window..." -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "❌ Backend folder not found!" -ForegroundColor Red
}

# Start Frontend
Write-Host ""
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "diner-frontend"
if (Test-Path $frontendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm run dev"
    Write-Host "✅ Frontend starting in new window..." -ForegroundColor Green
} else {
    Write-Host "❌ Frontend folder not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Wait for servers to start (check the new windows)" -ForegroundColor White
Write-Host "2. Backend: http://localhost:5000" -ForegroundColor White
Write-Host "3. Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "If MongoDB wasn't running, initialize admin:" -ForegroundColor Yellow
Write-Host "  cd diner-backend" -ForegroundColor White
Write-Host "  npm run init-admin" -ForegroundColor White
Write-Host "  npm run seed-menu" -ForegroundColor White
Write-Host ""

