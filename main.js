const {app, BrowserWindow, TouchBar} = require('electron')
var fs = require('fs')
var sys = require('sys')
var exec = require('child_process').exec;
const readline = require('readline')

const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = TouchBar
var messages = []

const path = require('path')
const url = require('url')

// Reel labels
const reel1 = new TouchBarLabel()

const commit = new TouchBarButton({
  label: 'Commit',
  backgroundColor: '#7851A9',
  click: () =>{
    let random_message = messages[Math.floor(Math.random()*messages.length)]
    let command = 'git commit . -m "' + messages[Math.floor(Math.random()*messages.length)] + '"'
    exec(command, function(err, stdout,stdedrr){
      if(err) {
        console.log('err: ', err);
      }
    })
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
