import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 5000})

wss.on('connection',(socket)=>{
    console.log("user connected")
    socket.on("message",(data)=>{
            socket.send("pong")
    })
})