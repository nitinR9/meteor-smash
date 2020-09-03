const {app, BrowserWindow} = require('electron') ;
const path = require('path') ;
let win ;

let gotSingleInstanceAccess = app.requestSingleInstanceLock() ;

if(!gotSingleInstanceAccess){
   app.quit() ;
}

function createWindow(){
   win = new BrowserWindow({
      width: 800,
      height: 625,
      webPreferences: {
         nodeIntegration: true
      },
      show: true,
      center: true,
      resizable: false,
      fullscreenable: false,
      maximizable: false,
      title: 'Meteor Smash',
      backgroundColor: '#000000',
   }) ;

   win.setMenuBarVisibility(false) ;

   win.loadFile(path.join(__dirname+'/src/index.html')) ;

   win.on('ready-to-show', () => {
      setTimeout(() => {
         win.show() ;
      }, 5500) ;
   }) ;

   win.on('close', () => {
      win = null ;
   })

   win.webContents.on('did-fail-load', () => {
      win.loadFile(path.join(__dirname+'/src/index.html')) ;
   })

}

app.on('ready', createWindow) ;

app.on('window-all-closed', () => {
   if (process.platform === 'darwin'){
      app.quit() ;
   }
}) ;

app.on('activate', () => {
   if (win === null){
      createWindow() ;
   }
}) ;

app.on('second-instance', (event,args, cwd) => {
   if(win){
      if(win.isMinimized()){
         win.restore() ;
      }
      win.focus() ;
   }
}) ;

