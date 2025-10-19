import { WS_URL, BACKEND_URL } from "../../config"
import axios from "axios"
import ChatRoom from "../../components/ChatRoom";
async function getRoomId(slug: string) {
    console.log("slug is #",slug)
    const res = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return res.data.room.id;

}
const page = async ({ params }: {
    params: {
        slug: string
    }
}) => {
    const slug = (await params).slug
    const roomId = await getRoomId(slug)
    return (
        <ChatRoom id={roomId} />
    )
}

export default page