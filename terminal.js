var client = require('ssh2').Client


var creds = {}

var sshClient = require('ssh2').Client
var conn;

var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('start-session', function (event, args) {
    console.log("terminal will connect now")
    console.log(args);
    creds = args //set variable and

    creds.pass = "root" //capture this cred from an input field instead.

    //init ssh interactive session.
    conn = new sshClient()
    conn.on('ready', function() {
        document.writeln('shell is ready');
        conn.shell(function(err, stream) {
            if (err) throw err;
            stream.on('close', function() {
                document.writeln('Stream :: close');
                conn.end();
            }).on('data', function(data) {
                document.writeln('STDOUT: ' + data);
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
            stream.end('ls -l\nexit\n');
        });
    }).connect({
        host: creds.server,
        port: 22,
        username: creds.user,
        password: "root",
        tryKeyboard: true
    });

    conn.on('keyboard-interactive', function(name, instructions, instructionsLang, prompts, finish) {
        console.log("server wants KB-interactive;")
        console.log(prompts)
        finish([creds.pass]) //assume the only prompt requested is password... fix this if issues raised.
    })

    conn.on('banner', function() {
        console.log("banner recvd")
    })

});