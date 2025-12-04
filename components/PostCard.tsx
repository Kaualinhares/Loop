import React, { useState } from 'react';
import { Post, User, Comment } from '../types';
import { loopService } from '../services/LoopDataService';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Send, User as UserIcon, Repeat } from 'lucide-react';

interface PostCardProps {
  post: Post;
  author?: User;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onUserClick?: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, author, onLikeToggle, onSaveToggle, onUserClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>(post.comments);
  const [isReposted, setIsReposted] = useState(post.isRepostedByCurrentUser);
  const [repostCount, setRepostCount] = useState(post.reposts);
  
  const currentUser = loopService.getCurrentUser();
  const [isFollowing, setIsFollowing] = useState(author ? loopService.isFollowing(author.id) : false);

  if (!author) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment = loopService.addComment(post.id, commentText);
    if (newComment) {
        setCommentsList([...commentsList, newComment]);
        setCommentText('');
    }
  };

  const handleRepost = () => {
      loopService.toggleRepost(post.id);
      setIsReposted(!isReposted);
      setRepostCount(prev => isReposted ? prev - 1 : prev + 1);
  };

  const handleFollow = (e: React.MouseEvent) => {
      e.stopPropagation();
      loopService.toggleFollow(author.id);
      setIsFollowing(!isFollowing);
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "a";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " sem";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "agora";
  };

  const handleUserClickAction = () => {
      if (onUserClick && author.id !== currentUser.id) {
          onUserClick(author.id);
      }
  };

  const isMe = author.id === currentUser.id;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm mb-6 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-3.5">
          <div 
            onClick={handleUserClickAction} 
            className="relative cursor-pointer group"
          >
              <img 
                src={author.avatarUrl} 
                alt={author.name} 
                className="w-11 h-11 rounded-full object-cover border border-gray-100 dark:border-gray-700"
              />
          </div>
          
          <div className="leading-tight flex flex-col items-start">
            <div className="flex items-center gap-2">
                <h3 
                    onClick={handleUserClickAction}
                    className="font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer text-[15px]"
                >
                    {author.name}
                </h3>
                {/* Follow Button */}
                {!isFollowing && !isMe && (
                    <button 
                        onClick={handleFollow}
                        className="text-cyan-600 dark:text-cyan-400 text-xs font-bold hover:text-cyan-700 transition-colors flex items-center gap-1 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-0.5 rounded-full"
                    >
                        Seguir
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{author.handle}</span>
                <span>•</span>
                {post.location ? (
                    <span className="truncate max-w-[150px]">{post.location}</span>
                ) : (
                    <span>{timeAgo(post.timestamp)}</span>
                )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 py-1">
        {post.taggedUsers && post.taggedUsers.length > 0 && (
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 w-fit px-2 py-1 rounded-md">
                <UserIcon size={12} className="text-cyan-600" />
                <span>
                    Com <span className="font-semibold">{post.taggedUsers.map(id => loopService.getUserById(id)?.name.split(' ')[0]).join(', ')}</span>
                </span>
            </div>
        )}
        {post.content && (
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-[15px] leading-relaxed mb-3">
            {post.content}
            </p>
        )}
      </div>

      {/* Image Attachment */}
      {post.imageUrl && (
        <div className="w-full bg-gray-100 dark:bg-black overflow-hidden relative border-y border-gray-100 dark:border-gray-800">
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </div>
      )}

      {/* Footer Actions */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-1.5 p-2 -ml-2 rounded-full transition-all duration-300 group ${
              post.isLikedByCurrentUser ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400 hover:text-pink-500'
            }`}
          >
            <div className={`p-1.5 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 ${post.isLikedByCurrentUser ? 'bg-pink-50 dark:bg-pink-900/20' : ''} transition-transform group-active:scale-90`}>
               <Heart size={22} fill={post.isLikedByCurrentUser ? "currentColor" : "none"} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold min-w-[20px]">{post.likes > 0 ? post.likes : ''}</span>
          </button>

          <button 
             onClick={() => setShowComments(!showComments)}
             className={`flex items-center gap-1.5 p-2 rounded-full transition-all duration-300 group ${
                showComments ? 'text-cyan-600' : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600'
             }`}
          >
            <div className={`p-1.5 rounded-full group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 ${showComments ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''} transition-transform group-active:scale-90`}>
              <MessageCircle size={22} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold min-w-[20px]">{commentsList.length > 0 ? commentsList.length : ''}</span>
          </button>

          <button 
             onClick={handleRepost}
             className={`flex items-center gap-1.5 p-2 rounded-full transition-all duration-300 group ${
                isReposted ? 'text-green-600' : 'text-gray-500 dark:text-gray-400 hover:text-green-600'
             }`}
          >
            <div className={`p-1.5 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 ${isReposted ? 'bg-green-50 dark:bg-green-900/20' : ''} transition-transform group-active:scale-90`}>
              <Repeat size={22} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold min-w-[20px]">{repostCount > 0 ? repostCount : ''}</span>
          </button>
          
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 group ml-1">
             <Share2 size={22} strokeWidth={2} />
          </button>
        </div>

        <button 
            onClick={() => onSaveToggle(post.id)}
            className={`p-2 rounded-full transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 ${
                post.isSavedByCurrentUser ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600'
            }`}
        >
            <Bookmark size={22} fill={post.isSavedByCurrentUser ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-5 pb-5 pt-0 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-3xl">
           <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar pt-4">
              {commentsList.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">Sem comentários ainda. Seja o primeiro!</p>
              )}
              {commentsList.map(comment => {
                  const commentUser = loopService.getUserById(comment.userId);
                  return (
                      <div key={comment.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                           <img src={commentUser?.avatarUrl} className="w-8 h-8 rounded-full mt-1" alt="avatar" />
                           <div className="bg-white dark:bg-gray-700/80 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm text-sm border border-gray-100 dark:border-gray-600">
                               <span className="font-bold text-gray-900 dark:text-gray-100 mr-2">{commentUser?.name}</span>
                               <span className="text-gray-700 dark:text-gray-300 block mt-0.5">{comment.text}</span>
                           </div>
                      </div>
                  );
              })}
           </div>
           
           <form onSubmit={handleAddComment} className="flex gap-2 items-center relative">
               <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-full pl-5 pr-12 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none dark:text-white shadow-sm"
               />
               <button 
                  type="submit" 
                  disabled={!commentText.trim()}
                  className="absolute right-2 p-1.5 text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-600 rounded-full transition-all shadow-sm"
               >
                   <Send size={16} />
               </button>
           </form>
        </div>
      )}
    </div>
  );
};