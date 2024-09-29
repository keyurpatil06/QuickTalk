import { useAppStore } from "@/store"
import { useSocket } from "@/context/SocketContext"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"

const MessageBar = () => {
  const emojiRef = useRef()
  const socket = useSocket()
  const { selectedChatType, selectedChatData, userInfo } = useAppStore()
  const [message, setMessage] = useState("")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = () => {
    if (socket && selectedChatType === "contact") {
      console.log("Sending message:", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileURL: undefined,
      })
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileURL: undefined,
      })
      setMessage("") // Clear the input after sending
    } else {
      console.error("Socket not initialized or chat type is not 'contact'")
    }
  }

  return (
    <div className="h-[10vh] flex items-center justify-center px-5 mx-9 rounded-3xl mb-5 gap-4">
      <div className="flex-1 flex bg-[#e4f2ff] rounded-2xl items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 px-6 py-4 text-lg bg-transparent text-gray-700 focus:border-none focus:outline-none"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-3xl text-gray-800 top-1 relative" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl text-gray-800" />
        </button>
      </div>
      <button
        className="bg-[#8417ff] rounded-xl flex items-center justify-center p-4 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl text-white -rotate-45" />
      </button>
    </div>
  )
}

export default MessageBar
