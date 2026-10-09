# BlogSphere – A Simple Blog Platform

A minimal, light-themed blog platform where users can explore, read, search and manage blog posts. Built with plain HTML, CSS and JavaScript, with no frameworks, libraries or build step.

## Features

- **Explore posts:** a list showing category, date, estimated read time, author and a short preview.
- **Read posts:** each post has its own page and a shareable URL (e.g. `#/post/1`).
- **Search and filter:** live search across title, content and author, plus category filter buttons.
- **Create, edit and delete posts:** a form with validation (title, author and content checks) and a delete confirmation.
- **Handled states:**
  - "No posts found" when a search or filter matches nothing.
  - "Post not available" when opening a deleted or non-existent post, or editing one.
- **Responsive:** a single-column reading layout that adapts from desktop to mobile.
- **Persistence:** posts are saved in the browser's `localStorage`, so they survive a page refresh.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, flexbox, grid, media queries) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Browser `localStorage` |

## Project Structure

```
blog-platform/
├── index.html   # Page shell: header, main container, footer
├── style.css    # All styling
├── script.js    # Data, views, routing and form handling
└── README.md
```

## Data Source

There is no external API or database. The app ships with four sample posts defined in `script.js`. Any posts created, edited or deleted are stored in the visitor's own browser under the `notebook-posts` key.

Because of this, posts are **not shared between users or devices**, and clearing browser data resets the app to the sample posts.

## Limitations and Future Improvements

- No backend, so posts exist only in one browser.
- Content is plain text with paragraph breaks only, with no Markdown or rich formatting.
- Possible next steps: likes and bookmarks, comments, dark mode, a Markdown editor, and a real backend (e.g. Firebase or Node + MongoDB).

## Author

**Kavisha**
GitHub: [@kavishasri07](https://github.com/kavishasri07)
