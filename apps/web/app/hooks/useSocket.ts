import { useEffect, useState } from "react";
import { WS_URL } from "../config";


export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NzQ5Zjc1OC04ZTQ3LTQ0ZmEtOGI2YS00NTFkYThjOGM5ZDgiLCJpYXQiOjE3NjA4OTE4OTZ9.GEJESg_-hHqENU0uKHa5IZqP0bUU6x-v1PBfyP72G3M`)
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return {
        socket,
        loading
    }
}