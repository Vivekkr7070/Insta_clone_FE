import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  checkIsFollowing,
  followUser,
  getUserDetails,
  unfollowUser,
} from "../services/user";
import profilePic from "../assets/download.jpg";

import Button from "./Button"; // Assuming you have a Button component
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

interface UserData {
  username: string;
  avatar?: string;
  followers?: string[] | number;
  following?: string[] | number;
}

interface Profile {
  username: string;
  avatar: string;
  followers: number;
  following: number;
}

const FriendsProfile: React.FC = () => {
  const { id = " " } = useParams<{ id: string }>(); // Selected profile ID from URL
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // Track follow state
  const [isLoggedInUserProfile, setIsLoggedInUserProfile] =
    useState<boolean>(false); // Track if viewing own profile
  const navigate = useNavigate();
  const { userId, token } = useContext(AuthContext); // Logged-in user's ID from AuthContext

  useEffect(() => {
    const loadData = async () => {
      if (!id || !userId) return;

      try {
        // Fetch user profile data
        const userData: UserData = await getUserDetails(id);

        const getCount = (value: string[] | number | undefined): number => {
          if (Array.isArray(value)) {
            console.log("🚀 ~ getCount ~ value:", value);
            return value.length;
          }
          if (typeof value === "number") {
            console.log("🚀 ~ getCount ~ value:", value);
            return value;
          }
          return 0;
        };

        const userProfile: Profile = {
          username: userData.username,
          avatar: userData.avatar || profilePic,
          followers: getCount(userData.followers),
          following: getCount(userData.following),
        };

        setProfile(userProfile);

        // Check if logged-in user is viewing their own profile
        setIsLoggedInUserProfile(userId === id);

        // Check if the logged-in user is following the selected user
        const response = await checkIsFollowing(userId, id);
        setIsFollowing(response); // Update follow state
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          "There was an issue loading the profile. Please try again later."
        );
      }
    };

    loadData();
  }, [id, userId]);

  const handleFollow = async () => {
    if (!id || !token) {
      console.error("User ID or token is missing");
      return; // Exit the function if id or token is null/undefined
    }

    try {
      await followUser(id, token); // Call followUser API
      console.log("User followed successfully");

      // Increment the viewed profile's followers
      setProfile((prevProfile) =>
        prevProfile
          ? { ...prevProfile, followers: prevProfile.followers + 1 }
          : null
      );

      // Optional: If tracking logged-in user's following count
      // setProfile((prevProfile) => ({
      //   ...prevProfile,
      //   following: prevProfile.following + 1,
      // }));

      setIsFollowing(true);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleUnFollow = async () => {
    if (!id || !token) {
      console.error("User ID or token is missing");
      return; // Exit the function if id or token is null/undefined
    }
    try {
      await unfollowUser(id, token); // Call unfollowUser API
      console.log("User unfollowed successfully");

      // Decrement the viewed profile's followers
      setProfile((prevProfile) =>
        prevProfile
          ? { ...prevProfile, followers: prevProfile.followers - 1 }
          : null
      );

      // Optional: If tracking logged-in user's following count
      // setProfile((prevProfile) => ({
      //   ...prevProfile,
      //   following: prevProfile.following - 1,
      // }));

      setIsFollowing(false);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleMessage = (id: string) => {
    navigate("/messages", { state: { friendId: id, showAllFriends: false } });
  };
  
  if (error) {
    return <div>{error}</div>;
  }

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
          <strong>{profile.followers}</strong> Followers |{" "}
          <strong>{profile.following}</strong> Following
        </p>

        {/* Show different actions based on the profile */}
        {!isLoggedInUserProfile && (
          <div className="flex items-center gap-2">
            {isFollowing ? (
              <>
                <Button className="h-8" onClick={handleUnFollow}>
                  Unfollow
                </Button>
                <Button className="h-8" onClick={() => handleMessage(id!)}>
                  Message
                </Button>
              </>
            ) : (
              <Button
                className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                onClick={handleFollow}
              >
                Follow
              </Button>
            )}
          </div>
        )}

        {isLoggedInUserProfile && (
          <Button className="h-8 bg-gray-300 cursor-not-allowed">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default FriendsProfile;
