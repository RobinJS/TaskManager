var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var Tray = require('tray');
var electron = require('electron');
var Menu = require('menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
if (process.platform != 'darwin') {
  app.quit();
}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

function closeWindow(){
    app.quit();
}

var shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

if (shouldQuit) {
    app.quit();
    return;
}

app.on('ready', function() {
    var display = electron.screen.getPrimaryDisplay(),
        winInitWidth = 300,
        winInitHeight = 600;

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 300,
        height: 600,
        x: display.workAreaSize.width - winInitWidth,
        y: display.workAreaSize.height - winInitHeight,
        minWidth: 250,
        minHeight: 250,
        icon: 'app_icon.png',
        title: 'MyTaskManager',
        frame: false
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // mainWindow.setMenu(new Menu()); // uncomment to disable dev shortcuts

    var contextMenu = Menu.buildFromTemplate([
        {label: 'exit', type: 'normal', click: closeWindow }
    ]);

    var tray = new Tray('app_icon.png');

    tray.setToolTip('My Task Manager');

    tray.displayBalloon({
        icon: 'app_icon.png',
        title: 'Hello',
        content: 'Content'
    });

    tray.setContextMenu(contextMenu);

});
