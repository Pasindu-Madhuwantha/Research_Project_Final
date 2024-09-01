import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import "./Nav.css"; // Import a separate CSS file for styling

const Nav = ({ libraryStatus, setLibraryStatus }) => {
  return (
    <nav className="navbar">
      <h1>
        Chill <FontAwesomeIcon icon={faCompactDisc} /> Lofi
      </h1>
    </nav>
  );
};

export default Nav;
