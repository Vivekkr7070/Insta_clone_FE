import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./ChatArea.module.css"; // Import the CSS module
import { fetchMessages } from "../services/messages";
import { getUserDetails } from "../services/user";

interface Message {
  from: string;
  message: string;
}

interface FriendInfo {
  name: string;
  pic: string;
}

const ChatArea: React.FC<{ friendId: string }> = ({ friendId }) => {
  const { socket, userId } = useContext(AuthContext); // Ensure `AuthContext` provides `socket` and `userId`
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [friendInfo, setFriendInfo] = useState<FriendInfo | null>(null);

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on("receive_message", (data: Message) => {
        setMessages((prev) => [...prev, data]);
        console.log(messages, "-----------------");
      });

      // Fetch previous messages
      const loadMessages = async () => {
        try {
          const response = await fetchMessages(friendId);
          setMessages(response);
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      };
      loadMessages();

      // Fetch friend info
      const loadFriendInfo = async () => {
        try {
          const user = await getUserDetails(friendId);
          const friendInfoData: FriendInfo = {
            name: user.username,
            pic: user.avatar,
          };
          setFriendInfo(friendInfoData);
        } catch (error) {
          console.error("Error fetching friend info:", error);
        }
      };
      loadFriendInfo();

      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket, friendId]);

  const sendMessage = () => {
    if (!friendId || !newMessage.trim() || !userId || !socket) {
      alert("Friend ID and message are required.");
      return;
    }

    // Emit private message to the socket
    socket.emit("private_message", {
      to: friendInfo?.name,
      // from: userId,
      message: newMessage,
    });

    // Update the message state
    setMessages((prev) => [...prev, { from: "You", message: newMessage }]);
    setNewMessage("");

    // Reset textarea height
    const textarea = document.querySelector(
      `.${styles.chatInput}`
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  return (
    <div className={styles.chatArea}>
      {/* Chat Header */}
      {friendInfo && (
        <div className={styles.chatHeader}>
          <img
            src={friendInfo.pic || "https://via.placeholder.com/40"}
            alt={`${friendInfo.name}'s profile`}
            className={styles.userPic}
          />
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{friendInfo.name}</h3>
          </div>
        </div>
      )}

      {/* Messages Section */}
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.from === "You" ? styles.myMessage : styles.friendMessage
            }
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Chat Input Section */}
      <div className={styles.chatInputContainer}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className={styles.chatInput}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent default behavior for sending a message
              sendMessage();
            }
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto"; // Reset the height to recalculate
            target.style.height = `${target.scrollHeight}px`; // Dynamically set height based on content
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!socket || !newMessage.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
