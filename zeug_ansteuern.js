// zeug ansteuern
global.gpio = require('rpi-gpio')
global.gpiop = gpio.promise;

var PUMP_PIN = 35
var MSENSOR_PIN = 37

try {
	gpio.setup(PUMP_PIN, gpio.DIR_OUT)
	gpio.setup(MSENSOR_PIN, gpio.DIR_IN)
} catch(e){
	_e("GPIO DISABLED")
}


/////////////////////////
global.pump_on = async function(){
	try {
		await gpiop.write(PUMP_PIN, true)
		_s("pump", "on")
	} catch(e){
		_e("pump", "GPIO DISABLED")
	}
}

global.pump_off = async function(){	
	try {
		await gpiop.write(PUMP_PIN, false)
		_s("pump", "off")
	} catch(e){
		_e("pump", "GPIO DISABLED")
	}	
}

global.read_moisture_sensor = async function(){
	return new Promise(async resolve=>{
		try {
			resolve(res)
			_s("moisture_sensor", "value: " + res)
		} catch(e){
			_e("moisture_sensor", "GPIO DISABLED")
			resolve(false)
		}
	})
}
/////////////////////////


