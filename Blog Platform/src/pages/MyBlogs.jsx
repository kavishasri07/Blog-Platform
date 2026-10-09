import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowRight, FilePenLine, Plus, Trash2 } from "lucide-react";
import EmptyState from "../components/EmptyState";

export default function MyBlogs({ blogs, onDelete }) {
  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.notice || "");

  useEffect(() => {
    if (location.state?.notice) {
      setNotice(location.state.notice);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const ownBlogs = blogs.filter((blog) => blog.isMine);

  const deleteBlog = (blog) => {
    if (window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) onDelete(blog.id);
  };

  return (
    <main className="section-shell dashboard-page">
      <div className="dashboard-header"><div><span className="section-kicker">YOUR CREATIVE CORNER</span><h1>My stories<span className="heading-period">.</span></h1><p>Everything you've written, all in one place.</p></div><Link className="button button-primary" to="/create"><Plus size={17} /> New story</Link></div>
      {notice && <div className="success-banner" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}
      <div className="dashboard-stats"><div><span>Published stories</span><strong>{ownBlogs.length}</strong></div><div><span>Total likes</span><strong>{ownBlogs.reduce((total, blog) => total + (blog.likes || 0), 0)}</strong></div><div><span>Total comments</span><strong>{ownBlogs.reduce((total, blog) => total + (blog.comments?.length || 0), 0)}</strong></div></div>
      <div className="dashboard-section-title"><h2>Your published work</h2><span>{ownBlogs.length} {ownBlogs.length === 1 ? "story" : "stories"}</span></div>
      {ownBlogs.length ? <div className="manage-list">{[...ownBlogs].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map((blog) => <article className="manage-item" key={blog.id}><Link className="manage-image" to={`/blog/${blog.id}`}><img src={blog.cover} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} /></Link><div className="manage-info"><span className="article-category">{blog.category}</span><h3><Link to={`/blog/${blog.id}`}>{blog.title}</Link></h3><p>{blog.excerpt}</p><span className="manage-meta">{blog.publishedAt} · {blog.likes || 0} likes · {blog.comments?.length || 0} comments</span></div><div className="manage-actions"><Link to={`/edit/${blog.id}`} className="button button-secondary button-small"><FilePenLine size={15} /> Edit</Link><button className="button button-danger button-small" onClick={() => deleteBlog(blog)}><Trash2 size={15} /> Delete</button></div></article>)}</div> : <EmptyState type="write" title="Your first story starts here" description="Share an idea, a lesson, or something you can't stop thinking about. Your published posts will appear here." actionLabel="Write your first story" />}
      <Link to="/" className="text-link">Explore all stories <ArrowRight size={16} /></Link>
    </main>
  );
}