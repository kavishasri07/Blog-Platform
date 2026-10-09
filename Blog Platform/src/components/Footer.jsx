import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner"><Link to="/" className="brand footer-brand"><span className="brand-mark"><BookOpen size={18} /></span><span>blogspace<span className="brand-period">.</span></span></Link><p>A little space for big ideas.</p><div className="footer-links"><Link to="/">Explore</Link><Link to="/my-blogs">My blogs</Link><Link to="/create">Write a story <ArrowUpRight size={13} /></Link></div><span className="footer-copy">© {new Date().getFullYear()} BlogSpace · Made for curious minds.</span></div>
    </footer>
  );
}