import React, { useState, useEffect } from 'react';
import { BlogPost } from './types';
import { Header } from './components/Header';
import { BlogCard } from './components/blog/BlogCard';
import { BlogEditor } from './components/blog/BlogEditor';
import { ShareModal } from './components/blog/ShareModal';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { saveBlogPosts, loadBlogPosts } from './utils/storage';
import { BookOpen, Sparkles } from 'lucide-react';

function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [sharePost, setSharePost] = useState<BlogPost | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    const loadedPosts = loadBlogPosts();
    setPosts(loadedPosts);
  }, []);

  useEffect(() => {
    saveBlogPosts(posts);
  }, [posts]);

  const handleCreatePost = () => {
    setIsCreating(true);
  };

  const handleSavePost = (post: BlogPost) => {
    if (editingPost) {
      setPosts(posts.map(p => p.id === post.id ? post : p));
      setEditingPost(null);
    } else {
      setPosts([post, ...posts]);
      setIsCreating(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    setDeletePostId(null);
  };

  const handleLikePost = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const availableTags = [...new Set(posts.flatMap(post => post.tags))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (isCreating || editingPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BlogEditor
          post={editingPost || undefined}
          onSave={handleSavePost}
          onCancel={() => {
            setIsCreating(false);
            setEditingPost(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header
        onCreatePost={handleCreatePost}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        availableTags={availableTags}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to BlogSpace</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Share your thoughts, stories, and ideas with the world. Create your first blog post and start building your digital presence.
            </p>
            <Button onClick={handleCreatePost} size="lg" className="mx-auto">
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Latest Blog Posts
              </h1>
              <p className="text-xl text-gray-600">
                Discover amazing stories and insights from our community
              </p>
              {(searchQuery || selectedTag) && (
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>Showing {filteredPosts.length} of {posts.length} posts</span>
                  {searchQuery && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      "{searchQuery}"
                    </span>
                  )}
                  {selectedTag && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      #{selectedTag}
                    </span>
                  )}
                </div>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedTag 
                    ? "Try adjusting your search or filter criteria"
                    : "Be the first to create a blog post!"
                  }
                </p>
                {!searchQuery && !selectedTag && (
                  <Button onClick={handleCreatePost}>Create First Post</Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={(id) => setDeletePostId(id)}
                    onShare={(post) => setSharePost(post)}
                    onLike={handleLikePost}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <ShareModal
        isOpen={!!sharePost}
        onClose={() => setSharePost(null)}
        post={sharePost!}
      />

      <Modal
        isOpen={!!deletePostId}
        onClose={() => setDeletePostId(null)}
        title="Delete Post"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              onClick={() => setDeletePostId(null)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deletePostId && handleDeletePost(deletePostId)}
              variant="danger"
            >
              Delete Post
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;