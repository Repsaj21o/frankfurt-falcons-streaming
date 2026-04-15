const { app, BrowserWindow, ipcMain, utilityProcess } = require('electron/main');
const path = require('node:path');

let gameId;
let server, util;

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
      preload: path.join(filePath, "preload.js"),
      devTools: false,
    }
  });

  win.loadFile(path.join(filePath, "index.html"));
}

app.whenReady().then(() => {
  ipcMain.on('confirmGameId', handleConfirmGameId);
  createWindow(path.join(__dirname, "game-link"));

  server = utilityProcess.fork(path.join(__dirname, "server", "server.js"));
  util = utilityProcess.fork(path.join(__dirname, "util.js"));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});