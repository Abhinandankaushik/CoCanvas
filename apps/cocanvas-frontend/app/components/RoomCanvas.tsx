"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Loader2 } from "lucide-react";
import { Canvas } from "./Canvas";

const CanvasPage = ({ roomId }: { roomId: string }) => {

    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(() => {
        console.log("creating new Socket connection")
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NzQ5Zjc1OC04ZTQ3LTQ0ZmEtOGI2YS00NTFkYThjOGM5ZDgiLCJpYXQiOjE3NjA4OTE4OTZ9.GEJESg_-hHqENU0uKHa5IZqP0bUU6x-v1PBfyP72G3M`)

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }

        return () => {
            console.log("closing previous connection")
            socket?.close();
        }

    }, [])



    if (!socket)  //Loader logic when socket connection not open
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <span className="text-lg text-gray-700 font-medium">Connecting...</span>
                </div>
            </div>
        );


    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>

    )
}

export default CanvasPage