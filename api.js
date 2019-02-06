// hier custom api functions:

class API {

    async echo(data){
        return {you_said: data.message}
    }

}


module.exports = API