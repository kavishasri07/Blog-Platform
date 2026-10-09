import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Bookmark, House, Menu, Moon, PenLine, Sun, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ theme, toggleTheme, savedCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="BlogSpace home">
          <span className="brand-mark"><BookOpen size={19} strokeWidth={2.2} /></span>
          <span>blogspace<span className="brand-period">.</span></span>
        </Link>

        <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={`main-nav${menuOpen ? " menu-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/" end className={navClass} onClick={closeMenu}><House size={16} /> Explore</NavLink>
          <NavLink to="/my-blogs" className={navClass} onClick={closeMenu}>My blogs</NavLink>
          <NavLink to="/bookmarks" className={navClass} onClick={closeMenu}><Bookmark size={16} /> Saved <span className="nav-count">{savedCount}</span></NavLink>
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button className="button button-primary nav-write" onClick={() => { closeMenu(); navigate("/create"); }}><PenLine size={16} /> Write a story</button>
        </nav>
      </div>
    </header>
  );
}