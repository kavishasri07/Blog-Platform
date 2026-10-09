import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowRight, Search, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import EmptyState from "../components/EmptyState";

const categories = ["All stories", "Technology", "Design", "Mindset", "Lifestyle", "Culture", "Work"];

export default function Home({ blogs, likedIds, bookmarkedIds, onLike, onBookmark }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All stories");
  const [sort, setSort] = useState("newest");

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogs
      .filter((blog) => category === "All stories" || blog.category === category)
      .filter((blog) => !query || [blog.title, blog.author, blog.excerpt, blog.content, blog.category].some((value) => (value || "").toLowerCase().includes(query)))
      .sort((a, b) => sort === "oldest" ? a.publishedAt.localeCompare(b.publishedAt) : sort === "popular" ? (b.likes || 0) - (a.likes || 0) : b.publishedAt.localeCompare(a.publishedAt));
  }, [blogs, search, category, sort]);

  const featured = blogs[0];
  const isFiltering = search.trim() || category !== "All stories";

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> A little space for big ideas</div>
          <h1>Stories that make<br />you <span>think differently.</span></h1>
          <p className="hero-description">A home for curious minds. Explore fresh perspectives, discover useful ideas, and share a story of your own.</p>
          <div className="hero-actions">
            <a href="#stories" className="button button-primary">Explore stories <ArrowRight size={17} /></a>
            <Link to="/create" className="button button-secondary">Start writing</Link>
          </div>
          <div className="hero-proof"><div className="avatar-stack"><span>M</span><span>N</span><span>I</span><span>+</span></div><span><strong>{blogs.length} stories</strong> and counting</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-art-label"><span className="live-dot" /> EDITOR'S PICK</div>
          {featured ? <Link to={`/blog/${featured.id}`} className="feature-card">
            <img src={featured.cover} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
            <div className="feature-gradient" />
            <div className="feature-card-content"><span className="feature-category">{featured.category}</span><h2>{featured.title}</h2><p>{featured.readingTime || 1} min read <span>·</span> By {featured.author}</p></div>
            <span className="feature-open"><ArrowRight size={19} /></span>
          </Link> : <div className="feature-placeholder">Your next favorite story starts here.</div>}
          <div className="floating-note"><span className="note-star">✳</span><span>Ideas worth<br />passing on.</span></div>
        </div>
        <div className="hero-decoration hero-decoration-one" />
        <div className="hero-decoration hero-decoration-two" />
      </section>

      <section className="stories-section section-shell" id="stories">
        <div className="section-heading">
          <div><span className="section-kicker">THE READING ROOM</span><h2>{isFiltering ? "Your search results" : "Find your next read"}<span className="heading-period">.</span></h2><p>Good ideas are meant to be found.</p></div>
          <span className="story-count">{filteredBlogs.length} {filteredBlogs.length === 1 ? "story" : "stories"}</span>
        </div>

        <div className="discovery-toolbar">
          <div className="search-box"><Search size={18} /><input aria-label="Search stories" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stories, topics, authors..." />{search && <button aria-label="Clear search" onClick={() => setSearch("")}><X size={16} /></button>}<kbd>⌕</kbd></div>
          <label className="sort-select"><ArrowDownUp size={15} /><span className="sr-only">Sort stories</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="popular">Most liked</option></select></label>
        </div>

        <div className="category-list" aria-label="Filter by category">
          {categories.map((item) => <button key={item} className={`category-chip${category === item ? " selected" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}
        </div>

        {filteredBlogs.length ? <div className="blog-grid">
          {filteredBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} isLiked={likedIds.includes(blog.id)} isBookmarked={bookmarkedIds.includes(blog.id)} onLike={onLike} onBookmark={onBookmark} />)}
        </div> : <EmptyState title="No stories found" description="Try another keyword or category. Your next great read might be one search away." actionLabel={search || category !== "All stories" ? "Clear filters" : "Write the first story"} actionTo={search || category !== "All stories" ? "/" : "/create"} />}

        <div className="bottom-cta"><div><span className="cta-spark">✳</span><div><h3>Everyone has a story.</h3><p>What's yours going to be about?</p></div></div><Link className="button button-dark" to="/create">Write your first draft <ArrowRight size={16} /></Link></div>
      </section>
    </>
  );
}