const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('main', {
  confirmGameId: (gameId) => ipcRenderer.send('confirmGameId', gameId)
});