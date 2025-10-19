"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";


const ChatRoomClient = ({
    messages,
    id
}: {
    messages: { message: string }[];
    id: string
}) => {

    const { socket, loading } = useSocket();
    const [chats, setChats] = useState(messages)
    const [currentMsg, setCurrentMsg] = useState("")
    useEffect(() => {
        if (!socket || loading) return;

        // Join room once
        socket.send(JSON.stringify({
            type: "join_room",
            roomId: id
        }));

        const handleMessage = (event: MessageEvent) => {
            const parseData = JSON.parse(event.data);
            if (parseData.type === "chat") {
                setChats(c => [...c, parseData]);
            }
        };

        socket.addEventListener("message", handleMessage);

        const handleClose = () => console.log("Connection closed ❌, retrying...");
        const handleError = (err: Event) => {
            console.error("WebSocket error:", err);
            socket.close();
        };

        socket.addEventListener("close", handleClose);
        socket.addEventListener("error", handleError);

        // Cleanup on unmount or socket change
        return () => {
            socket.removeEventListener("message", handleMessage);
            socket.removeEventListener("close", handleClose);
            socket.removeEventListener("error", handleError);
        };
    }, [socket, loading, id]);



    return (
        <div>
            {
                chats.map((m, i) => <div key={i}>{m.message}</div>)
            }
            <input type="text" value={currentMsg} onChange={(e) => setCurrentMsg(e.target.value)} />
            <button onClick={() => {
                socket?.send(JSON.stringify({
                    type: "chat",
                    roomId: id,
                    message: currentMsg
                }))
                setCurrentMsg("")
            }}>Send message</button>

        </div>
    )
}

export default ChatRoomClient