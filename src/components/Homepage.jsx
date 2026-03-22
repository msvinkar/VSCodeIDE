import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/userSlice';
import './Homepage.css';
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  Home,
  Compass,
  MessageSquare,
  Bookmark,
  User,
  LogOut,
  MoreHorizontal,
} from 'lucide-react';

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Sarah Anderson',
    handle: '@sarah_anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    caption: 'Mountain views never get old! 🏔️ #adventure #nature',
    likes: 2481,
    comments: 156,
    liked: false,
    saved: false,
  },
  {
    id: 2,
    author: 'Alex Rivera',
    handle: '@alex_rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop',
    caption: 'Coffee and code - the perfect combination ☕💻',
    likes: 1829,
    comments: 203,
    liked: false,
    saved: false,
  },
  {
    id: 3,
    author: 'Jordan Lee',
    handle: '@jordan_lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    image: 'https://images.unsplash.com/photo-1537905904737-146b2d5e9910?w=500&h=500&fit=crop',
    caption: 'Sunset golden hour 🌅✨ Nothing beats this view!',
    likes: 3542,
    comments: 421,
    liked: false,
    saved: false,
  },
];

const MOCK_STORIES = [
  { id: 1, name: 'Your Story', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You', viewed: true },
  { id: 2, name: 'emma_watson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', viewed: false },
  { id: 3, name: 'john_doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', viewed: false },
  { id: 4, name: 'lisa_chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', viewed: false },
  { id: 5, name: 'mike_wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', viewed: false },
];

export default function Homepage({ userEmail, userName, onLogout }) {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logoutUser());
    onLogout();
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleSave = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };

  return (
    <div className="homepage">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">📷</div>
          <h1>InstaCopy</h1>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={24} />
            <span>Home</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Compass size={24} />
            <span>Explore</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare size={24} />
            <span>Messages</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={24} />
            <span>Saved</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={24} />
            <span>Profile</span>
          </button>
        </nav>

        <button className="logout-btn-sidebar" onClick={handleLogout}>
          <LogOut size={24} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'home' && (
          <>
            {/* Stories */}
            <section className="stories-section">
              <div className="stories-container">
                {MOCK_STORIES.map(story => (
                  <div
                    key={story.id}
                    className={`story ${story.viewed ? 'viewed' : 'new'}`}
                  >
                    <img src={story.avatar} alt={story.name} className="story-avatar" />
                    <p className="story-name">{story.name}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Feed */}
            <section className="feed">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-user">
                      <img src={post.avatar} alt={post.author} className="user-avatar" />
                      <div className="user-info">
                        <h3 className="author-name">{post.author}</h3>
                        <p className="author-handle">{post.handle}</p>
                      </div>
                    </div>
                    <button className="more-options">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="post-image">
                    <img src={post.image} alt="Post" />
                  </div>

                  <div className="post-actions">
                    <button
                      className={`action-btn ${post.liked ? 'liked' : ''}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart size={24} fill={post.liked ? 'currentColor' : 'none'} />
                    </button>
                    <button className="action-btn">
                      <MessageCircle size={24} />
                    </button>
                    <button className="action-btn">
                      <Share2 size={24} />
                    </button>
                    <button
                      className={`action-btn save-btn ${post.saved ? 'saved' : ''}`}
                      onClick={() => toggleSave(post.id)}
                    >
                      <Bookmark size={24} fill={post.saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="post-stats">
                    <p className="likes"><strong>{post.likes.toLocaleString()}</strong> likes</p>
                    <p className="caption">
                      <strong>{post.author}</strong> {post.caption}
                    </p>
                    <p className="comments-link">View all {post.comments} comments</p>
                    <div className="comment-input">
                      <input type="text" placeholder="Add a comment..." />
                      <button>Post</button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {activeTab === 'profile' && (
          <section className="profile-section">
            <div className="profile-header">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`}
                alt="Profile"
                className="profile-avatar"
              />
              <div className="profile-info">
                <h2 className="profile-username">{userName}</h2>
                <p className="profile-email">{userEmail}</p>
                <div className="profile-stats">
                  <div className="stat">
                    <strong>248</strong>
                    <span>Posts</span>
                  </div>
                  <div className="stat">
                    <strong>5.2K</strong>
                    <span>Followers</span>
                  </div>
                  <div className="stat">
                    <strong>842</strong>
                    <span>Following</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="profile-bio">Welcome to your profile! 🎉</p>
          </section>
        )}

        {activeTab === 'explore' && (
          <section className="explore-section">
            <h2>Explore</h2>
            <p>Discover trending posts and accounts</p>
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="messages-section">
            <h2>Direct Messages</h2>
            <p>No messages yet</p>
          </section>
        )}

        {activeTab === 'saved' && (
          <section className="saved-section">
            <h2>Saved Posts</h2>
            <div className="saved-posts">
              {posts.filter(p => p.saved).length > 0 ? (
                posts.filter(p => p.saved).map(post => (
                  <div key={post.id} className="saved-post-item">
                    <img src={post.image} alt="Saved post" />
                  </div>
                ))
              ) : (
                <p>No saved posts yet</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
