require('./echo.js'); // für console-output:
require('./zeug_ansteuern.js'); // zeug ansteuern

var fs = require('fs'); // dateien lesen
global.API = new (require('./api.js'))(); // die api 

console.log(`❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤`.red.bold)
console.log(`\n\n                BOB-DER-BAUER-client v.0.1`.green.bold)
console.log(`       -> created by Anne, Benedikt, Paul & Finn <- \n\n`.cyan.bold)
console.log(`❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤\n\n`.red.bold)

global.SOCKET = new (require('./socket_client.js'))(); // für verbindung zum server

global._AUTO_WATER = true
global._PUMP = -1
global._LED = -1

// pumpe steuern #1

setInterval(async ()=>{
	if(!_AUTO_WATER){return}

	console.log("\n")
	_s("AUTO_WATER", "running")
	let state = await read_moisture_sensor()
	if(state===-1){ //error
		
	}
	else if(state){
		pump_on()	
		setTimeout(()=>pump_off(),4000)
	} else {
		pump_off()
	}	
},10000)


// wasserstand prüfen - rote LED #1
var led_blink
var water_notification_sent = false

setInterval(async ()=>{
	let water = await read_water_level()
	if(water===-1){ //error
		stopBlink()
	}
	else if(!water){
		water_notification_sent = false
		stopBlink()		
	} else {
		startBlink()
		if(!water_notification_sent){
			let res = await SOCKET.raspi_no_water()
			_i("sending notification", res)
			water_notification_sent = true
		}
	}	
},5000)


global.startBlink = function(){
	_i("LED BLINK", "start")
	_LED = true
	clearInterval(led_blink)
	led_blink = setInterval(()=>{
		indicator_led_on()
		setTimeout(indicator_led_off, 200)
	}, 400)	
}

global.stopBlink = function(){
	_i("LED BLINK", "stop")
	_LED = false
	clearInterval(led_blink)
	indicator_led_off()
}




var _data_path = './data/data.json'
global._DATA = JSON.parse(fs.readFileSync(_data_path, 'utf8'));
global.update_DATA = function(){
  fs.writeFileSync(_data_path, JSON.stringify(_DATA));
}


var SERIAL_NUMBER




global.init = async function(new_session=true){

	console.log("new_session", new_session)
	
    SERIAL_NUMBER = await getSerialNumber()
    _i("raspi serial number", SERIAL_NUMBER)
    if(_DATA.code){
    	console.log("\n")
    	_s("BOB CODE", _DATA.code)
    	console.log("\n")
    }

    if(new_session) await SOCKET.init()

    if(!_DATA.verification){ // neue registrierung
	_i("new registration")
        let result = await SOCKET.raspi_verify({serial_number:SERIAL_NUMBER})
	console.log("result", result)        
	if(result.valid){
            _s("SOCKET", "verified")
            console.log("\n")
			_s("BOB CODE", result.code)
			console.log("\n")
            _i("SOCKET", "verification: "  + result.verification)
            _i("Sending notification", "raspi online")
			let res = await SOCKET.raspi_online()
			console.log(res)
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
            _i("Sending notification", "raspi online")
			let res = await SOCKET.raspi_online()
			console.log(res)
        } else {
            _e("SOCKET", "could not connect because: " + result.reason)
        }         
    }


    
    
    
}


init()





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
