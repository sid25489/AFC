# MongoDB Startup Script for Windows
# This script helps you start MongoDB

Write-Host "🔍 Checking MongoDB installation..." -ForegroundColor Cyan

# Check if MongoDB is installed as a service
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "✅ MongoDB service found!" -ForegroundColor Green
    
    if ($mongoService.Status -eq "Running") {
        Write-Host "✅ MongoDB is already running!" -ForegroundColor Green
        Write-Host "You can now run: cd diner-backend; npm run init-admin" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  MongoDB service is stopped. Starting..." -ForegroundColor Yellow
        try {
            Start-Service -Name "MongoDB"
            Write-Host "✅ MongoDB service started successfully!" -ForegroundColor Green
            Write-Host "You can now run: cd diner-backend; npm run init-admin" -ForegroundColor Yellow
        } catch {
            Write-Host "❌ Failed to start MongoDB service. Try running as Administrator." -ForegroundColor Red
            Write-Host "Or start manually: net start MongoDB" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ MongoDB service not found." -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Options to set up MongoDB:" -ForegroundColor Cyan
    Write-Host "1. MongoDB Atlas (Cloud - Recommended - No Installation):" -ForegroundColor Yellow
    Write-Host "   - Sign up: https://www.mongodb.com/cloud/atlas" -ForegroundColor White
    Write-Host "   - Create free cluster and update .env with connection string" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Local Installation:" -ForegroundColor Yellow
    Write-Host "   - Download: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "   - Install as Windows Service" -ForegroundColor White
    Write-Host ""
    Write-Host "See MONGODB_SETUP.md or QUICK_MONGODB_SETUP.md for detailed instructions." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

