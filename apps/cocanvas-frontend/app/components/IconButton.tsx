import React, { ReactNode } from 'react'

const IconButton = ({
    icon, onClick, activated
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: Boolean
}) => {

    return <div className={`pointer rounded-full border p-2 bg-balck hover:bg-gray-400 hover:cursor-pointer ${activated ? "text-amber-800" : "text-white"}`} onClick={onClick}>
        {icon}
    </div >
}
export default IconButton