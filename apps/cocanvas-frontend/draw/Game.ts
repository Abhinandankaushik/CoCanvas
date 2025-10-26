import { Tools } from "@/app/util/Tools";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number

} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil"
    startX: number;
    startY: number;
    endX: number;
    endY: number
}

export class Game {

    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string;
    private socket: WebSocket;
    private clicked: boolean;
    private startX: number = 0;
    private startY: number = 0;
    private selectedTool: Tools;
    private scaleFactor: number = 1;
    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.ctx = canvas.getContext("2d")!;
        this.canvas = canvas;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.selectedTool = Tools.Rect
        this.init();
        this.initHandlers();
        this.initMouseHandlers();

    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();

    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape)
                this.clearCanvas()
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.fillStyle = "rgba(0,0,0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.scale(this.scaleFactor, this.scaleFactor)
        this.ctx.lineWidth = (1 / this.scaleFactor)
        this.existingShapes.map(shape => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255,255,255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            } else if (shape.type === "circle") {
                if (shape.radius <= 0) return
                this.ctx.strokeStyle = "rgba(255,255,255)"
                this.ctx.beginPath()
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2)
                this.ctx.stroke();
                this.ctx.closePath();

            }
        })

    }

    setTool(tool: Tools) {
        this.selectedTool = tool;
    }

    mouseDownHandler(e: MouseEvent) {
        this.clicked = true;
        this.startX = e.clientX
        this.startY = e.clientY
    }
    mouseUpHandler(e: MouseEvent) {
        this.clicked = false;
        const width = (e.clientX - this.startX)
        const height = (e.clientY - this.startY)

        //@ts-ignore
        const selectedTool = this.selectedTool
        let shape: Shape | null = null;

        if (selectedTool === "rect") {
            //@ts-ignore
            shape = {
                //@ts-ignore
                type: this.selectedTool,
                x: this.startX / this.scaleFactor,
                y: this.startY / this.scaleFactor,
                height: height / this.scaleFactor,
                width: width / this.scaleFactor
            }
        } else if (selectedTool === "circle") {
            const radius = Math.abs(Math.max(width, height) / 2) / this.scaleFactor;
            const centerX = (this.startX + width / 2) / this.scaleFactor;
            const centerY  = (this.startY + height / 2) / this.scaleFactor;
            //@ts-ignore
            shape = {
                //@ts-ignore
                type: this.selectedTool,
                radius: radius,
                centerX,
                centerY,
            }

        }

        if (!shape) return
        this.existingShapes.push(shape)

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId: this.roomId
        }))
    }
    mouseMoveHandler(e: MouseEvent) {

        if (this.clicked) {
            const width = (e.clientX - this.startX) ;
            const height = (e.clientY - this.startY) ;
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255,255,255)";

            //@ts-ignore
            const selectedTool = this.selectedTool

            if (selectedTool === "rect") {
                this.ctx.beginPath();
                this.ctx.rect(this.startX / this.scaleFactor, this.startY / this.scaleFactor, width/this.scaleFactor, height/this.scaleFactor)
                // this.ctx.strokeRect(this.startX, this.startY, width, height)
                this.ctx.stroke();
            } else if (selectedTool === "circle") {

                const radius = Math.abs(Math.max(width, height) / 2)/this.scaleFactor;
                const centerX = (this.startX + width / 2)/this.scaleFactor;
                const centerY = (this.startY + height / 2)/this.scaleFactor;

                this.ctx.beginPath()
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
                this.ctx.stroke();
                this.ctx.closePath();

            }
        }
    }

    mouseZoomHandler(e: WheelEvent) { // if mouse wheel scroll zoomin means deltaY > 0 , zoomout < 0
        const scale = 0.1;
        e.preventDefault();
        const zoom = e.deltaY > 0 ? 1 - scale : 1 + scale;
        this.scaleFactor *= zoom;
        this.clearCanvas();
    }


    destroy() {

        this.canvas.removeEventListener("mousedown", this.mouseDownHandler.bind(this))
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler.bind(this))
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler.bind(this))
        this.canvas.removeEventListener("wheel", this.mouseZoomHandler.bind(this))

    }

    initMouseHandlers() {

        this.canvas.addEventListener("mousedown", this.mouseDownHandler.bind(this))
        this.canvas.addEventListener("mouseup", this.mouseUpHandler.bind(this))
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler.bind(this))
        this.canvas.addEventListener("wheel", this.mouseZoomHandler.bind(this))
    }



}