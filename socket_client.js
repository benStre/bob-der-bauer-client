class Socket {

    constructor(){
        this.TAG = "SOCKET"
        this.server_url = 'https://bauerbob.herokuapp.com/'
       
        //this.init()
        this.on_api = (func, data)=>{ // wenn eine api function aufgerufen wird
            return new Promise(async resolve=>{
                if(typeof API[func] === 'function'){
                    console.log("\n")
                    _i("API function called", func)
                    let result = await API[func](data)
                    if(typeof result!=="object"){
                        resolve({valid:false, reason:`the function '${func}' did not return a proper object`})  
                    } else {
                        resolve({valid:true, ...result})                
                    }
                } else {
                  resolve({valid:false, reason:`the function '${func}' does not exist`})
                }            
            })
        }
        
        _s(this.TAG, "initialized")
    }

    get_use_server(){
        return new Promise(resolve=>{
            var https = require('https');

            var request = https.request({
                host: 'bauerbob.herokuapp.com',
                path: '/use_server_raw'
            }, (res)=> {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end',  ()=> {
                    _i(this.TAG,  "using server " + data)
                    resolve(data/*"https://bauerbob.herokuapp.com"*/)
                });
            });       
            request.on('error', function (e) {
                _e(this.TAG, e.message);
            });
            request.end();     
        })

    }

    async init(){

        this.server_url = await this.get_use_server()

        let no_callback = true

        return new Promise(resolve=>{
	    console.log("trying to connect with " + this.server_url)

            // Verbindung zum Server
            this.socket = require('socket.io-client')(this.server_url);

            this.socket.on('connect', async ()=>{
                _i(this.TAG, "Connected to "+ this.server_url)
                if(no_callback){
                    no_callback = false
                } else {
                    init()
                }
                resolve()
            });

            this.socket.on('api', async (data, c)=>{
                let result = await this.on_api(data.func, data.data)
                c(result)
            });

            this.socket.on('disconnect', ()=>{
                this.disconnected()
            });            
        })
        

    }


    

    disconnected(){
        _e(this.TAG, "disconnected")
        
    }

    async socket_emit(tag, data){
        return new Promise(resolve => {
            this.socket.emit(tag, data, (data)=>{
            resolve(data);
            });         
        });                      
    }


    async raspi_verify(data) { // {user: "xyz", password:"123"}
        return await this.socket_emit("raspi_verify", data)
    }

    async raspi_connect(data) { // {session_id: "asd8ui32jekwla"}
        return await this.socket_emit("raspi_connect", data)
    }

    async raspi_no_water(data) { // {session_id: "asd8ui32jekwla"}
        return await this.socket_emit("raspi_no_water", data)
    }

    async raspi_online(data) { // {session_id: "asd8ui32jekwla"}
        return await this.socket_emit("raspi_online", data)
    }

    

}


module.exports = Socket
