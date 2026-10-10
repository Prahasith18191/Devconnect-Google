import React, { useState } from 'react';
import { CommunityPost } from '../../types';
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Code, Sparkles, AlertCircle } from 'lucide-react';

interface FrameCommunityFeedProps {
  posts: CommunityPost[];
  onCreatePost: (content: string, codeSnippet?: string) => void;
  onReactPost: (postId: string, reaction: 'like' | 'dislike') => void;
  onAddComment: (postId: string, content: string) => void;
}

export const FrameCommunityFeed: React.FC<FrameCommunityFeedProps> = ({
  posts,
  onCreatePost,
  onReactPost,
  onAddComment,
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onCreatePost(newPostContent.trim(), codeSnippet.trim() || undefined);
    setNewPostContent('');
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentText.trim()) return;
    onAddComment(postId, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="bg-slate-900 min-h-full p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--ag-text)]">Community Builder Feed</h2>
        <p className="text-xs sm:text-sm text-[var(--ag-muted)]">
          Share what you are building at the Hyderabad bootcamp, post code snippets, and collaborate.
        </p>
      </div>

      {/* Post Composer Card */}
      <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 shadow-lg">
        <div className="flex items-start gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
            alt="Prahasith"
            className="w-10 h-10 rounded-xl object-cover border border-slate-600 shrink-0"
          />
          <div className="flex-1 space-y-2">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What are you building or exploring today at the bootcamp?"
              rows={3}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-[var(--ag-text)] placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans"
            />

            {showCodeInput && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--ag-muted)] font-mono">
                  <span>Python / Code Snippet:</span>
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(false)}
                    className="text-[var(--ag-faint)] hover:text-[var(--ag-muted)]"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder={`@router.post("/query")\nasync def handle_agent_call():\n    return {"status": "ok"}`}
                  rows={4}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-[var(--g-green)] placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowCodeInput(!showCodeInput)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showCodeInput
                ? 'bg-blue-950/70 text-blue-300 border border-blue-800'
                : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-slate-700/50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCodeInput ? 'Snippet Attached' : 'Attach Code Snippet'}</span>
          </button>

          <button
            type="submit"
            disabled={!newPostContent.trim()}
            className="px-5 py-2 text-xs font-semibold text-[var(--ag-text)] bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg shadow-sm transition-colors"
          >
            Publish Post
          </button>
        </div>
      </form>

      {/* Feed Posts Stream */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isLiked = post.userReaction === 'like';
          const isDisliked = post.userReaction === 'dislike';

          return (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/70 hover:border-slate-600 transition-colors space-y-4"
            >
              {/* Author Strip */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--ag-text)]">{post.authorName}</h3>
                    <p className="text-xs text-[var(--ag-muted)]">{post.authorHeadline}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[var(--ag-faint)] tabular-nums">
                  {post.timestamp}
                </span>
              </div>

              {/* Post Body */}
              <p className="text-xs sm:text-sm text-[var(--ag-text)] leading-relaxed">
                {post.content}
              </p>

              {/* Code Snippet Box (If Present) */}
              {post.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-[var(--ag-muted)] flex items-center justify-between">
                    <span>Python 3.13 / FastAPI</span>
                    <span className="text-[var(--g-green)]">Strict Pydantic v1</span>
                  </div>
                  <pre className="p-3 text-xs font-mono text-[var(--g-green)] overflow-x-auto leading-relaxed">
                    <code>{post.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Reactions Bar (Single Reaction Invariant Enforced) */}
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReactPost(post.id, 'like')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isLiked
                        ? 'bg-blue-600 text-[var(--ag-text)]'
                        : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-slate-700/50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => onReactPost(post.id, 'dislike')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isDisliked
                        ? 'bg-rose-600 text-[var(--ag-text)]'
                        : 'text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-slate-700/50'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.dislikesCount}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[var(--ag-muted)] hover:text-[var(--ag-text)] hover:bg-slate-700/50 rounded-lg transition-colors ml-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.comments.length} Comments</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[var(--ag-faint)]">
                  PostgreSQL Unique Constraint Enforced
                </div>
              </div>

              {/* Expandable Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="space-y-2">
                    {post.comments.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                        <img
                          src={c.authorAvatar}
                          alt={c.authorName}
                          className="w-6 h-6 rounded-md object-cover border border-slate-700 shrink-0 mt-0.5"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[var(--ag-text)]">{c.authorName}</span>
                            <span className="text-[10px] font-mono text-[var(--ag-faint)]">{c.timestamp}</span>
                          </div>
                          <p className="text-xs text-[var(--ag-muted)] mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a constructive comment..."
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-[var(--ag-text)] placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-[var(--ag-text)] rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Reply</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
