# BlogSpace

BlogSpace is a responsive blog management platform built with React. Readers can explore, search, filter, and read stories, while writers can publish and manage their own posts.

## Features

- Browse featured and recent blog posts.
- Search by title, author, excerpt, category, or article content.
- Filter by category and sort by newest, oldest, or most liked.
- Read individual blog pages with author details and reading time.
- Create, edit, and delete your own blog posts.
- Like posts and bookmark stories.
- Add comments to blog posts.
- Toggle between light and dark themes.
- Persist posts, likes, bookmarks, comments, and theme in browser LocalStorage.
- Responsive layouts for desktop, tablet, and mobile.
- Friendly empty states, missing-post handling, and form validation.

## Tech stack

- React 18
- Vite
- React Router
- Lucide React
- CSS
- Browser LocalStorage

## Getting started

### Requirements

Install Node.js (an active LTS version is recommended) and npm.

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

## Data source

The application uses sample blog posts stored in `src/data/initialBlogs.js`. There is no external API or backend requirement. After the first load, user-created posts and interactions are stored in LocalStorage in the current browser.

**Persistence note:** LocalStorage is browser- and device-specific. Data is not shared between different users or devices, and clearing site data removes locally stored posts. A real multi-user product would use a backend and database.

## Project structure

```text
src/
├── components/
│   ├── BlogCard.jsx
│   ├── EmptyState.jsx
│   ├── Footer.jsx
│   └── Navbar.jsx
├── data/
│   └── initialBlogs.js
├── pages/
│   ├── BlogDetails.jsx
│   ├── BlogEditor.jsx
│   ├── Bookmarks.jsx
│   ├── Home.jsx
│   └── MyBlogs.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Design and implementation notes

- Shared UI elements such as the navbar, blog cards, and empty states are reusable components.
- React Router handles client-side navigation.
- React state keeps the UI responsive to user actions.
- LocalStorage keeps posts and preferences between reloads.
- The article editor validates required fields before saving.
- The design uses CSS grid/flexbox, responsive breakpoints, visible focus states, and reduced-motion support.

## Challenges and solutions

1. **Keeping changes after refresh:** Blog posts and user interactions are saved to LocalStorage through dedicated React effects.
2. **Avoiding duplicated UI:** Shared components such as `BlogCard` and `EmptyState` are reused across multiple pages.
3. **Handling unavailable content:** Unknown blog URLs show a helpful not-found state rather than a blank screen.
4. **Making the site responsive:** Layouts adapt across desktop, tablet, and mobile widths using CSS grid, flexbox, and media queries.
5. **Form validation:** Required fields and cover image URL formats are checked before a post is saved.

## Deployment on Vercel

1. Push this project to a GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import your GitHub repository.
4. Use the following build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy the project.

Vercel normally detects Vite automatically. If direct page refreshes on nested routes do not work, add a `vercel.json` file with the rewrite below:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## GitHub setup

```bash
git init
git add .
git commit -m "Build BlogSpace blog management platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/blogspace.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username and create the repository on GitHub first.

## Before submission

- [ ] Run `npm run build` and ensure it succeeds.
- [ ] Test search, filters, sort, create/edit/delete, likes, bookmarks, comments, and theme switching.
- [ ] Check desktop and mobile widths.
- [ ] Test an invalid blog URL and a search with no matches.
- [ ] Add your deployed link to this README after deployment.
- [ ] Ensure your GitHub repository is public if the recruitment team needs access.
