const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

require('electron-nice-auto-reload')({
    rootPath: path.join(process.cwd(), 'src'),
    rules: [
        {
            // run lessc while style.less file is changed
            // and this script will change the style.css
            // hence reload all windows
            action: 'script',
            target: 'style\\.less',
            // lessc src/css/style.less src/css/style.css
            script: 'npm run less'
        },
        {
            // relaunch the app while main process related js files
            // were changed
            action: 'app.relaunch',
            target: 'preload\\.js|main\\.js'
        }
    ],
    ignored: /node_modules/,
    log: true,
    devToolsReopen: true
})