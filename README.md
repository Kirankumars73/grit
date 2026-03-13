# Grit

A modern, full-featured blogging platform built with React 19, TypeScript, and Tailwind CSS v4. Grit lets users sign up, log in, create and delete blog posts, and engage with content through a comments panel — all wrapped in a sleek dark UI powered by Framer Motion animations.

---

## ✨ Features

- **Authentication** — Sign up and log in with protected routes
- **Dashboard** — Browse all posts in a clean card layout
- **Create Posts** — Rich post creation page
- **Delete Posts** — Confirm-before-delete dialog to safely remove posts
- **Comments Panel** — View and add comments on posts
- **404 Handling** — Custom not-found page for unknown routes
- **Animated UI** — Smooth transitions via Framer Motion

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Animations | Framer Motion |
| UI Primitives | Radix UI |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge, CVA |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/grit.git
cd grit

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 📁 Project Structure

```
src/
├── components/        # Shared UI components
│   ├── CommentsPanel.tsx
│   ├── DeletePostDialog.tsx
│   ├── Navbar.tsx
│   ├── PostCard.tsx
│   ├── ProtectedRoute.tsx
│   └── ui/
├── contexts/          # React context providers (Auth)
├── lib/               # Utility helpers
├── pages/             # Route-level page components
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   └── CreatePostPage.tsx
├── App.tsx            # Root router and providers
└── main.tsx           # Entry point
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
