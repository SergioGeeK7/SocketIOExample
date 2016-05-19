const http      = require("http");
const socketio  = require("socket.io")
const server    = http.createServer();
const port      = 4000;
const io        = socketio(server);
const fs        = require("fs")
const path      = require("path")

server.on("request",onRequest);
server.on("listening",console.log.bind(null,`Escuchando en ${port}`));
server.listen(4000);
io.on('connection', onConnection);



function onRequest (req,res){
    if(req.url === "/"){
        console.log("retornando");
        return fs.createReadStream(path.join(__dirname,"index.html")).pipe(res);
    }
    
    if(req.url.indexOf(".js")){
        console.log("script");
        return fs.createReadStream(path.join(__dirname,"node_modules/socket.io-client/socket.io.js")).pipe(res);
    }
        
    console.log(req.url);
    res.end();
}


function onConnection (socket){
    console.log(`Client connected ${socket.id}`);
    var data = "sergio andres arboleda".split(" ");
    socket.emit("message",data);
    socket.on("message",onMessage);
    
    
    function onMessage (message){
        console.log(message);
        console.log(typeof message);

        socket.emit("message",message + socket.id);
        socket.broadcast.emit('message', message + socket.id);
    }
    
    
}

