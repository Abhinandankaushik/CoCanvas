import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"
const wss = new WebSocketServer({ port: 5000 })

interface User {
    rooms: String[],
    userId: string
    ws: WebSocket,
}

const users: User[] = [];



function checkUser(token: string): (string | null) {

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (typeof decoded === "string") {
            return null
        }

        if (!decoded || !decoded.userId) {
            return null
        }

        return decoded.userId
    }
    catch (error) {
        return null
    }

}

wss.on('connection', (socket, request) => {

    const url = request.url;
    if (!url) {
        return;
    }



    const queryParams = new URLSearchParams(url.split('?')[1]);

    const token = queryParams.get('token') ?? "";

    const userId = checkUser(token)


    if (userId === null) {
        socket.close();
        return null;
    }


    users.push({
        rooms: [],
        userId,
        ws: socket
    })



    socket.on('message', async function message(data) {

        const parseData = JSON.parse(data as unknown as string)

        if (parseData.type === "join_room") {
            const user = users.find(x => x.ws === socket);
            user?.rooms.push(parseData.roomId)

        }


        if (parseData.type === "leave_room") {
            const user = users.find(x => x.ws === socket)
            if (!user) {
                return
            }

            user.rooms = user?.rooms.filter(x => x !== parseData.roomId)
        }

        if (parseData.type === "chat") {
            const roomId = parseData.roomId;
            const message = parseData.message;

            console.log("message aaya :", message)
            await prismaClient.chat.create({
                data: {
                    message,
                    roomId: Number(roomId),
                    userId
                }
            })

            users.forEach(user => {
                if (user.rooms.includes(roomId) && user.ws !== socket) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))

                }
            })
        }

    })



})