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

    led(data){
    	if(data.state=="on"){
			pump_on()	
			return {status:"the led is on"}
		} else {
			pump_off()
			return {status:"the led is off"}
		}
    }

    auto_water(data){
    	if(data.state=="on"){
			_AUTO_WATER = true
			_s("AUTO_WATER", "enabled")
		} else {
			_AUTO_WATER = false
			_e("AUTO_WATER", "disabled")
		}
    }

    get_states(data){
    	if(data.name="auto_water"){
    		return {
    			auto_water:_AUTO_WATER,
    			pump: 1,//_PUMP,
    			led: 1,//_LED
    		}
    	}
    }

    something(data){
    	_i("42", "...irgendwas "+data.state+" !!1!1")
    }
    
    async m_sensor(data){
	let state = await read_moisture_sensor()
	_i("m_sensor state", state)
    	return {state:state}
    }
}


module.exports = API
