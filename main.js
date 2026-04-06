const { app, BrowserWindow } = require('electron')

const createWindow = (path) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile(path)
}

app.whenReady().then(() => {
  createWindow("./choose-game/index.html")

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  app.quit()
})