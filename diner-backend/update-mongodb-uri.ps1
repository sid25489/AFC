# MongoDB URI Update Helper Script
Write-Host "🔧 MongoDB Connection String Updater" -ForegroundColor Cyan
Write-Host ""

# Get new credentials from user
Write-Host "Enter your MongoDB Atlas credentials:" -ForegroundColor Yellow
Write-Host ""

$username = Read-Host "Username (e.g., diner-admin)"
$password = Read-Host "Password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

# URL encode password if needed
$passwordEncoded = [System.Web.HttpUtility]::UrlEncode($passwordPlain)

# Get cluster (default to current)
$cluster = Read-Host "Cluster address (default: cluster0.dzkrfwd.mongodb.net)"
if ([string]::IsNullOrWhiteSpace($cluster)) {
    $cluster = "cluster0.dzkrfwd.mongodb.net"
}

# Build connection string
$newUri = "mongodb+srv://$username`:$passwordEncoded@$cluster/diner-db?retryWrites=true&w=majority"

Write-Host ""
Write-Host "New connection string:" -ForegroundColor Green
Write-Host $newUri -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Update .env file with this connection string? (y/n)"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    # Read current .env
    $envContent = Get-Content .env -Raw
    
    # Replace MONGODB_URI line
    if ($envContent -match "MONGODB_URI=") {
        $envContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=$newUri"
    } else {
        $envContent += "`nMONGODB_URI=$newUri"
    }
    
    # Write back
    $envContent | Set-Content .env
    Write-Host "✅ .env file updated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now test the connection:" -ForegroundColor Yellow
    Write-Host "  node test-connection.js" -ForegroundColor White
} else {
    Write-Host "Cancelled. Connection string not updated." -ForegroundColor Yellow
}

