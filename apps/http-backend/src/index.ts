import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { createUserSchema, SinginSchema, CreateRoomSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import bcryptjs from "bcryptjs"

const app = express()



app.post("/signup", async (req, res) => {

    const parsedData = createUserSchema.safeParse(req.body)

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
            userInDb: user
        })
    } catch (error) {

        res.status(411).json({
            message: "User already exist with this username"
        })
    }
})


app.post("/signin", (req, res) => {

    const userId = 1;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        token
    })
})


app.post("/room", middleware, (req, res) => {

    //db call
    res.json({
        roomId: 123
    })
})

//Todo : add dynamic port number in .env
app.listen(3001, () => console.log("express backend runnig"))