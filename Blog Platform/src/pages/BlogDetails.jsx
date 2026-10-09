import { useState } from "react";
import { ArrowLeft, Bookmark, CalendarDays, Clock3, Heart, MessageCircle, Send, Share2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";

function prettyDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BlogDetails({ blogs, likedIds, bookmarkedIds, onLike, onBookmark, onAddComment }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((item) => item.id === id);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!blog) return <main className="section-shell page-main"><EmptyState title="We couldn't find that story" description="It may have been removed, or the link might be incorrect." actionLabel="Back to all stories" actionTo="/" /></main>;

  const shareStory = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: blog.title, text: blog.excerpt, url });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
      else window.prompt("Copy this link to share the story:", url);
    } catch (error) {
      if (error.name !== "AbortError") window.prompt("Copy this link to share the story:", url);
    }
  };

  const submitComment = (event) => {
    event.preventDefault();
    if (!commentName.trim() || !commentText.trim()) { setCommentError("Please enter your name and a comment."); return; }
    onAddComment(blog.id, { name: commentName.trim(), text: commentText.trim() });
    setCommentName("");
    setCommentText("");
    setCommentError("");
  };

  return (
    <main className="article-page section-shell">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to stories</Link>
      <article className="article">
        <header className="article-header">
          <span className="article-category">{blog.category}</span>
          <h1>{blog.title}</h1>
          <p className="article-deck">{blog.excerpt}</p>
          <div className="article-byline">
            <span className="avatar avatar-large">{(blog.author || "B").slice(0, 1).toUpperCase()}</span>
            <div className="byline-name"><strong>{blog.author || "Guest author"}</strong><span>Writer at BlogSpace</span></div>
            <span className="byline-divider" />
            <span className="byline-detail"><CalendarDays size={15} /> {prettyDate(blog.publishedAt)}</span>
            <span className="byline-detail"><Clock3 size={15} /> {blog.readingTime || 1} min read</span>
          </div>
        </header>

        <div className="article-cover"><img src={blog.cover} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} /><span>{blog.category} / BlogSpace</span></div>

        <div className="article-layout">
          <aside className="article-rail" aria-label="Article actions">
            <button className={`rail-action${likedIds.includes(blog.id) ? " is-liked" : ""}`} onClick={() => onLike(blog.id)} aria-label="Like article"><Heart size={19} fill={likedIds.includes(blog.id) ? "currentColor" : "none"} /><span>{blog.likes || 0}</span></button>
            <button className={`rail-action${bookmarkedIds.includes(blog.id) ? " is-saved" : ""}`} onClick={() => onBookmark(blog.id)} aria-label="Bookmark article"><Bookmark size={19} fill={bookmarkedIds.includes(blog.id) ? "currentColor" : "none"} /></button>
            <button className="rail-action" onClick={shareStory} aria-label="Share article"><Share2 size={19} /></button>
            {copied && <span className="copy-feedback">Link copied</span>}
          </aside>
          <div className="article-content">
            {(blog.content || "").split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {!!blog.tags?.length && <div className="article-tags">{blog.tags.map((tag) => <span key={tag}>#{tag.replace(/\s+/g, "")}</span>)}</div>}
            <div className="article-endmark">✳</div>
          </div>
        </div>
      </article>

      <section className="comments-section" id="comments">
        <div className="comments-heading"><div><span className="section-kicker">JOIN THE CONVERSATION</span><h2>Thoughts & comments <span className="heading-period">.</span></h2></div><span className="comment-count"><MessageCircle size={15} /> {blog.comments?.length || 0}</span></div>
        <form className="comment-form" onSubmit={submitComment}>
          <label htmlFor="comment-name">Your name</label>
          <input id="comment-name" value={commentName} onChange={(event) => setCommentName(event.target.value)} placeholder="How should we call you?" maxLength={50} />
          <label htmlFor="comment-text">Your thoughts</label>
          <textarea id="comment-text" value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Share something thoughtful..." rows={4} maxLength={1000} />
          {commentError && <p className="form-error">{commentError}</p>}
          <button className="button button-primary" type="submit"><Send size={15} /> Post comment</button>
        </form>
        <div className="comment-list">
          {blog.comments?.length ? [...blog.comments].reverse().map((comment) => <div className="comment-item" key={comment.id}><span className="avatar">{(comment.name || "G").slice(0, 1).toUpperCase()}</span><div><div className="comment-author">{comment.name}<span>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}</span></div><p>{comment.text}</p></div></div>) : <p className="no-comments">No comments yet. Be the first to share a thought.</p>}
        </div>
      </section>
    </main>
  );
}