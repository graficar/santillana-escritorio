'use strict';
let $ = require('jquery');  // jQuery now loaded and assigned to $
const path = require('path');
let fs = require('fs-extra');

const { dialog } = require('electron').remote;
const DecompressZip = require('decompress-zip');

const app = require('electron').remote.app;

const carpetamodulos = path.join(app.getPath('userData'), 'recursos/');
//const servidor = 'http://localhost:8081/red/public/';
const servidor = 'https://www.santillanadigital.net/';

try{
	fs.mkdirSync(path.join(app.getPath('userData'), 'recursos'));
}catch(err){}

try{
	fs.mkdirSync(path.join(app.getPath('userData'), 'js'));
}catch(err){}


//console.log('app222.getData es :', carpetamodulos);

//const carpetamodulos = 'moduloscargados/';

//const carpetamodulos = 'file://D:/recursos/';
//const carpetamodulos = app2.getPath('userData');
//console.log('app222.getData es :', app2.getPath('userData'));


//var ipc = require('electron').ipcRenderer;

//const carpetamodulos = ipc.sendSync('getPath')+'/recursos/';
//console.log('carpetamodulos', carpetamodulos);