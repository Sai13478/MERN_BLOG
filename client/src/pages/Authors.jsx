/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`
        );
        console.log(response.data); // Log to verify data structure
        setAuthors(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />; // Optional loading indicator
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <Link key={id} to={`/posts/users/${id}`} className="author">
              <div className="author__avatar">
                <img
                  src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${
                    avatar || "default-avatar.jpg"
                  }`}
                  alt={`Image of ${name}`}
                />
              </div>
              <div className="author__info">
                <h4>{name}</h4>
                <p>{posts} posts</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2>No users found</h2>
      )}
      <footer />
    </section>
  );
};

export default Authors;
