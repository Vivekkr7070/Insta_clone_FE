import React, { useEffect, useState } from "react";
import styles from "./FriendList.module.css"; // Import the CSS module
import { fetchFriends } from "../services/messages";

interface FriendListProps {
  onSelectFriend: (friendId: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await fetchFriends();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    loadFriends();
  }, []);

  return (
    <div className={styles.friendList}>
      <h5>Friends</h5>
      <ul>
        {friends.map((friend) => (
          <li
            key={friend._id}
            className={styles.friendItem}
            onClick={() => onSelectFriend(friend._id)}
          >
            <img
              src={friend.avatar || "https://via.placeholder.com/40"}
              alt={`${friend.username}'s avatar`}
              className={styles.friendAvatar}
            />
            <span className={styles.friendName}>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;