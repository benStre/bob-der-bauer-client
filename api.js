// hier custom api functions:

class API {

    echo(data){
        return {you_said: data.message}
    }

    annehans(data){
        return {paul:"nerv nich"}
    }

    pump(data){
    	if(data.state=="on"){
		pump_on()	
		return {status:"the pump is on"}
	} else {
		pump_off()
		return {status:"the pump is off"}
	}

    }	
    
    async m_sensor(data){
	let state = await read_moisture_sensor()
	_i("m_sensor state", state)
    	return {state:state}
    }
}


module.exports = API
