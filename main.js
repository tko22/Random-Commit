const {app, BrowserWindow, TouchBar} = require('electron')
var fs = require('fs')
const readline = require('readline')

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar
var messages = []

let spinning = false
const path = require('path')
const url = require('url')

// Reel labels
const reel1 = new TouchBarLabel()
const reel2 = new TouchBarLabel()
const reel3 = new TouchBarLabel()

// Spin result label
const result = new TouchBarLabel()

const commit = new TouchBarButton({
  label: 'Commit',
  backgroundColor: '#7851A9',
  click: () =>{
    reel1.label = messages[Math.floor(Math.random()*messages.length)]
  }
})

var rd = readline.createInterface({
  input: fs.createReadStream('commit_messages.txt'),
  output: false,
  console: false
})

rd.on('line',function(line){
  messages.push(line)
})

const finishSpin = () => {
  const uniqueValues = new Set([reel1.label, reel2.label, reel3.label]).size
  if (uniqueValues === 1) {
    // All 3 values are the same
    result.label = '💰 Jackpot!'
    result.textColor = '#FDFF00'
  } else if (uniqueValues === 2) {
    // 2 values are the same
    result.label = '😍 Winner!'
    result.textColor = '#FDFF00'
  } else {
    // No values are the same
    result.label = '🙁 Spin Again'
    result.textColor = null
  }
  spinning = false
}

const touchBar = new TouchBar([
  commit,
  new TouchBarSpacer({size: 'large'}),
  reel1
])

let window

createWindow = () => {
  window = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hiddenInset',
    width: 200,
    height: 100,
    backgroundColor: '#000'
  })
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  window.setTouchBar(touchBar)
}

app.once('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
