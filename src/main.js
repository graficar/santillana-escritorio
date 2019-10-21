'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url') ;
const path = require('path');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


let win

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

function createWindow(){	
	win = new BrowserWindow({ 
		width: 1400, height: 1400,		
		webPreferences: {
		    webSecurity: false
		  },
		//fullscreen: true
		//, frame: false
	})

	win.loadURL(url.format({
		pathname: path.join(__dirname, './app/index.html'),
		protocol: 'file:', 
		slashes: true
	}))

	//win.webContents.openDevTools()

	win.on('closed', () => {		
		win = null
	})
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

function isSafeishURL(url) {
  return url.startsWith('http:') || url.startsWith('https:');
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {  
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }

});

//-------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

