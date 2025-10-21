"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            initDraw(canvas, roomId, socket)
        }

        
    }, [canvasRef])


    return (
        <div>
            <canvas
                ref={canvasRef}
                width={1000} height={800}
            ></canvas>

            <div className="flex gap-4">
                <div className="m-2 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition">
                    Rectangle
                </div>
                <div className="m-2 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition">
                    Circle
                </div>
            </div>
        </div>
    )
}