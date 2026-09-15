#!/usr/bin/env node
/**
 * Gods Eye Veiw Easier support – Electron main process
 *
 * Original project "God's Eye View" by Bilawal Sidhu
 *   https://github.com/bilawalsidhu/gods-eye-view  (MIT License)
 *
 * Windows desktop edition by Aryan (aryanisproinroblox-source)
 *   https://github.com/aryanisproinroblox-source/Gods-Eye-Veiw-Easier-support
 */

const {
  app,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  dialog,
} = require('electron');
const path = require('node:path');
const { spawn } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs');

// ─── Constants ────────────────────────────────────────────────────────────────

const APP_VERSION = app.getVersion();
const PORT = 4173;
const DEV_URL = `http://127.0.0.1:${PORT}`;
const IS_WIN = process.platform === 'win32';

// ─── GPU / WebGL acceleration flags ───────────────────────────────────────────
app.commandLine.appendSwitch('enable-accelerated-video-decode');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
// WebGL for CesiumJS
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('enable-webgl2');

// ─── Single instance lock ──────────────────────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

// ─── State ────────────────────────────────────────────────────────────────────
let mainWindow = null;
let creditsWindow = null;
let viteProc = null;
let serverReady = false;

// ─── Vite dev server launcher ─────────────────────────────────────────────────
function launchViteServer() {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(__dirname, '..');
    const npm = IS_WIN ? 'npm.cmd' : 'npm';
    viteProc = spawn(npm, ['run', 'dev'], { cwd, env: { ...process.env, PORT: String(PORT) }, stdio: 'pipe' });

    viteProc.stdout.on('data', (chunk) => {
      const out = chunk.toString();
      if (out.includes('127.0.0.1') || out.includes('localhost') || out.includes('ready in')) {
        if (!serverReady) {
          serverReady = true;
          resolve();
        }
      }
    });

    viteProc.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      // vite also logs readiness to stderr on some versions
      if (text.includes('ready in') && !serverReady) {
        serverReady = true;
        resolve();
      }
    });

    viteProc.on('error', reject);
    viteProc.on('exit', (code) => {
      if (code !== 0 && !serverReady) reject(new Error(`Vite exited with code ${code}`));
    });

    // Fallback: poll HTTP
    const poll = setInterval(() => {
      http.get(DEV_URL, (r) => {
        if (r.statusCode < 500 && !serverReady) {
          serverReady = true;
          clearInterval(poll);
          resolve();
        }
      }).on('error', () => {});
    }, 800);
  });
}

// ─── Window creation ──────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    title: 'Gods Eye Veiw Easier support',
    icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
    backgroundColor: '#070b12',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    show: false,
  });

  mainWindow.loadURL(DEV_URL);
  mainWindow.webContents.on('did-finish-load', () => mainWindow.show());

  // Block navigation away from the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
  buildMenu();
}

function createCreditsWindow() {
  if (creditsWindow && !creditsWindow.isDestroyed()) {
    creditsWindow.focus();
    return;
  }
  creditsWindow = new BrowserWindow({
    width: 780,
    height: 680,
    title: 'Credits & Acknowledgements',
    icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
    backgroundColor: '#070b12',
    parent: mainWindow || undefined,
    modal: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  creditsWindow.loadFile(path.join(__dirname, 'credits.html'));
  creditsWindow.on('closed', () => { creditsWindow = null; });
}

// ─── Native Menu ──────────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload App',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow?.webContents.reload(),
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: IS_WIN ? 'Alt+F4' : 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: IS_WIN ? 'F11' : 'Ctrl+Command+F',
          click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()),
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            if (mainWindow) mainWindow.webContents.setZoomFactor(mainWindow.webContents.getZoomFactor() + 0.1);
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (mainWindow) mainWindow.webContents.setZoomFactor(Math.max(0.5, mainWindow.webContents.getZoomFactor() - 0.1));
          },
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow?.webContents.setZoomFactor(1),
        },
        { type: 'separator' },
        {
          label: 'Developer Tools',
          accelerator: 'F12',
          click: () => mainWindow?.webContents.openDevTools(),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Credits & Original Author',
          click: () => createCreditsWindow(),
        },
        { type: 'separator' },
        {
          label: 'Original Project by Bilawal Sidhu',
          click: () => shell.openExternal('https://github.com/bilawalsidhu/gods-eye-view'),
        },
        {
          label: 'Easier Support Repository',
          click: () => shell.openExternal('https://github.com/aryanisproinroblox-source/Gods-Eye-Veiw-Easier-support'),
        },
        { type: 'separator' },
        {
          label: `About Gods Eye Veiw Easier support v${APP_VERSION}`,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              icon: path.join(__dirname, '..', 'assets', 'icon.png'),
              title: 'About Gods Eye Veiw Easier support',
              message: `Gods Eye Veiw Easier support\nVersion ${APP_VERSION}`,
              detail: [
                'Windows desktop edition of God\'s Eye View.',
                '',
                'Original project "God\'s Eye View" created by Bilawal Sidhu.',
                'https://github.com/bilawalsidhu/gods-eye-view',
                '',
                'MIT License © Bilawal Sidhu',
                '',
                'Windows Easier Support packaging by Aryan.',
              ].join('\n'),
              buttons: ['OK', 'Open Original Repo'],
            }).then(({ response }) => {
              if (response === 1) shell.openExternal('https://github.com/bilawalsidhu/gods-eye-view');
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── IPC handlers ─────────────────────────────────────────────────────────────
ipcMain.on('open-external', (_ev, url) => {
  if (typeof url === 'string' && url.startsWith('http')) shell.openExternal(url);
});

ipcMain.on('show-credits', () => createCreditsWindow());
ipcMain.handle('get-version', () => APP_VERSION);

// ─── Second instance focus ────────────────────────────────────────────────────
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
function shutdown() {
  if (viteProc && !viteProc.killed) {
    viteProc.kill('SIGTERM');
  }
}

app.on('before-quit', shutdown);
app.on('window-all-closed', () => {
  shutdown();
  if (process.platform !== 'darwin') app.quit();
});

// ─── App Ready ────────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  try {
    console.log('[GEV] Launching local Vite server...');
    await launchViteServer();
    console.log('[GEV] Server ready. Opening window...');
    createWindow();
  } catch (err) {
    console.error('[GEV] Failed to start:', err.message);
    dialog.showErrorBox('Launch Error', `Failed to start the local server:\n\n${err.message}\n\nPlease make sure Node.js 24+ is installed.`);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
