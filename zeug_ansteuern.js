// zeug ansteuern
global.gpio = require('rpi-gpio')
global.gpiop = gpio.promise;

var PIN = 35

gpiop.setup(PIN, gpio.DIR_OUT)


/////////////////////////
global.pump_on = function(){
	_s("pump", "on")
	gpiop.write(PIN, true)

}
global.pump_off = function(){
	_s("pump", "off")
	gpiop.write(PIN, false)

}
/////////////////////////


