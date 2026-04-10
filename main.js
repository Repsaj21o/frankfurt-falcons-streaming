const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

let gameId;

function handleConfirmGameId(event, newGameId) {
  BrowserWindow.fromWebContents(event.sender).close();
  gameId = newGameId;
  console.log(gameId);
}

function createWindow (filePath) {
  const win = new BrowserWindow({
    width: 1400,
    height: 600,
    webPreferences: {
      preload: path.join(filePath, "preload.js")
    }
  });

  win.loadFile(path.join(filePath, "index.html"));
}

app.whenReady().then(() => {
  ipcMain.on('confirmGameId', handleConfirmGameId);
  createWindow(path.join(__dirname, "game-link"));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});