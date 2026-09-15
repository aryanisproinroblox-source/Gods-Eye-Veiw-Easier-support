const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url) => ipcRenderer.send('open-external', url),
  showCredits: () => ipcRenderer.send('show-credits'),
  getVersion: () => ipcRenderer.invoke('get-version'),
});
