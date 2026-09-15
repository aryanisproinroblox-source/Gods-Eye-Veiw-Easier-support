#!/usr/bin/env node
/**
 * Gods Eye Veiw Easier support – Windows Desktop Application
 *
 * Original project "God's Eye View" conceived and created by Bilawal Sidhu:
 *   GitHub: https://github.com/bilawalsidhu/gods-eye-view (MIT License)
 *
 * Windows desktop edition & Easier Support packaging by Aryan:
 *   GitHub: https://github.com/aryanisproinroblox-source/Gods-Eye-Veiw-Easier-support
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
const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');

// ─── GPU / WebGL acceleration for Cesium 3D Globe ───────────────────────────
app.commandLine.appendSwitch('enable-accelerated-video-decode');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('enable-webgl2');

// ─── Single instance lock ───────────────────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

const APP_VERSION = '1.0.0';
const IS_WIN = process.platform === 'win32';

let mainWindow = null;
let creditsWindow = null;
let localServer = null;
let localServerPort = 0;

// ─── Embedded High-Performance Zero-Dependency Static & Proxy Server ────────
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.geojsonl': 'application/geo+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
};

function getDistPath() {
  const candidates = [
    path.join(__dirname, '..', 'dist'),
    path.join(process.resourcesPath || '', 'app', 'dist'),
    path.join(process.resourcesPath || '', 'dist'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.existsSync(path.join(c, 'index.html'))) {
      return c;
    }
  }
  return path.join(__dirname, '..', 'dist');
}

function startEmbeddedServer() {
  return new Promise((resolve, reject) => {
    const distDir = getDistPath();

    localServer = http.createServer((req, res) => {
      // CORS & frame headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const urlObj = new URL(req.url, `http://127.0.0.1:${localServerPort || 4000}`);
      let reqPath = decodeURIComponent(urlObj.pathname);

      // Handle Key Setup / Status endpoint
      if (reqPath === '/api/setup/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          keys: [
            { id: 'google-maps', title: 'GOOGLE MAPS', unlocks: 'The photorealistic 3D planet + place search', ready: false },
            { id: 'cesium-ion', title: 'CESIUM ION', unlocks: 'Curated 3D tiles & terrain', ready: false },
            { id: 'openai', title: 'OPENAI VOICE', unlocks: 'AI Voice Tactical Co-Pilot', ready: false },
            { id: 'aisstream', title: 'AISSTREAM', unlocks: 'Live global ship tracking', ready: false },
            { id: 'firms', title: 'NASA FIRMS', unlocks: 'Satellite wildfire detection', ready: false },
            { id: 'tomtom', title: 'TOMTOM TRAFFIC', unlocks: 'Live traffic layer', ready: false },
          ]
        }));
        return;
      }

      // Handle static file serving
      if (reqPath === '/') reqPath = '/index.html';
      let filePath = path.join(distDir, reqPath);

      // Prevent path traversal
      if (!filePath.startsWith(distDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        // SPA fallback to index.html
        const fallback = path.join(distDir, 'index.html');
        if (fs.existsSync(fallback)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(fallback).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      }
    });

    // Listen on dynamic available port
    localServer.listen(0, '127.0.0.1', () => {
      localServerPort = localServer.address().port;
      console.log(`[GEV Desktop] Internal server running at http://127.0.0.1:${localServerPort}`);
      resolve(localServerPort);
    });

    localServer.on('error', reject);
  });
}

// ─── Window Management ──────────────────────────────────────────────────────
function getIconPath() {
  const iconCandidates = [
    path.join(__dirname, '..', 'assets', 'icon.ico'),
    path.join(__dirname, '..', 'assets', 'icon.png'),
    path.join(process.resourcesPath || '', 'assets', 'icon.ico'),
    path.join(process.resourcesPath || '', 'assets', 'icon.png'),
  ];
  for (const ic of iconCandidates) {
    if (fs.existsSync(ic)) return ic;
  }
  return undefined;
}

function createWindow() {
  const icon = getIconPath();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    title: 'Gods Eye Veiw Easier support',
    icon,
    backgroundColor: '#070b12',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    show: false,
  });

  mainWindow.loadURL(`http://127.0.0.1:${localServerPort}/`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle('Gods Eye Veiw Easier support');
    mainWindow.show();
  });

  // External links open in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  buildMenu();
}

function createCreditsWindow() {
  if (creditsWindow && !creditsWindow.isDestroyed()) {
    creditsWindow.focus();
    return;
  }

  creditsWindow = new BrowserWindow({
    width: 800,
    height: 720,
    title: 'Credits & Acknowledgements // Gods Eye Veiw Easier support',
    icon: getIconPath(),
    backgroundColor: '#070b12',
    parent: mainWindow || undefined,
    modal: false,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  creditsWindow.loadFile(path.join(__dirname, 'credits.html'));
  creditsWindow.on('closed', () => {
    creditsWindow = null;
  });
}

// ─── Native Menu Bar ────────────────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload View',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow?.webContents.reload(),
        },
        {
          label: 'Hard Reload (Clear Cache)',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => mainWindow?.webContents.reloadIgnoringCache(),
        },
        { type: 'separator' },
        {
          label: 'Open in Default Web Browser',
          click: () => shell.openExternal(`http://127.0.0.1:${localServerPort}`),
        },
        { type: 'separator' },
        {
          label: 'Exit',
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
          accelerator: 'F11',
          click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()),
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => {
            if (mainWindow) {
              const z = mainWindow.webContents.getZoomFactor();
              mainWindow.webContents.setZoomFactor(Math.min(2.0, z + 0.1));
            }
          },
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (mainWindow) {
              const z = mainWindow.webContents.getZoomFactor();
              mainWindow.webContents.setZoomFactor(Math.max(0.5, z - 0.1));
            }
          },
        },
        {
          label: 'Reset Zoom (100%)',
          accelerator: 'CmdOrCtrl+0',
          click: () => mainWindow?.webContents.setZoomFactor(1.0),
        },
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: '★ Credits & Original Creator',
          click: () => createCreditsWindow(),
        },
        { type: 'separator' },
        {
          label: 'Original Project by Bilawal Sidhu (GitHub)',
          click: () => shell.openExternal('https://github.com/bilawalsidhu/gods-eye-view'),
        },
        {
          label: 'Easier Support Repository (GitHub)',
          click: () => shell.openExternal('https://github.com/aryanisproinroblox-source/Gods-Eye-Veiw-Easier-support'),
        },
        { type: 'separator' },
        {
          label: `About Gods Eye Veiw Easier support v${APP_VERSION}`,
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              icon: getIconPath(),
              title: 'About Gods Eye Veiw Easier support',
              message: `Gods Eye Veiw Easier support v${APP_VERSION}`,
              detail: [
                'Windows Desktop Application Edition of God\'s Eye View.',
                '',
                '★ ORIGINAL PROJECT:',
                'Created and designed by Bilawal Sidhu.',
                'Repository: https://github.com/bilawalsidhu/gods-eye-view',
                'License: MIT License © Bilawal Sidhu',
                '',
                '★ EASIER SUPPORT EDITION:',
                'Packaged for Windows by Aryan (aryanisproinroblox-source).',
                'Repository: https://github.com/aryanisproinroblox-source/Gods-Eye-Veiw-Easier-support',
              ].join('\n'),
              buttons: ['OK', 'View Original GitHub'],
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

// ─── IPC Handlers ───────────────────────────────────────────────────────────
ipcMain.on('open-external', (_ev, url) => {
  if (typeof url === 'string' && url.startsWith('http')) {
    shell.openExternal(url);
  }
});

ipcMain.on('show-credits', () => createCreditsWindow());
ipcMain.handle('get-version', () => APP_VERSION);

// ─── Lifecycle ──────────────────────────────────────────────────────────────
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

function cleanup() {
  if (localServer) {
    localServer.close();
    localServer = null;
  }
}

app.on('before-quit', cleanup);
app.on('window-all-closed', () => {
  cleanup();
  if (process.platform !== 'darwin') app.quit();
});

// ─── App Boot ───────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  try {
    console.log('[GEV Desktop] Starting embedded server...');
    await startEmbeddedServer();
    createWindow();
  } catch (err) {
    console.error('[GEV Desktop] Failed to start:', err);
    dialog.showErrorBox('Initialization Error', `Failed to start desktop app:\n\n${err.message}`);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
