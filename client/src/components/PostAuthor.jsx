import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

// Correcting locale imports
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ createdAt, authorID }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
        );
        setAuthor(response?.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAuthor();
  }, [authorID]);

  // Check if createdAt is valid
  const validCreatedAt = createdAt ? new Date(createdAt) : null;

  return (
    <Link to={`/posts/users/${authorID}`} className="post__author">
      <div className="posts__authors-avatar">
        {author?.avatar && (
          <img
            src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`}
            alt=""
          />
        )}
      </div>
      <div className="post__author-details">
        <h5>By: {author?.name}</h5>
        <small>
          {/* Check if validCreatedAt is valid before rendering ReactTimeAgo */}
          {validCreatedAt ? (
            <ReactTimeAgo date={validCreatedAt} locale="en-US" />
          ) : (
            "Date not available"
          )}
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;
