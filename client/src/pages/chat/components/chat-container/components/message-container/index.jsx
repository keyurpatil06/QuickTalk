import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from "react-icons/io5"

const MessageContainer = () => {
  const scrollRef = useRef()
  const {
    selectedChatType,
    selectedChatMessages,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

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

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico|heic)$/i;
    return imageRegex.test(filePath);
  }

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

  const downloadFile = async (url) => {
    const response = await apiClient.get(`${HOST}/${url}`, { responseType: "blob" });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', url.split('/').pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
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
        {message.messageType === 'file' && (
          <div className={`${message.sender !== selectedChatData._id ? 'bg-red-300' : 'bg-purple-400'} border inline-block p-4 rounded max-w-[50%] break-words`}>
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img src={`${HOST}/${message.fileUrl}`} alt="image" height={300} width={300} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white text-3xl bg-black rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split('/').pop()}</span>
                <span
                  className="bg-black p-3 text-3xl rounded-full cursor-pointer transition-all duration-300 "
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown className="text-white" />
                </span>
              </div>
            )}
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
  <div ref={scrollRef} />
  {showImage && (
    <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
      <div className="p-2 bg-red-300 max-w-full max-h-full">
        <img
          src={`${HOST}/${imageUrl}`}
          alt="image-display"
          className="w-auto max-h-[80vh] object-contain"
        />
      </div>
      <div className="flex gap-5 fixed top-0 mt-5">
        <button
          className="bg-black p-3 text-3xl rounded-full cursor-pointer transition-all duration-300"
          onClick={() => downloadFile(message.fileUrl)}
        >
          <IoMdArrowRoundDown className="text-white" />
        </button>
        <button
          className="bg-black p-3 text-3xl rounded-full cursor-pointer transition-all duration-300"
          onClick={() => {
            setShowImage(false);
            setImageUrl(null);
          }}
        >
          <IoCloseSharp className="text-white" />
        </button>
      </div>
    </div>
  )}
</div>

  )
}

export default MessageContainer
