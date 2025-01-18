import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserDetails, getSuggestions } from "../services/user";
import profilePic from "../assets/download.jpg";

interface Profile {
  username: string;
  avatar: string;
  followers: number;
  following: number;
}

interface Suggestion {
  id: string;
  username: string;
  avatar: string;
}

const UserProfile: React.FC = () => {
  const { userId, logout } = useContext(AuthContext); // Context with logout method
  const [profile, setProfile] = useState<Profile | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Number formatter for formatting numbers with commas
  const numberFormatter = new Intl.NumberFormat("en-US");

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        console.error("User ID is missing");
        logout(); // Logout if userId is not available
        return;
      }

      try {
        // Fetch user data
        const userData = await getUserDetails(userId);

        // Ensure followers and following are numbers by counting array lengths
        const userProfile: Profile = {
          username: userData.username,
          avatar: userData.avatar || profilePic, // Corrected fallback to use `logo` directly
          followers: Array.isArray(userData.followers)
            ? userData.followers.length
            : 0,
          following: Array.isArray(userData.following)
            ? userData.following.length
            : 0,
        };

        setProfile(userProfile);

        // Fetch suggestions for follow
        // const followSuggestions = await getSuggestions(userId);
        // setSuggestions(followSuggestions);
      } catch (error) {
        console.error("Error fetching profile or suggestions:", error);
      }
    };
    loadData();
  }, [userId, logout]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-info mb-3">
        <img
          src={profile.avatar}
          alt={`${profile.username}'s avatar`}
          className="rounded-circle mb-2"
          style={{ width: "80px", height: "80px" }}
        />
        <h5>{profile.username}</h5>
        <p>
          <strong>{numberFormatter.format(profile.followers)}</strong> Followers
          | <strong>{numberFormatter.format(profile.following)}</strong>{" "}
          Following
        </p>
      </div>

      <hr />

      <h6>Suggestions</h6>
      {suggestions.map((user) => (
        <div
          key={user.id}
          className="suggestion d-flex align-items-center mb-2"
        >
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px" }}
          />
          <span>{user.username}</span>
        </div>
      ))}

      <button onClick={logout} className="btn btn-danger mt-3">
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
