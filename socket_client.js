class Socket {

    constructor(){
        this.TAG = "SOCKET"
        this.server_url = 'https://bauerbob.herokuapp.com/'
       
        //this.init()

        _s(this.TAG, "initialized")
    }

    get_use_server(){
        return new Promise(resolve=>{
            var https = require('https');

            var request = https.request({
                host: 'bauerbob.herokuapp.com',
                path: '/use_server'
            }, (res)=> {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end',  ()=> {
                    _i(this.TAG,  "using server " + data)
                    resolve(data)
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

        return new Promise(resolve=>{
            // Verbindung zum Server
            this.socket = require('socket.io-client')(this.server_url);

            this.socket.on('connect', ()=>{
                _i(this.TAG, "Connected to "+ this.server_url)
                resolve()
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

}


module.exports = Socket