import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants"
import moment from "moment"
import { useEffect, useRef } from "react"

const MessageContainer = () => {
  const scrollRef = useRef()
  const {
    selectedChatType,
    selectedChatMessages,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore()

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        )

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log(`Error in get Messages function : ${error}`)
      }
    }
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages()
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessages])

  const renderMessages = () => {
    let lastDate = null

    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return <div className="text-center text-gray-500 my-2">No messages</div>
    }

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      lastDate = messageDate

      // Debugging logs
      console.log(`Rendering message: ${message.content}`, {
        sender: message.sender,
        recipient: message.recipient,
        timestamp: message.timestamp,
      })

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      )
    })
  }

  const renderDMMessages = (message) => {
    const isSender = message.sender === selectedChatData._id
    const messageClass = isSender
      ? "bg-[#E7E7E7] text-gray-700"
      : "bg-[#6E00FF] text-white"

    return (
      <div className={`${isSender ? "text-left" : "text-right"} mb-1`}>
        {message.messageType === "text" && (
          <div
            className={`${messageClass} font-semibold border inline-block p-4 rounded-3xl my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        <div className={`text-xs text-gray-600 ${isSender ? "ml-2" : "mr-1"}`}>
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] s:w-full">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  )
}

export default MessageContainer
