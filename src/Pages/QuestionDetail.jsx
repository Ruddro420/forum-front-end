/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Bookmark,
  Clock,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router";
import { format } from "timeago.js";
import { useAuth } from "../Auth/context/AuthContext";
import toast from "react-hot-toast";
import RichTextEditor from "../components/RichTextEditor";
import QuestionDetailsSidebar from "../components/Question/QuestionDetailsSidebar";
import Loader from "../components/Loader";

const QuestionDetail = () => {
  const userId = sessionStorage.getItem("userId");
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [post, setPost] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentFile, setCommentFile] = useState(null);
  const [views, setViews] = useState(0);

  // get id
  const { id } = useParams();
  const { fetchPost, fetchTotalData } = useAuth();
  const navigate = useNavigate();

  // fetch post data
  const fetchPostByID = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/posts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setPost(data.data);
      fetchTotalData();
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setLoading(false);
    }
  };

  // add post comment
  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    const formData = new FormData();
    formData.append("post_id", post.id);
    formData.append("user_id", sessionStorage.getItem("userId"));
    formData.append("comment", commentText);
    if (commentFile) {
      formData.append("file", commentFile);
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/comments/store`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (result.success) {
        setPost((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), result.data],
        }));
        setCommentText("");
        setCommentFile(null);
        fetchPostByID();
        fetchPost();
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  // Record view
  const recordView = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      await fetch(`${import.meta.env.VITE_SERVER_API}/post/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: id, user_id: userId }),
      });
    } catch (err) {
      console.error("Failed to record view:", err);
    }
  };

  // Get updated view count
  const getViewCount = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/post/views/${id}`
      );
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
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_API}/vote-count/${id}`
        );
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

  // add vote
  const handleVote = async (voteType) => {
    if (!userId) {
      toast.error("Please login for voting");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/vote`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: id,
          user_id: userId,
          vote: voteType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Refresh vote count
        const voteRes = await fetch(
          `${import.meta.env.VITE_SERVER_API}/vote-count/${id}`
        );
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

  // trim tags
  const tagArray = post.tag?.split(",") || [];
  // tag color
  const tagColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-yellow-100 text-yellow-800",
    "bg-pink-100 text-pink-800",
  ];

  return (
    <>
      {loading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="mx-auto px-4 py-4 md:py-8">
          {/* Mobile Header */}
          <div className="flex items-center mb-4 md:hidden">
            <button
              onClick={() => navigate(-1)}
              className="p-2 mr-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 truncate flex-1">
              Question
            </h1>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Breadcrumb - Hidden on mobile */}
          <nav className="mb-6 hidden md:block">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <NavLink to={`/`} className="hover:text-blue-600">
                  Home
                </NavLink>
              </li>
              <li>/</li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Questions
                </a>
              </li>
              <li>/</li>
              <li className="text-gray-900 truncate max-w-xs">{post.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              {/* Question */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                  {/* Vote Section - Responsive like QuestionCard */}
                  <div className="lg:flex flex-row lg:flex-col md:hidden hidden items-center justify-center md:justify-start gap-2 md:gap-3 min-w-0 flex-shrink-0 order-2 md:order-1">
                    <button
                      onClick={() => handleVote('upvote')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowUp className="h-5 w-5 text-gray-400 hover:text-green-600" />
                    </button>
                    <div className="flex flex-row md:flex-col items-center gap-2 md:gap-1">
                      <span className="text-base md:text-lg font-medium bg-green-200 text-green-600 px-2 py-1 rounded break-words truncate max-w-[60px] md:max-w-none">
                        {votes.upvotes}
                      </span>
                      <span className="text-base md:text-lg font-medium bg-red-200 text-red-600 px-2 py-1 rounded break-words truncate max-w-[60px] md:max-w-none">
                        {votes.downvotes}
                      </span>
                    </div>
                    <button
                      onClick={() => handleVote('downvote')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowDown className="h-5 w-5 text-gray-400 hover:text-red-600" />
                    </button>
                
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
                      <Bookmark className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                    </button>
                  </div>

                  {/* Mobile vote section */}
                  <div className="flex flex-row md:flex lg:hidden items-center justify-between  md:space-y-2 md:min-w-0 order-2 md:order-2 lg:order-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1 lg:py-2 rounded-lg text-center ${
                          post?.isAnswered
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <div className="text-base lg:text-lg font-semibold">
                          {post.comments?.length > 0
                            ? post.comments.length
                            : 0}{" "}
                          answers
                        </div>
                        {/* <div className="text-xs"></div> */}
                      </div>
                      <div className="text-center">
                        <div className="flex items-center text-gray-500">
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="text-xs">{views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center ">
                      <button
                        onClick={() => handleVote("upvote")}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <span className="text-lg font-medium bg-green-200 text-green-600 px-4  rounded flex items-center gap-2">
                          {votes.upvotes} 👍
                        </span>
                      </button>
                      <button
                        onClick={() => handleVote("downvote")}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <span className="text-lg font-medium bg-red-200 text-red-600 px-4 rounded flex items-center gap-2">
                          {votes.downvotes} 👎
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 order-1 md:order-1">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                      {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2 mb-4 md:mb-6 text-sm md:text-base text-gray-500">
                      <div className="flex items-center min-w-0">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          Asked {format(post.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center min-w-0">
                        <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{views} views</span>
                      </div>
                      <div className="flex items-center min-w-0">
                        <MessageCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {post.comments?.length > 0 ? post.comments.length : 0}{" "}
                          answers
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none mb-4 md:mb-6">
                      <div className="text-gray-700 leading-relaxed overflow-x-auto">
                        <div
                          dangerouslySetInnerHTML={{ __html: post.details }}
                        ></div>
                        {post.file && (
                          <a
                            href={`${
                              import.meta.env.VITE_SERVER_BASE
                            }/storage/${post.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm mt-2 inline-block"
                          >
                            Attached File
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Subjects (tag) */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tagArray.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/forum/?tag=${tag}`}
                          className={`px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                            tagColors[index % tagColors.length]
                          }`}
                        >
                          {tag.trim()}
                        </Link>
                      ))}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post?.category && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          {post.category.name}
                        </span>
                      )}
                      {post?.sub_category && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          {post.sub_category.name}
                        </span>
                      )}
                    </div>

                    {/* Author Info */}
                    <div className="lg:flex md:hidden hidden items-center justify-end gap-4 md:gap-0 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-xs md:text-sm text-gray-500">
                            asked by
                          </div>
                          <div className="font-medium text-gray-900 text-sm md:text-base">
                            {post?.student ? post.student.first_name : "Admin"}
                          </div>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs md:text-sm">
                          {post?.student
                            ? post?.student?.first_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "A"}
                        </div>
                      </div>
                    </div>

                  </div>
                  {/* Author Info  Mobile*/}
                    <div className="md:flex flex order-3 lg:hidden items-center justify-end gap-4 md:gap-0 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-xs md:text-sm text-gray-500">
                            asked by
                          </div>
                          <div className="font-medium text-gray-900 text-sm md:text-base">
                            {post?.student ? post.student.first_name : "Admin"}
                          </div>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs md:text-sm">
                          {post?.student
                            ? post?.student?.first_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "A"}
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {/* Answers */}
              {post.comments?.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                    {post.comments.length} Answers
                  </h2>

                  <div className="space-y-4 md:space-y-6">
                    {post.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8"
                      >
                        <div className="flex gap-4 md:gap-6">
                          <div className="flex flex-col items-center space-y-2 min-w-0">
                            {/* Upvote/downvote could be added later */}
                          </div>
                          <div className="flex-1">
                            <div className="prose max-w-none mb-4 md:mb-6">
                              <div className="text-gray-700 leading-relaxed overflow-x-auto">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: comment.comment,
                                  }}
                                ></div>
                              </div>
                              {comment.file && (
                                <a
                                  href={`${
                                    import.meta.env.VITE_SERVER_BASE
                                  }/storage/${comment.file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline text-sm mt-2 inline-block"
                                >
                                  Attached File
                                </a>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs md:text-sm">
                                  {comment.user?.first_name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <div className="text-xs md:text-sm text-gray-500">
                                    answered
                                  </div>
                                  <div className="font-medium text-gray-900 text-sm md:text-base">
                                    {comment.user?.first_name || "Unknown"}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(comment.created_at)}
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
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  Your Answer
                </h3>
                <RichTextEditor
                  value={commentText}
                  onChange={setCommentText}
                  className={
                    "w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  }
                />
                {/* File input for comment attachment */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach file (optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setCommentFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={handlePostComment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Post Answer
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div
              className={`lg:col-span-1 ${
                showSidebar
                  ? "block fixed inset-0 z-50 bg-white p-4 overflow-auto"
                  : "hidden"
              } lg:block`}
            >
              {showSidebar && (
                <div className="flex justify-between items-center mb-4 lg:hidden">
                  <h2 className="text-lg font-bold">Sidebar</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <QuestionDetailsSidebar tags={tagArray} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionDetail;
