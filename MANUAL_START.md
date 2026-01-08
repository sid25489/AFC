# 🚀 Quick Start Guide - Manual Server Startup

## Option 1: Using Two Separate Terminals (RECOMMENDED)

### Terminal 1 - Start Backend:
```powershell
cd "c:\Users\Sai sidharth\AFC\diner-backend"
npm run dev
```

### Terminal 2 - Start Frontend:
```powershell
cd "c:\Users\Sai sidharth\AFC\diner-frontend"
npm run dev
```

---

## Option 2: Using Single Terminal with Background Jobs

```powershell
# Start backend in background
cd "c:\Users\Sai sidharth\AFC\diner-backend"
Start-Job -ScriptBlock { cd "c:\Users\Sai sidharth\AFC\diner-backend"; npm run dev }

# Start frontend in current terminal
cd "c:\Users\Sai sidharth\AFC\diner-frontend"
npm run dev
```

---

## ✅ After Starting

1. **Backend** will run on: http://localhost:5000
2. **Frontend** will run on: http://localhost:3000

3. Open browser and go to: http://localhost:3000

---

## 🧪 Quick Test

Once both are running, test the connection:
```powershell
curl http://localhost:5000/health
```
Should return: `{"status":"OK","message":"Server is running"}`

---

## 🛑 To Stop Servers

Press `Ctrl + C` in each terminal window.
