import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
  postID,
  thumbnail,
  category,
  title,
  description,
  authorID,
  createdAt,
}) => {
  // Remove HTML tags from description
  const cleanDescription = description.replace(/(<([^>]+)>)/gi, "");

  // Truncate the cleaned description if it’s too long
  const shortDescription =
    cleanDescription.length > 145
      ? cleanDescription.substr(0, 145) + "...."
      : cleanDescription;

  // Truncate title if it’s too long
  const postTitle = title.length > 145 ? title.substr(0, 145) + "...." : title;

  return (
    <article className="post">
      <div className="post__thumbnail">
        <img
          src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`}
          alt={title}
        />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p>{shortDescription}</p>
        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
