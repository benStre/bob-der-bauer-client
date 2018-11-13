require('./echo.js'); // für console-output:
require('./zeug_ansteuern.js'); // zeug ansteuern

var fs = require('fs'); // dateien lesen
global.API = new (require('./api.js'))(); // die api 

console.log(`❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤`.red.bold)
console.log(`\n\n                BOB-DER-BAUER-client v.0.1`.green.bold)
console.log(`       -> created by Anne, Benedikt, Paul & Finn <- \n\n`.cyan.bold)
console.log(`❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤\n\n`.red.bold)

global.SOCKET = new (require('./socket_client.js'))(); // für verbindung zum server



// pumpe steuern #1

setInterval(async ()=>{
	let state = await read_moisture_sensor()
	if(state){
		pump_on()	
		setTimeout(()=>pump_off(),4000)
	} else {
		pump_off()
	}	
},1000)


// wasserstand prüfen - rote LED #1

/*
setInterval(async ()=>{
	let water = await read_water_level()
	if(water){
		indicator_led_on()	
	} else {
		indicator_led_off()
	}	
},1000)
*/



var _data_path = './data/data.json'
global._DATA = JSON.parse(fs.readFileSync(_data_path, 'utf8'));
global.update_DATA = function(){
  fs.writeFileSync(_data_path, JSON.stringify(_DATA));
}


var SERIAL_NUMBER



init()

async function init(){

    SERIAL_NUMBER = await getSerialNumber()
    _i("raspi serial number", SERIAL_NUMBER)

    await SOCKET.init()

    if(!_DATA.verification){ // neue registrierung
	_i("new registration")
        let result = await SOCKET.raspi_verify({serial_number:SERIAL_NUMBER})
	console.log("result", result)        
	if(result.valid){
            _s("SOCKET", "verified")
            _i("SOCKET", "code: "  + result.code)
            _i("SOCKET", "verification: "  + result.verification)
            _DATA.code = result.code
            _DATA.verification = result.verification
            update_DATA() 
        } else {
            _e("SOCKET", "could not verify because: " + result.reason)
        }         
    } else {
        let result = await SOCKET.raspi_connect({serial_number:SERIAL_NUMBER, verification:_DATA.verification})
        if(result.valid){
            _s("SOCKET", "connected")
        } else {
            _e("SOCKET", "could not connect because: " + result.reason)
        }         
    }


    
    
    
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
                	_i("using backup serial_number method (for windows)")
                	var serialNumber = require('serial-number');
					serialNumber(function (err, value) {
						resolve(value)
					});                  
                }
        });        
    })

}
