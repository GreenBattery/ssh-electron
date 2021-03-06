const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

var termList = Array()

const ipcMain = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 450, height: 640})

  //no menu bar
  win.setMenu(null);

  //debugging sometimes needed, so yeah
  win.toggleDevTools();

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


ipcMain.on('creds', function (event, arg) {
  console.log("creds message recvd")
  console.log( arg)

    var term = new BrowserWindow({width: 800, height: 600})

    term.loadURL(url.format({
        pathname: path.join(__dirname, 'terminal.html'),
        protocol: 'file:',
        slashes: true
    }))

    term.openDevTools()

    term.webContents.on('did-finish-load', () => {
      console.log("now sendding a message to term window")
        term.webContents.send('start-session', arg)
    })

})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
