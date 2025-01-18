import React, { useState } from "react";
import styles from "./PostCard.module.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    user: {
      _id: string;
      username: string;
      email: string;
    };
    imageUrl?: string | undefined;
    likes: any[];
    comments: any[];
    createdAt: string;
    updatedAt: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const navigate = useNavigate(); // Initialize useNavigate


  // useEffect(() => {
  //   console.log("Rendering PostCard:", post?.imageUrl);
  // }, [post]);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  function handleUserProfileClick(id:any): void {
    navigate(`/user/${id}`);
  }

  return (
    <div className={`${styles.postCard} card shadow-sm mb-3`}>
      <div className="card-body">
        <div className={styles.userInfo}>
          <img
            src={
              post?.imageUrl ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon"
            }
            alt={`${post.user.username}'s avatar`}
            className={styles.image}
            onClick={() => handleUserProfileClick(post.user._id)}
          />
          <span className={styles.username}>{post.user.username}</span>
        </div>

        <p className={styles.postContent}>{post.content}</p>

        <div className={styles.postActions}>
          <div>
            <button
              className={`${styles.likeButton} btn btn-sm btn-outline-primary me-2`}
              onClick={toggleLike}
            >
              {liked ? "Unlike" : "Like"} ({likeCount})
            </button>
            <button
              className={`${styles.commentButton} btn btn-sm btn-outline-secondary`}
              onClick={() => console.log("Clicked Comments for post:", post._id)}
            >
              Comments ({post.comments.length})
            </button>
            {post.imageUrl && (
              <img 
                className={`card-img-top ${styles.card_image}`} 
                src={post.imageUrl} 
                alt="Card image cap" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;