const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const treeKill = require('tree-kill');
const { exec } = require('child_process');

let pythonProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
     icon: path.join(__dirname, 'icon.ico'),  
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'rerenderer.js'), // Optional preload
      contextIsolation: true
    }
  });

win.loadFile(path.join(__dirname, 'frontend', 'index.html'));
 

  // Kill backend if window is closed directly
  win.on('closed', () => {
    if (pythonProcess && typeof pythonProcess.pid === 'number' && !pythonProcess.killed) {
      treeKill(pythonProcess.pid, 'SIGTERM');
    }
  });
}

app.setPath('userData', path.join(app.getPath('temp'), 'App_szefa'));


function startPythonBackend() {
  let exePath;

  if (app.isPackaged) {
    // Path when running from packaged build
    exePath = path.join(process.resourcesPath, 'app.exe');
  } else {
    // Path when running in dev mode
    exePath = path.join(__dirname, 'dist', 'app.exe');
  }

pythonProcess = spawn(exePath, [], {
  stdio: ['ignore', 'pipe', 'pipe']  // connect stdout and stderr
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



app.on('before-quit', () => {
  if (pythonProcess && typeof pythonProcess.pid === 'number' && !pythonProcess.killed) {
    treeKill(pythonProcess.pid, 'SIGTERM');
  }

  // Fallback: kill any remaining app.exe by name
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

