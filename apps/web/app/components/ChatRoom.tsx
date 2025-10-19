import axios from "axios"
import { BACKEND_URL } from "../config"
import ChatRoomClient from "./ChatRoomClient"

async function getChats(roomId: string) {
    console.log(roomId)
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`)

    return response.data.messages

}

const ChatRoom = async ({ id }: { id: string }) => {

    const messages = await getChats(id);
    return (
        <ChatRoomClient messages={messages} id={id} />
    )
}

export default ChatRoom