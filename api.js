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
	} else {
		pump_off()
	}
    }	
}


module.exports = API
