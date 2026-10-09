import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import BlogEditor from "./pages/BlogEditor";
import MyBlogs from "./pages/MyBlogs";
import Bookmarks from "./pages/Bookmarks";
import { initialBlogs } from "./data/initialBlogs";

const STORAGE_KEYS = { blogs: "blogspace-blogs-v1", liked: "blogspace-liked-v1", bookmarks: "blogspace-bookmarks-v1", theme: "blogspace-theme-v1" };

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `blog-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [blogs, setBlogs] = useState(() => readStorage(STORAGE_KEYS.blogs, initialBlogs));
  const [likedIds, setLikedIds] = useState(() => readStorage(STORAGE_KEYS.liked, []));
  const [bookmarkedIds, setBookmarkedIds] = useState(() => readStorage(STORAGE_KEYS.bookmarks, []));
  const [theme, setTheme] = useState(() => readStorage(STORAGE_KEYS.theme, "light"));
  const location = useLocation();

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.blogs, JSON.stringify(blogs)); }, [blogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.liked, JSON.stringify(likedIds)); }, [likedIds]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarkedIds)); }, [bookmarkedIds]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme)); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname]);

  const toggleTheme = () => setTheme((current) => current === "light" ? "dark" : "light");

  const toggleLike = (id) => {
    const alreadyLiked = likedIds.includes(id);
    setLikedIds((current) => alreadyLiked ? current.filter((item) => item !== id) : [...current, id]);
    setBlogs((current) => current.map((blog) => blog.id === id ? { ...blog, likes: Math.max(0, (blog.likes || 0) + (alreadyLiked ? -1 : 1)) } : blog));
  };

  const toggleBookmark = (id) => setBookmarkedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const createBlog = (payload) => {
    const blog = { ...payload, id: makeId(), publishedAt: new Date().toISOString().slice(0, 10), likes: 0, comments: [], isMine: true };
    setBlogs((current) => [blog, ...current]);
  };

  const updateBlog = (id, payload) => setBlogs((current) => current.map((blog) => blog.id === id ? { ...blog, ...payload } : blog));
  const deleteBlog = (id) => {
    setBlogs((current) => current.filter((blog) => blog.id !== id));
    setLikedIds((current) => current.filter((item) => item !== id));
    setBookmarkedIds((current) => current.filter((item) => item !== id));
  };

  const addComment = (id, comment) => setBlogs((current) => current.map((blog) => blog.id === id ? { ...blog, comments: [...(blog.comments || []), { ...comment, id: makeId(), createdAt: new Date().toISOString() }] } : blog));

  return (
    <div className="app-shell">
      <Navbar theme={theme} toggleTheme={toggleTheme} savedCount={bookmarkedIds.length} />
      <Routes>
        <Route path="/" element={<Home blogs={blogs} likedIds={likedIds} bookmarkedIds={bookmarkedIds} onLike={toggleLike} onBookmark={toggleBookmark} />} />
        <Route path="/blog/:id" element={<BlogDetails blogs={blogs} likedIds={likedIds} bookmarkedIds={bookmarkedIds} onLike={toggleLike} onBookmark={toggleBookmark} onAddComment={addComment} />} />
        <Route path="/create" element={<BlogEditor blogs={blogs} onSave={createBlog} onUpdate={updateBlog} />} />
        <Route path="/edit/:id" element={<BlogEditor blogs={blogs} onSave={createBlog} onUpdate={updateBlog} />} />
        <Route path="/my-blogs" element={<MyBlogs blogs={blogs} onDelete={deleteBlog} />} />
        <Route path="/bookmarks" element={<Bookmarks blogs={blogs} likedIds={likedIds} bookmarkedIds={bookmarkedIds} onLike={toggleLike} onBookmark={toggleBookmark} />} />
        <Route path="*" element={<main className="section-shell page-main"><div className="not-found"><span>404</span><h1>Looks like this page wandered off.</h1><p>Let's get you back to something worth reading.</p><a className="button button-primary" href="/">Back to BlogSpace</a></div></main>} />
      </Routes>
      <Footer />
    </div>
  );
}