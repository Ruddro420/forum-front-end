import {
  ArrowUp, ArrowDown, MessageCircle, Bookmark, Flag, Clock, Eye
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { format } from 'timeago.js';
import { useAuth } from '../Auth/context/AuthContext';

const QuestionDetail = () => {
  const [userVote, setUserVote] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [post, setPost] = useState({});
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [views, setViews] = useState(0);

  const { id } = useParams();
  const { fetchPost } = useAuth();

  // Fetch post data
  const fetchPostByID = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/posts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const data = await res.json();
      setPost(data.data);
    } catch (error) {
      console.error("Fetch post error:", error);
    }
  };

  // Record view
  const recordView = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      await fetch(`${import.meta.env.VITE_SERVER_API}/post/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: id, user_id: userId }),
      });
    } catch (err) {
      console.error("Failed to record view:", err);
    }
  };

  // Get updated view count
  const getViewCount = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/post/views/${id}`);
      const data = await res.json();
      setViews(data.views || 0);
    } catch (err) {
      console.error("View count fetch error:", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchPostByID();
    recordView();
    getViewCount();
  }, [id]);

  // Post comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    const formData = new FormData();
    formData.append('post_id', post.id);
    formData.append('user_id', sessionStorage.getItem('userId'));
    formData.append('comment', commentText);
    if (commentFile) formData.append('file', commentFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/comments/store`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setPost((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), result.data],
        }));
        setCommentText('');
        setCommentFile(null);
        fetchPostByID();
        fetchPost();
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const tagArray = post.tag?.split(',') || [];
  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
  ];

  const handleVote = (type) => {
    setUserVote(userVote === type ? null : type);
  };

  return (
    <div className="mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><NavLink to="/" className="hover:text-blue-600">Home</NavLink></li>
          <li>/</li>
          <li><a href="#" className="hover:text-blue-600">Questions</a></li>
          <li>/</li>
          <li className="text-gray-900">{post.title}</li>
        </ol>
      </nav>

      {/* Question Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex gap-6">
          {/* Voting */}
          <div className="flex flex-col items-center space-y-3">
            <button onClick={() => handleVote('up')} className={`p-2 rounded-lg ${userVote === 'up' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'}`}>
              <ArrowUp className="h-6 w-6" />
            </button>
            <span className="text-2xl font-bold text-gray-900">{post.votes?.length || 0}</span>
            <button onClick={() => handleVote('down')} className={`p-2 rounded-lg ${userVote === 'down' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-400'}`}>
              <ArrowDown className="h-6 w-6" />
            </button>
            <button onClick={() => setIsBookmarked(!isBookmarked)} className={`p-2 rounded-lg ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100 text-gray-400'}`}>
              <Bookmark className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {/* Meta Info */}
            <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
              <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> <span>Asked {format(post.created_at)}</span></div>
              <div className="flex items-center"><Eye className="h-4 w-4 mr-1" /> <span>{views} views</span></div>
              <div className="flex items-center"><MessageCircle className="h-4 w-4 mr-1" /> <span>{post.comments?.length || 0} answers</span></div>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.details}</div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tagArray.map((tag, index) => (
                <span key={index} className={`px-2 py-1 rounded text-xs font-medium ${tagColors[index % tagColors.length]}`}>{tag.trim()}</span>
              ))}
            </div>

            {/* Category Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-gray-600">
                  <Flag className="h-4 w-4 mr-1" /> {post?.category?.name}
                </span>
                <span className="flex items-center text-gray-600">
                  <Flag className="h-4 w-4 mr-1" /> {post?.sub_category?.name}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-500">asked by</div>
                  <div className="font-medium text-gray-900">{post?.student_id || 'Admin'}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {post?.student_id?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments/Answers */}
      {post.comments?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{post.comments.length} Answers</h2>
          <div className="space-y-6">
            {post.comments.map((comment, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-gray-700 whitespace-pre-wrap mb-2">{comment.comment}</div>
                {comment.file && (
                  <a href={`${import.meta.env.VITE_SERVER_BASE}/storage/${comment.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Attached File
                  </a>
                )}
                <div className="flex items-center mt-4 space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-medium">
                    {comment.user?.first_name?.charAt(0) || '?'}
                  </div>
                  <div className="text-sm text-gray-700">{comment.user?.first_name || 'Anonymous'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Comment */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your answer here..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center justify-between mt-4">
          <input type="file" onChange={(e) => setCommentFile(e.target.files[0])} />
          <button onClick={handlePostComment} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
            Post Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
