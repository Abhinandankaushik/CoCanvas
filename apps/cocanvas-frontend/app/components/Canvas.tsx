"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from 'react-use';
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontal, } from "lucide-react";
import { Tools } from "../util/Tools";
import { Game } from "@/draw/Game";


export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game | null>(null)
    const { width, height } = useWindowSize();
    const [selectedTool, setSelectTool] = useState<Tools>(Tools.Rect)


    useEffect(() => {
        game?.setTool(selectedTool)
    }, [selectedTool, game]);


    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);
        }

        return () => {
            game?.destroy();
        }

    }, [canvasRef])


    return (
        <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
            <canvas
                ref={canvasRef}
                width={width} height={height}
            >
            </canvas>

            <Topbar selectedTool={selectedTool} setSelectedTool={setSelectTool} />


        </div>
    )
}

function Topbar({ selectedTool, setSelectedTool }: {
    selectedTool: Tools,
    setSelectedTool: (s: Tools) => void
}) {

    return <div style={{
        position: "fixed",
        top: 10,
        left: 10,
    }}>

        <div className="flex gap-2">
            <IconButton activated={selectedTool === Tools.Pencil} icon={<Pencil />} onClick={() => { setSelectedTool(Tools.Pencil) }} />
            <IconButton activated={selectedTool === Tools.Rect} icon={<RectangleHorizontal />} onClick={() => { setSelectedTool(Tools.Rect) }} />
            <IconButton activated={selectedTool === Tools.Circle} icon={< Circle />} onClick={() => { setSelectedTool(Tools.Circle) }} />
        </div>

    </div>
}