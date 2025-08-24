/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Clock,
  Eye,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { format } from "timeago.js";

const QuestionCard = ({ question }) => {
  // get users
  const userId = sessionStorage.getItem("userId");
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const {
    id,
    title,
    details,
    author,
    tag,
    created_at,
    isAnswered,
    category,
    sub_category,
  } = question;

  const tagArray = tag?.split(",") || [];

  const tagColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-yellow-100 text-yellow-800",
    "bg-pink-100 text-pink-800",
  ];

  // redirect forum to answers
  const navigate = useNavigate();

  const answersQuestion = () => {
    navigate(`/forum/question-detail/${id}`);
  };
  // get views
  const [views, setViews] = useState(0);

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

  function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow duration-200 ">
      {/* Mobile Header - Only visible on small screens */}
      <div className="flex justify-between items-start mb-3 md:hidden">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-medium">
            {question?.student ? question?.student.first_name.charAt(0) : "A"}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {question?.student?.first_name || "Admin"}
          </span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          {/* <Bookmark className="h-4 w-4 text-gray-400 hover:text-blue-600" /> */}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Desktop Vode section */}
        <div className="lg:flex md:hidden hidden flex-row md:flex-col items-center justify-between md:justify-start md:space-y-2 md:min-w-0 order-2 lg:order-1">
          <div className="flex items-center md:flex-col">
            <button
              onClick={() => handleVote("upvote")}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowUp className="h-5 w-5 text-gray-400 hover:text-green-600" />
            </button>

            <span className="text-lg font-medium bg-green-200 text-green-600 px-2 py-1 md:p-2 rounded mx-2 md:mx-0 md:my-1">
              {votes.upvotes}
            </span>
          </div>

          <div className="flex items-center md:flex-col">
            <span className="text-lg font-medium bg-red-200 text-red-600 px-2 py-1 md:p-2 rounded mx-2 md:mx-0 md:my-1">
              {votes.downvotes}
            </span>

            <button
              onClick={() => handleVote("downvote")}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowDown className="h-5 w-5 text-gray-400 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Mobile vote section */}
        <div className="flex flex-row md:flex lg:hidden items-center justify-between  md:space-y-2 md:min-w-0 order-2 lg:order-1">
          <div className="flex items-center gap-2">
            <div
            className={`px-3 py-1 lg:py-2 rounded-lg text-center ${
              isAnswered
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <div className="text-base lg:text-lg font-semibold">
              {question.comments?.length > 0 ? question.comments.length : 0} answers
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

        {/* Stats - Horizontal on mobile, vertical on desktop */}
        <div className="lg:flex md:hidden hidden flex-row lg:flex-col items-center justify-around lg:justify-start lg:space-y-3 lg:min-w-0 order-3 lg:order-2 border-t border-b lg:border-0 py-2 my-2 lg:py-0 lg:my-0">
          <div
            className={`px-3 py-1 lg:py-2 rounded-lg text-center ${
              isAnswered
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <div className="text-base lg:text-lg font-semibold">
              {question.comments?.length > 0 ? question.comments.length : 0}
            </div>
            <div className="text-xs">answers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span className="text-xs">{views}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 order-1 lg:order-3">
          {/* Desktop Header - Hidden on mobile */}
          <div className="hidden md:flex items-start justify-between mb-2">
            <h3
              onClick={answersQuestion}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 pr-4"
            >
              {title}
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              {/* <Bookmark className="h-4 w-4 text-gray-400 hover:text-blue-600" /> */}
            </button>
          </div>

          {/* Mobile Title */}
          <h3
            onClick={answersQuestion}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 mb-2 md:mb-0 md:pr-4 md:hidden"
          >
            {title}
          </h3>

          {/* Categories */}
          <div className="mb-2">
            {category && (
              <div className="flex flex-wrap gap-1 mb-2">
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  {category.name}
                </div>
                {sub_category && (
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {sub_category.name}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-2">
            {/* Responsive description: break lines and wrap on md devices */}
            <span className="break-words md:break-normal w-full md:max-w-md lg:max-w-full block">
              {stripHtml(details)}
            </span>
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
            {tagArray.map((tag, index) => (
              <Link
                key={index}
                to={`/forum/?tag=${tag.trim()}`}
                className={`px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                  tagColors[index % tagColors.length]
                }`}
              >
                {tag.trim()}
              </Link>
            ))}
          </div>

          {/* Meta - Desktop version */}
          <div className="hidden md:flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>asked {format(created_at)}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span>
                  {question.comments?.length > 0 ? question.comments.length : 0}{" "}
                  answers
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-medium">
                {question?.student
                  ? question?.student.first_name.charAt(0)
                  : "A"}
              </div>
              <span className="font-medium text-gray-700">
                {question?.student?.first_name || "Admin"}
              </span>
            </div>
          </div>

          {/* Meta - Mobile version */}
          <div className="flex items-center justify-between text-xs text-gray-500 md:hidden">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{format(created_at)}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              <span>
                {question.comments?.length > 0 ? question.comments.length : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
