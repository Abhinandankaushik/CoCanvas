import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { } from "@repo/common/types"
const wss = new WebSocketServer({ port: 5000 })

wss.on('connection', (socket, request) => {

    const url = request.url;
    if (!url) {
        return;
    }

    console.log(url)

    const queryParams = new URLSearchParams(url.split('?')[1]);
    console.log(queryParams)

    const token = queryParams.get('token') ?? ""
    console.log(token)

    const decoded = jwt.verify(token, JWT_SECRET)
    console.log(decoded)


    if (typeof decoded == "string") {
        socket.close();
        return;
    }

    if (!decoded || !decoded.userId) {
        socket.close();
        return;
    }


    socket.on('message', function message(data) {
        socket.send('pong')
    })

})