// zeug ansteuern
global.gpio = require('rpi-gpio')
global.gpiop = gpio.promise;

// PIN Belegung (GPIO)
var PUMP_PIN = 35
var MSENSOR_PIN = 37
var INDICATOR_LED_PIN = 31
var WATER_LEVEL_PIN = 33

// init pins (IN/OUT)
try {
	gpio.setup(PUMP_PIN, gpio.DIR_OUT)
	gpio.setup(INDICATOR_LED_PIN, gpio.DIR_OUT)
	gpio.setup(MSENSOR_PIN, gpio.DIR_IN)
	gpio.setup(WATER_LEVEL_PIN, gpio.DIR_IN)
} catch(e){
	_e("GPIO DISABLED")
}


///////////////////////// ANSTEUERUNGS-FUNKTIONEN /////////////////////////

global.pump_on = async function(){
	try {
		await gpiop.write(PUMP_PIN, true)
		_s("pump", "on")
		_PUMP = true
	} catch(e){
		_e("pump", "GPIO DISABLED")
		_PUMP = -1
	}
}

global.pump_off = async function(){	
	try {
		await gpiop.write(PUMP_PIN, false)
		_s("pump", "off")
		_PUMP = false
	} catch(e){
		_e("pump", "GPIO DISABLED")
		_PUMP = -1
	}	
}

global.read_moisture_sensor = async function(){
	return new Promise(async resolve=>{
		try {
			let res = await gpiop.read(MSENSOR_PIN)
			resolve(res)
			_s("moisture_sensor", "value: " + res)
		} catch(e){
			_e("moisture_sensor", "GPIO DISABLED")
			resolve(-1)
		}
	})
}

global.read_water_level = async function(){
	return new Promise(async resolve=>{
		try {
			let res = await gpiop.read(WATER_LEVEL_PIN)
			resolve(res)
			_s("water_level", "value: " + res)
		} catch(e){
			_e("water_level", "GPIO DISABLED")
			resolve(-1)
		}
	})
}

global.indicator_led_on = async function(){
	return new Promise(async resolve=>{
		try {
			await gpiop.write(INDICATOR_LED_PIN, true)
		} catch(e){
			//_e("indicator_led", "GPIO DISABLED")
		}
	})
}

global.indicator_led_off = async function(){
	return new Promise(async resolve=>{
		try {
			await gpiop.write(INDICATOR_LED_PIN, false)
		} catch(e){
			//_e("indicator_led", "GPIO DISABLED")

		}
	})
}
/////////////////////////


