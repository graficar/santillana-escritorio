'use strict';

const express = require('express'); //your express app
const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url') ;
const path = require('path');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
const DecompressZip = require('decompress-zip');
const shell = require('electron').shell;

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
	let z = express();
	z.use(express.static(__dirname + './app/recursos'));
	win = new BrowserWindow({ 
		width: 1400, height: 1400,		
		webPreferences: {
		    webSecurity: false
		  }
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

	/*win.webContents.on('will-navigate', (event, url) => {
	  event.preventDefault();
	  if (isSafeishURL(url)) {
	    shell.openExternal(url);
	  }
	  //shell.openExternal(url)
	});*/


}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

app.on('ready', () => {
  createWindow();
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
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (ev, info) => {
// })
// autoUpdater.on('update-not-available', (ev, info) => {
// })
// autoUpdater.on('error', (ev, err) => {
// })
// autoUpdater.on('download-progress', (ev, progressObj) => {
// })
autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
})

app.on('ready', function()  {
  autoUpdater.checkForUpdates();
});

