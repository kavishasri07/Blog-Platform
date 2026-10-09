import { Bookmark, Clock3, Heart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogCard({ blog, isLiked, isBookmarked, onLike, onBookmark }) {
  return (
    <article className="blog-card">
      <Link className="card-image-wrap" to={`/blog/${blog.id}`} aria-label={`Read ${blog.title}`}>
        <img className="card-image" src={blog.cover || ""} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement.classList.add("image-fallback"); }} />
        <span className="image-category">{blog.category}</span>
      </Link>
      <div className="card-body">
        <div className="card-meta"><span>{formatDate(blog.publishedAt)}</span><span className="meta-dot">·</span><span><Clock3 size={13} /> {blog.readingTime || 1} min read</span></div>
        <h3><Link to={`/blog/${blog.id}`}>{blog.title}</Link></h3>
        <p className="card-excerpt">{blog.excerpt}</p>
        <div className="card-footer">
          <div className="author-mini"><span className="avatar">{(blog.author || "B").slice(0, 1).toUpperCase()}</span><span>{blog.author || "Guest author"}</span></div>
          <div className="card-actions">
            <button className={`mini-action${isLiked ? " is-liked" : ""}`} onClick={() => onLike(blog.id)} aria-label={isLiked ? "Unlike post" : "Like post"} title="Like"><Heart size={16} fill={isLiked ? "currentColor" : "none"} /><span>{blog.likes || 0}</span></button>
            <button className={`mini-action${isBookmarked ? " is-saved" : ""}`} onClick={() => onBookmark(blog.id)} aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"} title="Bookmark"><Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} /></button>
            <Link className="read-arrow" to={`/blog/${blog.id}`} aria-label={`Read ${blog.title}`}><ArrowUpRight size={17} /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}