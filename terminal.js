var client = require('ssh2').Client
var Terminal = require('xterm')
Terminal.loadAddon('fit')
var term = new Terminal( {cursorBlink: true}) //init terminal.


var creds = {}

var sshClient = require('ssh2').Client
var conn;

var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('start-session', function (event, args) {
    console.log("terminal will connect now")
    //console.log(args);
    creds = args //set variable and

    creds.pass = "root" //capture this cred from an input field instead.





    var tc = document.getElementById('terminal') //don't use jquery.



    term.open(tc, {focus: true}) // open terminal.

    term.fit()

    var tty = {rows: 24, cols: 80, height: 600, width: 800, term: "vt100"}
    //init ssh interactive session.
    conn = new sshClient()
    conn.on('ready', function() {
        console.log('shell is ready');


        conn.shell(tty, function(err, stream) {
            console.log(tty)
            if (err) throw err;
            stream.on('close', function() {
                console.log('Stream :: closed');
                conn.end();
            }).on('data', function(data) {
                term.write(data.toString('utf-8'));
            }).on('end', function(err) {
                console.log("host closed connection")
                console.log(err)
                term.write(err.toString('utf-8'));
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
            //stream.end('ls -l\nexit\n');

            term.on('data', function(data){
                stream.write(data)
            })

            term.on('title', function(title) {
                console.log("title changed")
                console.log(title)
            })

            term.on('resize', function(size) {
                console.log("terminal resized to: " + size.cols + "x" + size.rows)
                console.log(size)
                stream.setWindow(size.rows, size.cols, size.height, size.width)
            })
        });
    }).connect({
        host: creds.server,
        port: 22,
        username: creds.user,
        password: creds.pass,
        tryKeyboard: true
    });

    conn.on('keyboard-interactive', function(name, instructions, instructionsLang, prompts, finish) {
        console.log("server wants KB-interactive prompts:")
        console.log(prompts)
        finish([creds.pass]) //assume the only prompt requested is password... fix this if issues raised.
    })

    conn.on('banner', function() {
        console.log("banner recvd")
    })

});

window.addEventListener('resize', function(evt) {
    //adjust terminal window size to fit.

    updateTermSize()
    term.fit()
})

//jquery ready?
$(function() {

    updateTermSize()
})

function updateTermSize() {
    var b = $("body")

    c = $("#terminal")
    c.height(b.height())
    c.width(b.width())
}
