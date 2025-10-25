import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { createUserSchema, SinginSchema, CreateRoomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import bcryptjs from "bcryptjs"
import cors from "cors"

const app = express()


app.use(express.json())


app.use(cors({
   origin: ["http://localhost:3002", "http://localhost:3000"]
}));

app.post("/signup", async (req, res) => {

    const parsedData = createUserSchema.safeParse(req.body)

    console.log(parsedData)
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return
    }
    const hashedPassword = await bcryptjs.hash(parsedData.data.password, 10);

    try {
        //db call
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name
            }

        })

        res.json({
            message: "User created Successfull",
            userId: user.id,
        })
    } catch (error) {

        res.status(411).json({
            message: "User already exist with this username"
        })
    }
})


app.post("/signin", async (req, res) => {

    const parseData = SinginSchema.safeParse(req.body)

    if (!parseData.success) {
        res.json({
            message: "Incorrect Inputs"
        })
        return
    }

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                email: parseData.data.username,
            },
            select: {
                id: true,
                email: true,
                photo: true,
                password: true
            }
        })

        if (!user || !user.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const authenticatedUser = await bcryptjs.compare(
            parseData.data.password,
            user.password
        );

        if (!authenticatedUser) {
            res.status(500).json({
                message: "Invalid credentials"
            })
            return
        }

        const token = jwt.sign({
            userId: user?.id
        }, JWT_SECRET)

        res.status(200).json({
            token
        })


    } catch (error) {

        res.status(401).json({
            message: "Unknown error from catch"
        })
    }
})


app.post("/room", middleware, async (req, res) => {

    const parseData = CreateRoomSchema.safeParse(req.body)

    if (!parseData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return
    }

    try {
        //@ts-ignore : TODO : Fix this 
        const userId = req.userId
        //db call

        const room = await prismaClient.room.create({
            data: {
                slug: parseData.data.name,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (error) {
        res.status(411).json({
            message: "Room already exist with this name"
        })
    }
})


app.get("/chats/:roomId", async (req, res) => {

    try {
        const roomId = Number(req.params.roomId)
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                roomId: 'desc'
            },
            take: 1000
        })

        res.json({
            messages
        })
    }
    catch (error) {
        res.status(401).json({
            message: "room id not found"
        })
    }
})



app.get("/room/:slug", async (req, res) => {

    const slug = req.params.slug
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        },
    })

    res.json({
        room
    })
})

app.get("/", (req, res) => res.send("hello from express backend"))

//Todo : add dynamic port number in .env
app.listen(8000, () => console.log("express backend runnig "))