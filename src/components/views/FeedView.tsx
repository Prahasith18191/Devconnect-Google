import React, { useState } from 'react';
import { CommunityPost } from '../../types';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send, 
  Code, 
  Sparkles, 
  Check, 
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

interface FeedViewProps {
  posts: CommunityPost[];
  onCreatePost: (content: string, codeSnippet?: string) => void;
  onReactPost: (postId: string, reaction: 'like' | 'dislike') => void;
  onAddComment: (postId: string, content: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  onCreatePost,
  onReactPost,
  onAddComment,
}) => {
  const [content, setContent] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onCreatePost(content.trim(), codeSnippet.trim() || undefined);
    setContent('');
    setCodeSnippet('');
    setShowCode(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="relative z-10 space-y-6 py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white glow-text">
          Community Builder Feed
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Share your prototypes, architectural snippets, and learnings during the Hyderabad bootcamp.
        </p>
      </div>

      {/* Post Composer Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex items-start gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80"
            alt="Prahasith"
            className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
          />
          <div className="flex-1 space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are you building or debugging at the bootcamp today?"
              rows={3}
              className="w-full p-3 glass-input rounded-xl text-xs sm:text-sm placeholder-zinc-500 font-sans resize-none"
            />

            {showCode && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Python / FastAPI Code Block:</span>
                  <button
                    type="button"
                    onClick={() => setShowCode(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder={`@router.post("/query")\nasync def agent_query(req: AgentRequest):\n    return await agent.run(req.prompt)`}
                  rows={4}
                  className="w-full p-3 bg-black/70 border border-white/10 rounded-xl font-mono text-xs text-white placeholder-zinc-600 resize-none focus:outline-none focus:border-white/30"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showCode
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCode ? 'Snippet Ready' : 'Attach Code Snippet'}</span>
          </button>

          <button
            type="submit"
            disabled={!content.trim()}
            className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 disabled:opacity-40 transition-all shadow-sm"
          >
            Publish Post
          </button>
        </div>
      </form>

      {/* Feed Stream */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isLiked = post.userReaction === 'like';
          const isDisliked = post.userReaction === 'dislike';

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl space-y-4"
            >
              {/* Author Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-xl object-cover border border-white/15"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{post.authorName}</h3>
                    <p className="text-xs text-zinc-400">{post.authorHeadline}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                  {post.timestamp}
                </span>
              </div>

              {/* Content */}
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                {post.content}
              </p>

              {/* Code Snippet Box */}
              {post.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black/80">
                  <div className="px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>Python 3.13 / FastAPI</span>
                    <span className="text-emerald-400">Pydantic v1</span>
                  </div>
                  <pre className="p-3.5 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                    <code>{post.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Reactions Bar (Single Reaction Invariant Enforced) */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReactPost(post.id, 'like')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isLiked
                        ? 'bg-white text-black font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => onReactPost(post.id, 'dislike')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isDisliked
                        ? 'bg-white text-black font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.dislikesCount}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(
                        activeCommentPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors ml-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono tabular-nums">{post.comments.length}</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
                  Verified Postgres Invariant
                </div>
              </div>

              {/* Comments Section */}
              {activeCommentPostId === post.id && (
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <div className="space-y-2">
                    {post.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5"
                      >
                        <img
                          src={c.authorAvatar}
                          alt={c.authorName}
                          className="w-6 h-6 rounded-md object-cover border border-white/20 shrink-0 mt-0.5"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">{c.authorName}</span>
                            <span className="text-[10px] font-mono text-zinc-400">{c.timestamp}</span>
                          </div>
                          <p className="text-xs text-zinc-300 mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a constructive comment or feedback..."
                      className="flex-1 px-3 py-2 glass-input rounded-xl text-xs placeholder-zinc-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="px-3.5 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Reply</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
