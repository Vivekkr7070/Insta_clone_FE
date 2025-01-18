import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import UserProfile from "../components/UserProfile";
import { getPosts } from "../services/posts";
import styles from "./Home.module.css";
import CreatePostModal from "../components/CreatePostModal"; // Import modal component

interface Post {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  imageUrl?: string;
  likes: any[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        console.log("🚀 Posts data:", data);

        // Handle the case where no data or invalid structure is returned
        if (!data || !Array.isArray(data.posts)) {
          setError("No posts available right now.");
          setPosts([]);
        } else {
          setPosts(data.posts);
        }
      } catch (err: any) {
        console.error("Error fetching posts:", err.message);
        setError("Failed to load posts. Please try again later.");
        setPosts([]); // Set posts to an empty array to handle the UI gracefully
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleNavigateToMessages = () => {
    navigate("/messages", { state: { showAllFriends: true } });
  };

  if (loading) return <div className={styles.loading}>Loading posts...</div>;

  return (
    <div className={styles.homeContainer}>
      <div className={styles.profileSection}>
        <UserProfile />
      </div>
      <div className={styles.feedSection}>
        {error ? (
          <p className="alert alert-danger">{error}</p>
        ) : posts && posts.length === 0 ? (
          <p className={styles.noPosts}>No posts to display right now.</p>
        ) : (
          posts?.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
      <div className={styles.messagingIcon}>
        <button className="btn btn-primary" onClick={handleNavigateToMessages}>
          Messages
        </button>
      </div>
      <div className={styles.createPost}>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          Create Post
        </button>
      </div>
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)} setPosts={function (): void {
            throw new Error("Function not implemented.");
          } }        />
      )}
      {" "}
    </div>
  );
};

export default Home;