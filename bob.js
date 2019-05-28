// bob.js
require('./echo.js'); // für Console-Output
var fs = require('fs'); // Dateien lesen
require('./zeug_ansteuern.js'); // GPIOs ansteuern

global.API = new (require('./api.js'))(); // die Web API 
global.SOCKET = new (require('./socket_client.js'))(); // für Verbindung zum Server


console.log(`❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤`.red.bold)
console.log(`\n\n                BOB-DER-BAUER-client v.0.1`.green.bold)
console.log(`       -> created by Anne, Benedikt, Paul & Finn <- \n\n`.cyan.bold)
console.log(`❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤\n\n`.red.bold)


// Parameter für die Bewässerung 
global._AUTO_WATER = true
global._PUMP = -1
global._LED = -1

global.SERIAL_NUMBER

// Pumpe an- /ausschalten, wenn Boden zu trocken ist: 
setInterval(async ()=>{
	if(!_AUTO_WATER){return} // automatische Bewässerung ausgeschaltet?

	console.log("\n")
	_s("AUTO_WATER", "running")
	let state = await read_moisture_sensor() // Bodenfeuchtigkeit überprüfen
	if(state){ // zu trocken: Pumpe 4s lang einschalten
		pump_on()	
		setTimeout(()=>pump_off(),4000)
	} else { // Pumpe ausschalten
		pump_off()
	}	
},1000*60*2) // alle 2 min wiederholen


// Wasserstand im Wassertank prüfen
var led_blink = false // LED-Status: blinkt / ist aus
var water_notification_sent = false

setInterval(async ()=>{
	let water = await read_water_level() // Wasserstand überprüfen
	if(water===-1){ // Fehler
		stopBlink()
	}
	else if(!water){  // Wassertank voll
		water_notification_sent = false
		stopBlink() // rote LED ausschalten
	} else {          // Wassertank leer!
		startBlink() // rote LED blinken lassen
		if(!water_notification_sent){ // falls noch nicht gesendet, Benachrichtigung an User senden
			let res = await SOCKET.raspi_no_water()
			_i("sending notification", res)
			water_notification_sent = true
		}
	}	
},1000*60*10) // alle 10 min wiederholen


// LED-Blink-Funktionen
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



// Daten aus der data.json Datei auslesen (keys...)
var _data_path = './data/data.json'
global._DATA = JSON.parse(fs.readFileSync(_data_path, 'utf8'));

// Funktion zum Schreiben neuer Daten in die data.json-Datei
global.update_DATA = function(){
  fs.writeFileSync(_data_path, JSON.stringify(_DATA));
}



// Verbindung mit dem Server:
global.init = async function(new_session=true){

	console.log("new_session", new_session)
	
    SERIAL_NUMBER = await getSerialNumber() // Serial Number des Raspi auslesen
    _i("raspi serial number", SERIAL_NUMBER)

    // Den Verbindungs-Code für diesen Raspberry Pi zum Eingeben auf der Website anzeigen:
    if(_DATA.code){
    	console.log("\n")
    	_s("BOB CODE", _DATA.code)
    	console.log("\n")
    }

    if(new_session) await SOCKET.init() // neuen Socket zur Kommunikation mit dem Server erstellen (->socket_client.js)

    if(!_DATA.verification){ // neue Registrierung für den Raspi
		_i("new registration")
        let result = await SOCKET.raspi_verify({serial_number:SERIAL_NUMBER}) // Registrierung mit Serial Number anfordern
		console.log("result", result)        
		if(result.valid){ // Erfolgreich
				_s("SOCKET", "verified")
				console.log("\n")
				_s("BOB CODE", result.code) // Verbindung-Code anzeigen (zum Eingeben auf der Website)
				console.log("\n")
				_i("SOCKET", "verification: "  + result.verification)
				
				// Falls bereits ein Benutzer existiert, diesen informieren (Benachrichtigung), dass der Raspi wieder online ist
				_i("Sending notification", "raspi online")
				let res = await SOCKET.raspi_online()

				// neue Login-Daten speichern:
				_DATA.code = result.code
				_DATA.verification = result.verification
				update_DATA() 
			} else {
				_e("SOCKET", "could not verify because: " + result.reason)
			}         
	} else { // bereits registriert	
		// Verbindungsanfrage an den Server
		let result = await SOCKET.raspi_connect({serial_number:SERIAL_NUMBER, verification:_DATA.verification})
		if(result.valid){
			// Erfolgreich verbunden
			_s("SOCKET", "connected")

			// Benutzer informieren, dass der Raspi wieder online ist (Benachrichtigung)
			_i("Sending notification", "raspi online")
			let res = await SOCKET.raspi_online()
			console.log(res)
		} else {
			_e("SOCKET", "could not connect because: " + result.reason)
		}         
	}
    
}


init()


// Funktion zum Erhalten der Seriennummer als eindeutige Identifikation für den Raspberry Pi:
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