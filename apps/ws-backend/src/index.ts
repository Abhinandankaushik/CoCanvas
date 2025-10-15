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

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') ?? ""
    const decoded = jwt.verify(token, JWT_SECRET)


    if (!decoded || !(decoded as JwtPayload).userId) {
        socket.close();
        return;
    }


    socket.on('message', function message(data) {
        socket.send('pong')
    })

})