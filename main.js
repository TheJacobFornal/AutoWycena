const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const treeKill = require('tree-kill');
const { exec } = require('child_process');
const { autoUpdater } = require('electron-updater');  // 👈 Add auto-updater

let pythonProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'rerenderer.js'),
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));

  // Kill backend if window is closed directly
  win.on('closed', () => {
    if (pythonProcess && typeof pythonProcess.pid === 'number' && !pythonProcess.killed) {
      treeKill(pythonProcess.pid, 'SIGTERM');
    }
  });

  // ✅ Check for updates once window is loaded
  win.webContents.on('did-finish-load', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.setPath('userData', path.join(app.getPath('temp'), 'App_szefa'));

function startPythonBackend() {
  let exePath;

  if (app.isPackaged) {
    exePath = path.join(process.resourcesPath, 'app.exe');
  } else {
    exePath = path.join(__dirname, 'dist', 'app.exe');
  }

  pythonProcess = spawn(exePath, [], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  pythonProcess.stdout.on('data', (data) => {
    process.stdout.write(`PYTHON: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    process.stderr.write(`PYTHON ERROR: ${data}`);
  });
}

app.whenReady().then(() => {
  startPythonBackend();
  createWindow();
});

// 🔁 Optional update event logging
autoUpdater.on('update-available', () => {
  console.log('Update available.');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded. Will install on quit.');
});

app.on('before-quit', () => {
  if (pythonProcess && typeof pythonProcess.pid === 'number' && !pythonProcess.killed) {
    treeKill(pythonProcess.pid, 'SIGTERM');
  }

  exec('taskkill /F /IM app.exe', (error, stdout, stderr) => {
    if (error) {
      console.error(`taskkill error: ${error.message}`);
    }
    if (stderr) {
      console.error(`taskkill stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`taskkill stdout: ${stdout}`);
    }
  });
});
