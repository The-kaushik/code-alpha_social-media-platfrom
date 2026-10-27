# ⚡ Pulse — Modern Social Media Platform

A modern, full-stack social media web application built with **HTML5, Vanilla CSS3 (Glassmorphism & Electric Dark Theme), JavaScript (ES6+)**, and a **Node.js Express Backend**.

---

## 🌟 Key Features

### 1. 👤 User Profiles & Multi-Account Switcher
- **Rich User Profile View**: Cover banner, avatar with online indicator, verified badges, headline/title, location, website link, and joined date.
- **Followers & Following Modals**: Click on the follower or following count to open an interactive modal with full user lists and follow/unfollow controls.
- **Profile Tabs**: Seamlessly switch between **Posts** (authored posts), **Media** (posts with images), and **Liked** (posts liked by the user).
- **Edit Profile**: Modal allowing users to customize Display Name, Title, Bio, Location, Website, and choose from curated preset avatars or custom image URLs.
- **Instant Account Switcher**: Switch on-the-fly between 4 seeded demo profiles (`@alex`, `@sarah`, `@marcus`, `@elena`) or create a brand new account to test social interactions between different users!

### 2. 📝 Interactive Posts & Feed
- **Rich Post Composer**:
  - Auto-growing textarea with 500-character counter.
  - Image attachment with instant live preview and aesthetic photography presets.
  - Quick hashtag pills (`#tech`, `#webdev`, `#design`, `#ai`, `#vibes`) that auto-insert into content.
  - Emoji picker.
- **Multi-Feed Navigation**:
  - **For You**: Discover all community posts.
  - **Following**: Feed tailored specifically to posts from creators you follow.
  - **Trending 🔥**: Posts ranked dynamically by engagement score (likes and comments).
- **Live Search & Tag Filtering**: Real-time debounced search bar in header to filter by keyword, `@mention`, or `#hashtag`.
- **Post Lightbox**: Click any post image to view full-resolution lightbox view.
- **Post Management**: Post authors have direct permission to delete their own posts.

### 3. ❤️ Like System
- One-click like/unlike toggle with heart pop micro-animation.
- Real-time like counter updates.
- Automatic notification delivered to the post author when liked.

### 4. 💬 Comments System
- Expandable comment accordion for each post.
- Real-time comment submission with author avatar and relative timestamps ("just now", "5m ago").
- Delete comment button for comment authors.
- Automatic notification delivered to the post author when commented on.

### 5. 👥 Follow / Unfollow System
- Instant follow toggle with dynamic state transitions (`Follow` ⇋ `Following` with hover `Unfollow`).
- Available on user profiles, the **"Who to Follow"** right sidebar recommendation widget, and follower lists.
- Dynamic follower & following count increments and decrements.
- Generates follow notifications for the recipient.

### 6. 🔔 Activity & Notifications
- Unread badge counter in the left sidebar.
- Dedicated Activity feed showing likes, replies, and new followers with author details and timestamps.
- "Mark all as read" capability.

### 7. 💬 1-on-1 Direct Messaging & Private Chat
- **Two-Person Private Communication**: Fully functional 1-on-1 direct messaging between any two community members or test profiles.
- **Dedicated Messages Tab**: Accessible from the left navigation with dynamic unread badge counter.
- **Conversations Sidebar**: Real-time conversation previews, user avatars, online indicators, last message snippets with sender prefix ("You: ..."), and unread message pills.
- **Interactive Chat Thread**:
  - Outgoing message bubbles with electric brand gradients and delivery receipts.
  - Incoming message bubbles with dark glassmorphic styling and timestamps.
  - Autoscroll to latest messages.
  - Instant composer with Enter-to-send and quick emoji selector.
- **Profile Message Button**: Click "Message" directly on any user's profile card to jump straight into conversation.
- **Live Background Polling**: Automatic polling syncs new incoming messages, updates badge counters, and reflects messages across test accounts.
- **Multi-Account Chat Testing**: Use the right sidebar's "Switch Test Account" to effortlessly switch between `@alex`, `@sarah`, `@marcus`, and `@elena` to test two-way conversations from both perspectives in real-time.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will start at:
👉 **`http://localhost:3000`**

### 3. Run Automated API Tests
```bash
node test_api.js
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend**:
  - **HTML5**: Semantic tags, accessible structure, responsive viewport.
  - **CSS3**: Custom design tokens, glassmorphism (`backdrop-filter: blur`), dark mode aesthetic, ambient glowing orbs, responsive layouts for desktop, tablet, and mobile.
  - **JavaScript**: Modular async/await API client, DOM diffing, event delegation, client-side state management.
- **Backend**:
  - **Node.js + Express**: RESTful JSON API with endpoints for auth, users, posts, comments, likes, notifications, and trends.
  - **CORS & Static Serving**: Integrated static middleware serving the `public/` directory.
  - **File Persistence**: Local JSON store in `data/db.json` ensuring data persists across restarts.
