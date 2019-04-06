// zeug ansteuern
global.gpio = require('rpi-gpio')
global.gpiop = gpio.promise;

var PUMP_PIN = 35
var MSENSOR_PIN = 37

gpiop.setup(PUMP_PIN, gpio.DIR_OUT)
gpiop.setup(MSENSOR_PIN, gpio.DIR_IN)


/////////////////////////
global.pump_on = function(){
	_s("pump", "on")
	gpiop.write(PUMP_PIN, true)

}
global.pump_off = function(){
	_s("pump", "off")
	gpiop.write(PUMP_PIN, false)

}
global.read_moisture_sensor = async function(){
	_s("moisture_sensor", "read value")
	return gpiop.read(MSENSOR_PIN)
}
/////////////////////////


