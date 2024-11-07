import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/avatar1.jpg";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [isNavShowing, setisNavShowing] = useState(
    window.innerWidth > 800 ? true : false
  );
  const { currentUser } = useContext(UserContext);

  const closeNaveHAndler = () => {
    if (window.innerWidth < 800) {
      setisNavShowing(false);
    } else {
      setisNavShowing(true);
    }
  };
  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNaveHAndler}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>
        {currentUser?.id && isNavShowing && (
          <ul className={"nav__menu"}>
            <li>
              <Link
                to={`/profile/${currentUser.id}`}
                onClick={closeNaveHAndler}
              >
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNaveHAndler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNaveHAndler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNaveHAndler}>
                Logout
              </Link>
            </li>
          </ul>
        )}
        {!currentUser?.id && isNavShowing && (
          <ul className={"nav__menu"}>
            <li>
              <Link to="/authors" onClick={closeNaveHAndler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNaveHAndler}>
                Login
              </Link>
            </li>
          </ul>
        )}
        <button
          className="nav__toggle-btn"
          onClick={() => setisNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
