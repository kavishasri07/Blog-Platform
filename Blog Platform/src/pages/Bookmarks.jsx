import { BookmarkCheck } from "lucide-react";
import BlogCard from "../components/BlogCard";
import EmptyState from "../components/EmptyState";

export default function Bookmarks({ blogs, likedIds, bookmarkedIds, onLike, onBookmark }) {
  const savedBlogs = blogs.filter((blog) => bookmarkedIds.includes(blog.id));
  return (
    <main className="section-shell dashboard-page">
      <div className="dashboard-header"><div><span className="section-kicker">YOUR PERSONAL READING LIST</span><h1>Saved stories<span className="heading-period">.</span></h1><p>Keep the good ideas close for whenever you need them.</p></div><span className="saved-large-icon"><BookmarkCheck size={26} /></span></div>
      <div className="dashboard-section-title"><h2>Your reading list</h2><span>{savedBlogs.length} saved</span></div>
      {savedBlogs.length ? <div className="blog-grid">{savedBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} isLiked={likedIds.includes(blog.id)} isBookmarked={bookmarkedIds.includes(blog.id)} onLike={onLike} onBookmark={onBookmark} />)}</div> : <EmptyState type="bookmark" title="Save a story for later" description="Tap the bookmark icon on any story you love. It will be waiting here when you're ready to read." actionLabel="Explore stories" actionTo="/" />}
    </main>
  );
}