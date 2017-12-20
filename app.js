const path = require('path');
const url = require('url');
const remote = require('electron').remote;

const ipcRenderer = require('electron').ipcRenderer

const BrowserWindow = remote.BrowserWindow;

function createWindowTerminal(server, username, name, passwd)
{
  let win = new BrowserWindow({ width: 800, height: 600 });
  //win.loadURL('www.google.com');


  //no menu bar
  win.setMenu(null);



    win.webContents.openDevTools()

  // and load the index.html of the app.

  win.loadURL('file://' + __dirname + '/terminal.html?server=' + server + '&user=' + username + '&name=' + name);



  //win.loadURL("http://codepen.io/AndrewBarfield/full/qEqWMq/");
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}
var ssh_server = "";
var ssh_user = "";
var ssh_name = "";
var ssh_pass = "";
var ssh_port = 22;

$(document).ready(function (){
  $('[name=run-terminal]').click(function(event) {
    $('#myModal').modal();
    ssh_server = $(this).attr('ssh-server');
    ssh_user = $(this).attr('ssh-user');
    ssh_name = $(this).attr('ssh-name');
  });


  /* called when the add server button is clicked */
  $('#add_submit').click(function() {

       
      ssh_pass = $('#new-server-pass').val();

      ssh_user = $('#add_serv_username').val()
      ssh_server = $('#new-server-addr').val()
      ssh_port = parseInt($('#new-server-port').val())
      console.log("ssh user is: " + ssh_user)
      console.log("ssh server is: " + ssh_server)

      var creds = {user: ssh_user, pass: ssh_pass, server: ssh_server, port: ssh_port} //creds needed for connecting to server
      ipcRenderer.sendSync('creds', creds ) //post creds to main process.

      //$('#pass_field').html("");
      //createWindowTerminal(ssh_server, ssh_user, ssh_name, passwd);
  });

  $('#clear_passwd').click(function() {
    $('#pass_field').html("");
  });

  /*$('#flat-checkbox-2').iCheck({
    checkboxClass: 'icheckbox_flat',
    radioClass: 'iradio_flat'
  });*/

  $('#add-server-btn').click(function() {
    $('#add-server-modal').modal();

  });

    $('#connect-server-btn').click(function() {
        $('#connect-server-modal').modal();

    });
});

// Or load a local HTML file
//win.loadURL(`file://${__dirname}/app/index.html`);
