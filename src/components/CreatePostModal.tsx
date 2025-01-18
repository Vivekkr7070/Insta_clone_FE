import React, { useContext, useState } from "react";
import styles from "./CreatePostModal.module.css";
import { createPost } from "../services/posts";
import { AuthContext } from "../context/AuthContext";

interface Props {
  onClose: () => void; // Function to close the modal
  setPosts: React.Dispatch<React.SetStateAction<any[]>>; // Update posts list after creating a post
}

const CreatePostModal: React.FC<Props> = ({ onClose, setPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("content", content);
    // if (image) {
    //   formData.append("image", image);
    // }

    try {
      setLoading(true);
      const data = await createPost(title, content, token ?? "");
      onClose(); // Close the modal
    } catch (err: any) {
      console.error(err.message);
      setError("Failed to create post. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Create a Post</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Image (optional)</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
