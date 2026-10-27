const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Initial seed data with rich profiles, posts, comments
const INITIAL_DATA = {
  activeUsername: 'alex',
  users: [
    {
      id: 'u1',
      username: 'alex',
      name: 'Alex Rivera',
      title: 'Full-Stack Architect & AI Dev',
      bio: 'Crafting the next generation of web interfaces & AI workflows 🚀 | Coffee enthusiast ☕ | Open-source lover',
      location: 'San Francisco, CA',
      website: 'https://alexrivera.dev',
      joinedDate: 'Joined March 2024',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      following: ['sarah', 'marcus'],
      followers: ['sarah', 'elena']
    },
    {
      id: 'u2',
      username: 'sarah',
      name: 'Sarah Chen',
      title: 'Lead Product Designer',
      bio: 'UI/UX Specialist @DesignPulse 🎨 | Passionate about micro-interactions, dark mode aesthetics & sleek design systems ✨',
      location: 'Seattle, WA',
      website: 'https://sarahchen.design',
      joinedDate: 'Joined January 2024',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      following: ['alex', 'elena'],
      followers: ['alex', 'marcus']
    },
    {
      id: 'u3',
      username: 'marcus',
      name: 'Marcus Vance',
      title: 'Cybersecurity Researcher',
      bio: 'Digging into zero-days & distributed systems 🛡️ | Street photographer 📷 | Synthwave collector 🎧',
      location: 'Austin, TX',
      website: 'https://vance-sec.io',
      joinedDate: 'Joined February 2024',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      following: ['alex', 'sarah'],
      followers: ['alex']
    },
    {
      id: 'u4',
      username: 'elena',
      name: 'Elena Rostova',
      title: 'Tech Founder & Writer',
      bio: 'Founder @AetherMedia 🌐 | Writing about Web3, AI models, and modern remote engineering culture 💡',
      location: 'London, UK',
      website: 'https://elenarostova.tech',
      joinedDate: 'Joined April 2024',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      following: ['alex'],
      followers: ['sarah']
    }
  ],
  posts: [
    {
      id: 'p1',
      authorUsername: 'sarah',
      content: 'Just launched the new design tokens for our glassmorphism UI kit! 💎 Subtle gradients, glowing border accents, and high-contrast accessibility. What do you think of this visual direction? #design #uiux #frontend',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      tags: ['design', 'uiux', 'frontend'],
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
      likes: ['alex', 'marcus'],
      comments: [
        {
          id: 'c1',
          authorUsername: 'alex',
          content: 'The lighting contrast and border gradient looks phenomenal! Definitely adopting this aesthetic in our app.',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: 'c2',
          authorUsername: 'marcus',
          content: 'Incredible depth! Looks sleek on OLED displays.',
          createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString()
        }
      ]
    },
    {
      id: 'p2',
      authorUsername: 'alex',
      content: 'Shipped our new real-time social platform backend! ⚡ Built with lightning-fast REST endpoints, dynamic user state management, and seamless follower sync. Testing it right now with the community. Drop your thoughts below! #webdev #javascript #buildinpublic',
      mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
      tags: ['webdev', 'javascript', 'buildinpublic'],
      createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 1.2 hours ago
      likes: ['sarah', 'elena'],
      comments: [
        {
          id: 'c3',
          authorUsername: 'sarah',
          content: 'The interactions feel so smooth and responsive. Great work on this release!',
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        }
      ]
    },
    {
      id: 'p3',
      authorUsername: 'marcus',
      content: 'Sunset street photography walk after a long day of code review & security auditing. Take time to disconnect and recharge. 📸🌆 #photography #mindset #cybersecurity',
      mediaUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80',
      tags: ['photography', 'mindset', 'cybersecurity'],
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
      likes: ['alex', 'sarah', 'elena'],
      comments: [
        {
          id: 'c4',
          authorUsername: 'elena',
          content: 'That neon reflection on the asphalt is stunning! Where was this shot taken?',
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        }
      ]
    },
    {
      id: 'p4',
      authorUsername: 'elena',
      content: '5 unexpected habits of top 1% engineering teams: \n1. Clear asynchronous written docs over endless meetings.\n2. Rapid small PRs with automated preview deployments.\n3. Deep respect for developer ergonomics.\n4. Ruthless simplicity in system architecture.\n5. Continuous learning culture. What would you add? #tech #startups #productivity',
      mediaUrl: '',
      tags: ['tech', 'startups', 'productivity'],
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      likes: ['alex'],
      comments: []
    }
  ],
  notifications: [
    {
      id: 'n1',
      recipientUsername: 'alex',
      actorUsername: 'sarah',
      type: 'like',
      postId: 'p2',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 'n2',
      recipientUsername: 'alex',
      actorUsername: 'sarah',
      type: 'comment',
      postId: 'p2',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: 'n3',
      recipientUsername: 'alex',
      actorUsername: 'elena',
      type: 'follow',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
  ],
  messages: [
    {
      id: 'm1',
      senderUsername: 'sarah',
      recipientUsername: 'alex',
      content: 'Hey Alex! Loved your post about the new real-time backend ⚡',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: true
    },
    {
      id: 'm2',
      senderUsername: 'alex',
      recipientUsername: 'sarah',
      content: 'Thanks Sarah! Your glassmorphism tokens inspired the frontend styling too 💎',
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      read: true
    },
    {
      id: 'm3',
      senderUsername: 'sarah',
      recipientUsername: 'alex',
      content: 'Awesome! Let me know if you want to collaborate on the next design system sprint.',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      read: false
    },
    {
      id: 'm4',
      senderUsername: 'marcus',
      recipientUsername: 'alex',
      content: 'Hey Alex, audited the security rules on the new API endpoints. Everything looks rock solid! 🛡️',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      read: true
    }
  ]
};

// Database Helpers
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  }
}

function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.messages) {
      parsed.messages = INITIAL_DATA.messages || [];
      writeDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading db:', err);
    return INITIAL_DATA;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Helper: Enrich user object with counts & follower state
function enrichUser(user, currentUsername, allUsers) {
  const followersCount = (user.followers || []).length;
  const followingCount = (user.following || []).length;
  const isFollowing = (user.followers || []).includes(currentUsername);
  const isSelf = user.username === currentUsername;
  return {
    ...user,
    followersCount,
    followingCount,
    isFollowing,
    isSelf
  };
}

// Helper: Enrich post object with author details & like state
function enrichPost(post, currentUsername, users) {
  const author = users.find(u => u.username === post.authorUsername) || {
    username: post.authorUsername,
    name: post.authorUsername,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  };

  const isLiked = (post.likes || []).includes(currentUsername);
  const likesCount = (post.likes || []).length;

  const enrichedComments = (post.comments || []).map(comment => {
    const commentAuthor = users.find(u => u.username === comment.authorUsername) || {
      username: comment.authorUsername,
      name: comment.authorUsername,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    return {
      ...comment,
      author: {
        username: commentAuthor.username,
        name: commentAuthor.name,
        avatar: commentAuthor.avatar
      },
      isOwner: comment.authorUsername === currentUsername
    };
  });

  return {
    ...post,
    author: {
      username: author.username,
      name: author.name,
      title: author.title,
      avatar: author.avatar
    },
    isLiked,
    likesCount,
    commentsCount: (post.comments || []).length,
    comments: enrichedComments,
    isOwner: post.authorUsername === currentUsername
  };
}

// ======================== API ROUTES ========================

// 1. Current Active User / Auth Simulation
app.get('/api/me', (req, res) => {
  const db = readDb();
  const current = db.users.find(u => u.username === db.activeUsername) || db.users[0];
  res.json(enrichUser(current, current.username, db.users));
});

// Switch active user (great for testing follow/like between accounts)
app.post('/api/switch-user', (req, res) => {
  const { username } = req.body;
  const db = readDb();
  const user = db.users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  db.activeUsername = username;
  writeDb(db);
  res.json(enrichUser(user, username, db.users));
});

// Register or create new account
app.post('/api/register', (req, res) => {
  const { username, name, bio, avatar } = req.body;
  if (!username || !name) {
    return res.status(400).json({ error: 'Username and Name are required' });
  }
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const db = readDb();
  if (db.users.some(u => u.username === cleanUsername)) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const newUser = {
    id: 'u_' + Date.now(),
    username: cleanUsername,
    name,
    title: 'New Member',
    bio: bio || 'Hello world! Just joined the platform.',
    location: 'Earth',
    website: '',
    joinedDate: `Joined ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    following: [],
    followers: []
  };

  db.users.push(newUser);
  db.activeUsername = cleanUsername;
  writeDb(db);
  res.status(201).json(enrichUser(newUser, cleanUsername, db.users));
});

// 2. Users Routes
app.get('/api/users', (req, res) => {
  const db = readDb();
  const currentUsername = db.activeUsername;
  const enriched = db.users.map(u => enrichUser(u, currentUsername, db.users));
  res.json(enriched);
});

app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const db = readDb();
  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(enrichUser(user, db.activeUsername, db.users));
});

// Update Profile
app.put('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const db = readDb();
  const index = db.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Only allow editing if it's the active user
  if (db.users[index].username !== db.activeUsername) {
    return res.status(403).json({ error: 'You can only edit your own profile' });
  }

  const { name, title, bio, location, website, avatar, banner } = req.body;
  if (name !== undefined) db.users[index].name = name;
  if (title !== undefined) db.users[index].title = title;
  if (bio !== undefined) db.users[index].bio = bio;
  if (location !== undefined) db.users[index].location = location;
  if (website !== undefined) db.users[index].website = website;
  if (avatar !== undefined && avatar.trim() !== '') db.users[index].avatar = avatar;
  if (banner !== undefined && banner.trim() !== '') db.users[index].banner = banner;

  writeDb(db);
  res.json(enrichUser(db.users[index], db.activeUsername, db.users));
});

// Toggle Follow/Unfollow
app.post('/api/users/:username/follow', (req, res) => {
  const targetUsername = req.params.username;
  const db = readDb();
  const currentUsername = db.activeUsername;

  if (targetUsername === currentUsername) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  const currentUser = db.users.find(u => u.username === currentUsername);
  const targetUser = db.users.find(u => u.username === targetUsername);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!currentUser.following) currentUser.following = [];
  if (!targetUser.followers) targetUser.followers = [];

  const isAlreadyFollowing = currentUser.following.includes(targetUsername);

  if (isAlreadyFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(u => u !== targetUsername);
    targetUser.followers = targetUser.followers.filter(u => u !== currentUsername);
  } else {
    // Follow
    currentUser.following.push(targetUsername);
    targetUser.followers.push(currentUsername);

    // Add Notification
    db.notifications.unshift({
      id: 'n_' + Date.now(),
      recipientUsername: targetUsername,
      actorUsername: currentUsername,
      type: 'follow',
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  writeDb(db);

  res.json({
    isFollowing: !isAlreadyFollowing,
    targetUser: enrichUser(targetUser, currentUsername, db.users),
    currentUser: enrichUser(currentUser, currentUsername, db.users)
  });
});

// 3. Posts Routes
app.get('/api/posts', (req, res) => {
  const { feed = 'all', username, search, tag, likedBy } = req.query;
  const db = readDb();
  const currentUsername = db.activeUsername;
  const currentUser = db.users.find(u => u.username === currentUsername);

  let filtered = [...db.posts];

  // Feed filter
  if (feed === 'following') {
    const followingList = currentUser ? currentUser.following || [] : [];
    // Include user's own posts + posts from people they follow
    filtered = filtered.filter(p => p.authorUsername === currentUsername || followingList.includes(p.authorUsername));
  } else if (feed === 'trending') {
    // Sort by likes + comments count
    filtered = filtered.slice().sort((a, b) => {
      const scoreA = (a.likes ? a.likes.length : 0) * 2 + (a.comments ? a.comments.length : 0) * 3;
      const scoreB = (b.likes ? b.likes.length : 0) * 2 + (b.comments ? b.comments.length : 0) * 3;
      return scoreB - scoreA;
    });
  }

  // Filter by author
  if (username) {
    filtered = filtered.filter(p => p.authorUsername.toLowerCase() === username.toLowerCase());
  }

  // Filter by likedBy
  if (likedBy) {
    filtered = filtered.filter(p => (p.likes || []).includes(likedBy));
  }

  // Filter by tag
  if (tag) {
    filtered = filtered.filter(p => (p.tags || []).some(t => t.toLowerCase() === tag.toLowerCase()));
  }

  // Filter by search query
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.content.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
      p.authorUsername.toLowerCase().includes(q)
    );
  }

  // If not trending sort, default sort by newest first
  if (feed !== 'trending') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const enriched = filtered.map(p => enrichPost(p, currentUsername, db.users));
  res.json(enriched);
});

// Create Post
app.post('/api/posts', (req, res) => {
  const { content, mediaUrl } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  const db = readDb();
  const currentUsername = db.activeUsername;

  // Extract hashtags from content
  const regex = /#([a-zA-Z0-9_]+)/g;
  const tags = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    tags.push(match[1].toLowerCase());
  }

  const newPost = {
    id: 'p_' + Date.now(),
    authorUsername: currentUsername,
    content: content.trim(),
    mediaUrl: mediaUrl || '',
    tags: Array.from(new Set(tags)),
    createdAt: new Date().toISOString(),
    likes: [],
    comments: []
  };

  db.posts.unshift(newPost);
  writeDb(db);

  res.status(201).json(enrichPost(newPost, currentUsername, db.users));
});

// Delete Post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const post = db.posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (post.authorUsername !== db.activeUsername) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }

  db.posts = db.posts.filter(p => p.id !== id);
  // Also clean related notifications
  db.notifications = db.notifications.filter(n => n.postId !== id);

  writeDb(db);
  res.json({ success: true, deletedPostId: id });
});

// Toggle Like
app.post('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const currentUsername = db.activeUsername;
  const post = db.posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (!post.likes) post.likes = [];

  const alreadyLiked = post.likes.includes(currentUsername);

  if (alreadyLiked) {
    post.likes = post.likes.filter(u => u !== currentUsername);
  } else {
    post.likes.push(currentUsername);

    // Notify author if not self-like
    if (post.authorUsername !== currentUsername) {
      db.notifications.unshift({
        id: 'n_' + Date.now(),
        recipientUsername: post.authorUsername,
        actorUsername: currentUsername,
        type: 'like',
        postId: post.id,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  writeDb(db);
  res.json({
    isLiked: !alreadyLiked,
    likesCount: post.likes.length
  });
});

// Add Comment
app.post('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content cannot be empty' });
  }

  const db = readDb();
  const currentUsername = db.activeUsername;
  const post = db.posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (!post.comments) post.comments = [];

  const newComment = {
    id: 'c_' + Date.now(),
    authorUsername: currentUsername,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  post.comments.push(newComment);

  // Notify post author if not commenting on own post
  if (post.authorUsername !== currentUsername) {
    db.notifications.unshift({
      id: 'n_' + Date.now(),
      recipientUsername: post.authorUsername,
      actorUsername: currentUsername,
      type: 'comment',
      postId: post.id,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  writeDb(db);

  const author = db.users.find(u => u.username === currentUsername);
  res.status(201).json({
    ...newComment,
    author: {
      username: author.username,
      name: author.name,
      avatar: author.avatar
    },
    isOwner: true,
    commentsCount: post.comments.length
  });
});

// Delete Comment
app.delete('/api/posts/:id/comments/:commentId', (req, res) => {
  const { id, commentId } = req.params;
  const db = readDb();
  const post = db.posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const comment = (post.comments || []).find(c => c.id === commentId);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (comment.authorUsername !== db.activeUsername && post.authorUsername !== db.activeUsername) {
    return res.status(403).json({ error: 'You are not authorized to delete this comment' });
  }

  post.comments = post.comments.filter(c => c.id !== commentId);
  writeDb(db);

  res.json({ success: true, commentsCount: post.comments.length });
});

// 4. Notifications Route
app.get('/api/notifications', (req, res) => {
  const db = readDb();
  const currentUsername = db.activeUsername;
  const userNotifs = (db.notifications || []).filter(n => n.recipientUsername === currentUsername);

  // Enrich with actor info
  const enriched = userNotifs.map(n => {
    const actor = db.users.find(u => u.username === n.actorUsername) || {
      username: n.actorUsername,
      name: n.actorUsername,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    return {
      ...n,
      actor
    };
  });

  res.json(enriched);
});

// Mark notifications read
app.post('/api/notifications/read', (req, res) => {
  const db = readDb();
  const currentUsername = db.activeUsername;
  db.notifications.forEach(n => {
    if (n.recipientUsername === currentUsername) {
      n.read = true;
    }
  });
  writeDb(db);
  res.json({ success: true });
});

// 5. Trending Topics & Stats
app.get('/api/trending', (req, res) => {
  const db = readDb();
  const tagCounts = {};

  db.posts.forEach(p => {
    (p.tags || []).forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const trendingTags = Object.keys(tagCounts)
    .map(tag => ({ tag, count: tagCounts[tag] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  res.json({
    tags: trendingTags,
    totalPosts: db.posts.length,
    totalUsers: db.users.length
  });
});

// ==========================================
// 6. Direct Messaging (1-on-1 Chat) Endpoints
// ==========================================

// Get all conversations for active user
app.get('/api/conversations', (req, res) => {
  const db = readDb();
  const currentUsername = db.activeUsername;
  const messages = db.messages || [];

  const partnersMap = new Map();

  messages.forEach(m => {
    let partnerUsername = null;
    if (m.senderUsername === currentUsername) {
      partnerUsername = m.recipientUsername;
    } else if (m.recipientUsername === currentUsername) {
      partnerUsername = m.senderUsername;
    }

    if (partnerUsername) {
      if (!partnersMap.has(partnerUsername)) {
        partnersMap.set(partnerUsername, {
          partnerUsername,
          lastMessage: m,
          unreadCount: 0
        });
      }

      const conv = partnersMap.get(partnerUsername);
      if (new Date(m.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = m;
      }
      if (m.recipientUsername === currentUsername && !m.read) {
        conv.unreadCount += 1;
      }
    }
  });

  const conversations = Array.from(partnersMap.values())
    .map(c => {
      const user = db.users.find(u => u.username === c.partnerUsername) || {
        username: c.partnerUsername,
        name: c.partnerUsername,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        title: 'Pulse Member'
      };
      return {
        partner: {
          id: user.id,
          username: user.username,
          name: user.name,
          avatar: user.avatar,
          title: user.title,
          bio: user.bio
        },
        lastMessage: c.lastMessage,
        unreadCount: c.unreadCount
      };
    })
    .sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

  res.json(conversations);
});

// Get messages between active user and :username
app.get('/api/messages/:username', (req, res) => {
  const db = readDb();
  const currentUsername = db.activeUsername;
  const targetUsername = req.params.username;

  const partner = db.users.find(u => u.username === targetUsername);
  if (!partner) {
    return res.status(404).json({ error: 'User not found' });
  }

  const messages = (db.messages || []).filter(m =>
    (m.senderUsername === currentUsername && m.recipientUsername === targetUsername) ||
    (m.senderUsername === targetUsername && m.recipientUsername === currentUsername)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Mark all unread messages from target to current user as read
  let updated = false;
  messages.forEach(m => {
    if (m.recipientUsername === currentUsername && !m.read) {
      m.read = true;
      updated = true;
    }
  });
  if (updated) {
    writeDb(db);
  }

  res.json({
    partner: {
      id: partner.id,
      username: partner.username,
      name: partner.name,
      avatar: partner.avatar,
      title: partner.title,
      bio: partner.bio
    },
    messages
  });
});

// Send message to :username
app.post('/api/messages/:username', (req, res) => {
  const db = readDb();
  const currentUsername = db.activeUsername;
  const targetUsername = req.params.username;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const targetUser = db.users.find(u => u.username === targetUsername);
  if (!targetUser) {
    return res.status(404).json({ error: 'Recipient not found' });
  }

  if (targetUsername === currentUsername) {
    return res.status(400).json({ error: 'Cannot send message to yourself' });
  }

  if (!db.messages) db.messages = [];

  const newMsg = {
    id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    senderUsername: currentUsername,
    recipientUsername: targetUsername,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    read: false
  };

  db.messages.push(newMsg);

  // Also add a notification for recipient
  if (!db.notifications) db.notifications = [];
  db.notifications.push({
    id: 'n_' + Date.now(),
    recipientUsername: targetUsername,
    actorUsername: currentUsername,
    type: 'message',
    messageSnippet: newMsg.content.length > 50 ? newMsg.content.substring(0, 47) + '...' : newMsg.content,
    read: false,
    createdAt: new Date().toISOString()
  });

  writeDb(db);
  res.status(201).json(newMsg);
});

// Get total unread messages count for active user
app.get('/api/messages-unread-count', (req, res) => {
  const db = readDb();
  const currentUsername = db.activeUsername;
  const unreadCount = (db.messages || []).filter(m => m.recipientUsername === currentUsername && !m.read).length;
  res.json({ unreadCount });
});

// Initialize and Start Server
initDb();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
