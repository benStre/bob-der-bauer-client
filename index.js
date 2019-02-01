require('./echo.js'); // für console-output:
/*
 _("text") // normaler weißer text 
 _s("Fertig!") // grüner Text
 _e("Fehler") // roter Text
 _i("Info") // blauer Text

*/

var SERIAL_NUMBER = false

init()


async function init(){
    _s("bob-der-bauer-client v.0.1")
    SERIAL_NUMBER = await getSerialNumber()
    _i("raspi serial number", SERIAL_NUMBER)

    // Verbindung zum Server
    let server_url = 'http://192.168.0.25' // 'https://bauerbob.herokuapp.com/'
    var socket = require('socket.io-client')(server_url);


    socket.on('connect', function(){
        _i("Connected to "+ server_url)
        socket.emit("raspi_verify", {serial_number:SERIAL_NUMBER})
    });
    socket.on('news', function(data){
        _(data)
    });
    socket.on('disconnect', function(){
        _e("disconnected")
    });

}





function getSerialNumber(){
    return new Promise(resolve=>{
        var exec = require('child_process').exec;
        exec("cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2",
            (error, stdout, stderr) => {
                if (error == null) {
                    resolve(stdout.replace("\n", ""))
                } 
                else { 
                    resolve(false)
                }
        });        
    })

}