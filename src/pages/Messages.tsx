import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FriendList from "../components/FriendList";
import ChatArea from "../components/ChatArea";
import styles from "./Messages.module.css";

interface LocationState {
  state: {
    friendId?: string;
    showAllFriends?: boolean;
  };
}

const Messages: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [showAllFriends, setShowAllFriends] = useState<boolean>(true); // Default to showing all friends
  const navigate = useNavigate();
  const location = useLocation() as LocationState;

  useEffect(() => {
    // Determine the behavior based on navigation state
    if (location.state) {
      setSelectedFriend(location.state.friendId || null);
      setShowAllFriends(location.state.showAllFriends ?? true);
    }
  }, [location.state]);

  return ( 
    <div className={styles.messagesPage}>
      {/* Back Button */}
      <button
        className={`btn ${styles.backButton}`}
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {/* Split Layout */}
      <div className={styles.messagesContainer}>
        {/* Left Panel: Friends List */}
        {showAllFriends && (
          <div className={styles.friendsPanel}>
            <FriendList onSelectFriend={setSelectedFriend} />
          </div>
        )}

        {/* Right Panel: Chat Area */}
        <div className={styles.chatPanel}>
          {selectedFriend ? (
            <ChatArea friendId={selectedFriend} />
          ) : (
            <div className={styles.noFriendSelected}>
              <p>Select a friend to start chatting!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;