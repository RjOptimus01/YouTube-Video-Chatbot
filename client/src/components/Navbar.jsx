import "../styles/home.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        QueryTube
      </div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Recent Chats</a>
        <a href="#">About</a>
      </div>
    </nav>
  );
}

export default Navbar;