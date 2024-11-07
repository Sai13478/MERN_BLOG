import React, { useContext, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";

const DeletePost = () => {
  const navigate = useNavigate();
  const { id: postId } = useParams(); // Get post ID from URL params

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Function to delete the post
  const removePost = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Check response and navigate if successful
      if (response.status === 200) {
        navigate("/"); // Redirect to the homepage or any relevant page after deletion
      }
    } catch (error) {
      console.error("Failed to delete the post", error);
      // You could set an error message here to notify the user
    }
  };

  return (
    <Link
      className="btn sm danger"
      onClick={(e) => {
        e.preventDefault();
        removePost();
      }}
    >
      Delete
    </Link>
  );
};

export default DeletePost;
