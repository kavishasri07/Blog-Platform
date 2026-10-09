const STORAGE_KEY = "notebook-posts";

const samplePosts = [
  {
    id: "1",
    title: "Why Small Commits Make You a Better Engineer",
    author: "Aarav Mehta",
    category: "Engineering",
    date: "2026-09-28",
    content: "Big commits hide bugs. When every change is small and focused, reviews get faster and rollbacks get painless.\n\nCommit after each working step, not at the end of the day. Write the message as if explaining it to a teammate six months from now."
  },
  {
    id: "2",
    title: "A Beginner's Map of Machine Learning",
    author: "Riya Sharma",
    category: "AI",
    date: "2026-09-20",
    content: "Machine learning is mostly three ideas: data, a model that guesses, and a way to measure how wrong the guess was.\n\nPick one small dataset and one simple model, and get a full loop working before touching anything fancy."
  },
  {
    id: "3",
    title: "CSS Grid in Ten Minutes",
    author: "Kabir Singh",
    category: "Design",
    date: "2026-09-12",
    content: "Grid is the first CSS layout tool that thinks in two dimensions. Define columns, define gaps, and let items fall into place.\n\nThe repeat(auto-fill, minmax(280px, 1fr)) pattern gives you a responsive layout with no media queries."
  },
  {
    id: "4",
    title: "Surviving Your First Hackathon",
    author: "Nisha Verma",
    category: "Career",
    date: "2026-08-30",
    content: "Scope ruthlessly. A working demo of one feature beats a broken demo of five.\n\nDecide roles in the first hour, deploy early, and leave the last two hours for the pitch."
  }
];

const CATEGORIES = ["Engineering", "AI", "Design", "Career", "Other"];

function loadPosts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) { /* ignore */ }
  return samplePosts;
}

function savePosts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) { /* storage unavailable */ }
}

let posts = loadPosts();
let searchText = "";
let activeCategory = "All";

const app = document.getElementById("app");

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function readTime(text) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

function paragraphs(text) {
  return text.split(/\n\n+/).map(p => `<p>${escapeHTML(p)}</p>`).join("");
}

function renderHome() {
  const categories = ["All", ...new Set(posts.map(p => p.category))];

  app.innerHTML = `
    <h1 class="page-title">Latest posts</h1>
    <p class="subtitle">Thoughts, tutorials and stories.</p>
    <input class="search" id="search" type="search"
           placeholder="Search posts..." value="${escapeHTML(searchText)}">
    <div class="filters">
      ${categories.map(c => `
        <button class="filter ${c === activeCategory ? "active" : ""}"
                data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("")}
    </div>
    <div id="list"></div>
  `;

  renderList();

  document.getElementById("search").addEventListener("input", e => {
    searchText = e.target.value;
    renderList();
  });

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderHome();
    });
  });
}

function renderList() {
  const q = searchText.toLowerCase();
  const results = posts
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => (p.title + p.content + p.author).toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date));

  const list = document.getElementById("list");

  if (results.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <h2>No posts found</h2>
        <p>Try a different search or category.</p>
      </div>`;
    return;
  }

  list.innerHTML = results.map(p => `
    <article class="post-item">
      <div class="meta">
        <span class="tag">${escapeHTML(p.category)}</span>
        ${formatDate(p.date)} · ${readTime(p.content)} min read
      </div>
      <h2><a href="#/post/${p.id}">${escapeHTML(p.title)}</a></h2>
      <p>${escapeHTML(p.content.slice(0, 130))}...</p>
      <div class="meta">By ${escapeHTML(p.author)}</div>
    </article>`).join("");
}

function renderPost(id) {
  const post = posts.find(p => p.id === id);

  if (!post) {
    app.innerHTML = `
      <div class="empty">
        <h2>Post not available</h2>
        <p>This post doesn't exist or has been deleted.</p>
        <a href="#/" class="btn">Back to posts</a>
      </div>`;
    return;
  }

  app.innerHTML = `
    <a href="#/" class="back">← All posts</a>
    <article class="post">
      <div class="meta"><span class="tag">${escapeHTML(post.category)}</span>
        ${formatDate(post.date)} · ${readTime(post.content)} min read</div>
      <h1>${escapeHTML(post.title)}</h1>
      <div class="meta">By ${escapeHTML(post.author)}</div>
      <div class="post-actions">
        <a href="#/edit/${post.id}" class="btn">Edit</a>
        <button class="btn btn-danger" id="delete">Delete</button>
      </div>
      <div class="post-body">${paragraphs(post.content)}</div>
    </article>
  `;

  document.getElementById("delete").addEventListener("click", () => {
    if (confirm("Delete this post?")) {
      posts = posts.filter(p => p.id !== id);
      savePosts();
      location.hash = "#/";
    }
  });
}

function renderForm(id) {
  const existing = id ? posts.find(p => p.id === id) : null;

  if (id && !existing) {
    renderPost(id); 
    return;
  }

  const post = existing || { title: "", author: "", category: "Engineering", content: "" };

  app.innerHTML = `
    <a href="${existing ? "#/post/" + id : "#/"}" class="back">← Back</a>
    <h1 class="page-title">${existing ? "Edit post" : "New post"}</h1>
    <form class="form" id="form" novalidate>
      <label>Title
        <input class="field" name="title" maxlength="120" value="${escapeHTML(post.title)}">
        <span class="error" data-for="title"></span>
      </label>
      <label>Author
        <input class="field" name="author" value="${escapeHTML(post.author)}">
        <span class="error" data-for="author"></span>
      </label>
      <label>Category
        <select class="field" name="category">
          ${CATEGORIES.map(c => `<option ${c === post.category ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </label>
      <label>Content <small>(leave a blank line between paragraphs)</small>
        <textarea class="field" name="content" rows="10">${escapeHTML(post.content)}</textarea>
        <span class="error" data-for="content"></span>
      </label>
      <div class="form-actions">
        <button type="submit" class="btn btn-dark">${existing ? "Save changes" : "Publish"}</button>
        <a href="${existing ? "#/post/" + id : "#/"}" class="btn">Cancel</a>
      </div>
    </form>
  `;

  document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const errors = {};

    if (data.title.trim().length < 3) errors.title = "Title must be at least 3 characters.";
    if (!data.author.trim()) errors.author = "Author is required.";
    if (data.content.trim().length < 20) errors.content = "Write at least 20 characters.";

    document.querySelectorAll(".error").forEach(el => {
      el.textContent = errors[el.dataset.for] || "";
    });
    if (Object.keys(errors).length) return;

    if (existing) {
      Object.assign(existing, {
        title: data.title.trim(),
        author: data.author.trim(),
        category: data.category,
        content: data.content.trim()
      });
      savePosts();
      location.hash = "#/post/" + existing.id;
    } else {
      const newPost = {
        id: String(Date.now()),
        title: data.title.trim(),
        author: data.author.trim(),
        category: data.category,
        content: data.content.trim(),
        date: new Date().toISOString().slice(0, 10)
      };
      posts.unshift(newPost);
      savePosts();
      location.hash = "#/post/" + newPost.id;
    }
  });
}

function router() {
  const [, page, id] = (location.hash || "#/").split("/");
  window.scrollTo(0, 0);

  if (page === "post") renderPost(id);
  else if (page === "new") renderForm();
  else if (page === "edit") renderForm(id);
  else renderHome();
}

window.addEventListener("hashchange", router);
router();
