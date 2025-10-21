"use client"
import { useEffect, useRef } from "react"

export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        if (canvasRef.current) {

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            ctx.strokeRect(10, 10, 100, 100)
        
        }
    }, [canvasRef])

    return (
        <div>
            <canvas ref={canvasRef} className="w-[500px] h-[500px]"></canvas>
        </div>
    )
}