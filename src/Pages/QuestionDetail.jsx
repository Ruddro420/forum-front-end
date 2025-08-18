/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowUp, ArrowDown, MessageCircle, Bookmark, Share2, Flag, Clock, Eye, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router';
import { format } from 'timeago.js';
import { useAuth } from '../Auth/context/AuthContext';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/RichTextEditor';
import QuestionDetailsSidebar from '../components/Question/QuestionDetailsSidebar';
import Loader from '../components/Loader';
const QuestionDetail = () => {
  const userId = sessionStorage.getItem("userId");
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [views, setViews] = useState(0);
  // get id 
  const { id } = useParams();
  const { fetchPost, fetchTotalData } = useAuth()

  // fetch post data
  const fetchPostByID = async () => {
    setLoading(true);
    //   const userId = sessionStorage.getItem("userId");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/posts/${id}`);
      // console.log("respose of me",res);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setPost(data.data);
      fetchTotalData();
    } catch (error) {
      console.error("Fetch user error:", error);
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // add post comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    const formData = new FormData();
    formData.append('post_id', post.id);
    formData.append('user_id', sessionStorage.getItem('userId')); // or wherever your user ID is stored
    formData.append('comment', commentText);
    if (commentFile) {
      formData.append('file', commentFile);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/comments/store`, {
        method: 'POST',
        body: formData
      });

      const result = await res.json();

      if (result.success) {
        setPost((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), result.data]
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

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_API}/vote-count/${id}`);
        const data = await res.json();
        if (data.success) {
          setVotes(data.data);
        }
      } catch (err) {
        console.error("Error fetching votes", err);
      }
    };

    fetchVotes();
  }, [id]);

  const navigate = useNavigate()
  // add vote
  const handleVote = async (voteType) => {
    if (!userId) {
      toast.error('Please login for voting');
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/vote`, {
        method: "POST",
        credentials: "include", // important if using Sanctum
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: id,
          user_id: userId, // assuming you have auth user context
          vote: voteType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Refresh vote count
        const voteRes = await fetch(`${import.meta.env.VITE_SERVER_API}/vote-count/${id}`);
        const voteData = await voteRes.json();
        if (voteData.success) {
          setVotes(voteData.data);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };












  // console.log(post);
  // trim tags
  const tagArray = post.tag?.split(',') || [];
  // tag color
  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
  ];


  return (
    <>
      {loading ? <div className="w-screen h-screen flex justify-center items-center"><Loader /></div> : <div className=" mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><NavLink to={`/`} className="hover:text-blue-600">Home</NavLink></li>
            <li>/</li>
            <li><a href="#" className="hover:text-blue-600">Questions</a></li>
            <li>/</li>
            <li className="text-gray-900">{post.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className='lg:col-span-2'>
            {/* Question */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">

              <div className="flex gap-6">
                {/* Vote Section */}
                <div className="flex flex-col items-center space-y-2 min-w-0">
                  <button
                    onClick={() => handleVote("upvote")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ArrowUp className="h-5 w-5 text-gray-400 hover:text-green-600" />
                  </button>

                  <span className="text-lg font-medium bg-green-200 text-green-600 p-2 rounded">
                    {votes.upvotes}
                  </span>
                  <span className="text-lg font-medium bg-red-200 text-red-600 p-2 rounded">
                    {votes.downvotes}
                  </span>

                  <button
                    onClick={() => handleVote("downvote")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ArrowDown className="h-5 w-5 text-gray-400 hover:text-red-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Asked {format(post.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{views} views</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{post.comments?.length > 0 ? post.comments.length : 0} answers</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose max-w-none mb-6">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      <div
                        dangerouslySetInnerHTML={{ __html: post.details }}
                      ></div>

                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tagArray.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/forum/?tag=${tag}`}
                        className={`px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${tagColors[index % tagColors.length]
                          }`}
                      >
                        {tag.trim()}
                      </Link>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <Flag className="h-4 w-4 mr-1" />
                        {post?.category?.name}
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                        <Flag className="h-4 w-4 mr-1" />
                        {post?.sub_category?.name}
                      </button>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">asked by</div>
                        <div className="font-medium text-gray-900">{post?.student ? post.student.first_name : 'Admin'}</div>
                        {/* <div className="text-sm text-green-600">{question?.author?.reputation?.toLocaleString()}</div> */}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {post?.student ? post?.student?.first_name.split(' ').map(n => n[0]).join('') : 'A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers */}
            {post.comments?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {post.comments.length} Answers
                </h2>

                <div className="space-y-6">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-8">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center space-y-3">
                          {/* Upvote/downvote could be added later */}
                        </div>
                        <div className="flex-1">
                          <div className="prose max-w-none mb-6">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                              <div
                                dangerouslySetInnerHTML={{ __html: comment.comment }}
                              ></div>
                              {/* {comment.comment} */}
                            </div>
                            {comment.file && (
                              <a
                                href={`${import.meta.env.VITE_SERVER_BASE}/storage/${comment.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Attached File
                              </a>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <div className="text-sm text-gray-500">answered</div>
                                <div className="font-medium text-gray-900">
                                  {comment.user?.first_name || 'Unknown'}
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                {comment.user?.first_name?.charAt(0) || '?'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Add Answer */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>
              <RichTextEditor value={commentText} onChange={setCommentText} className={'w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'} />
              {/* <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your answer here..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        /> */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handlePostComment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Post Answer
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <QuestionDetailsSidebar tags={tagArray} />

        </div>

      </div>}
    </>

  );
};

export default QuestionDetail;
