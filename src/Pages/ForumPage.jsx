import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import ActivityFeed from "../components/ActivityFeed";
import StatsWidget from "../components/StatsWidget";
import QuestionList from "../components/Question/QuestionList";
import { useAuth } from "../Auth/context/AuthContext";
import Loader from "../components/Loader";

const ForumPage = () => {
  const { posts, fetauredTag, categories, user, userPost } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showposts, setShowposts] = useState(posts);

  const location = useLocation();
  const navigate = useNavigate();

  const filterTag = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tag");
  }, [location.search]);
  const searchItem = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tag");
  }, [location.search]);

  useEffect(() => {
    if (user) {
      setShowposts(userPost);
    } else {
      setShowposts(posts);
    }
  }, [posts, userPost, user]);

  const postsPerPage = 4;

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (selectedCategoryId) {
      return showposts.filter(post => post.category_id === selectedCategoryId);
    }
    if (filterTag) {
      return showposts.filter(
        post =>
          post.tag &&
          post.tag.split(",").map(t => t.trim()).includes(filterTag)
      );
    }
    return showposts;
  }, [showposts, selectedCategoryId, filterTag]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const tags = fetauredTag ? Object.keys(fetauredTag).slice(0, 9) : [];



  return (
    <>

      {!user && (
        <FilterBar
          categories={[{ id: null, name: "All" }, ...(categories || [])]}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={(id) => {
            setSelectedCategoryId(id);
            setCurrentPage(1);
          }}
        />
      )}

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions</h1>
              <p className="text-gray-600">
                Find answers to your programming questions and help others learn.
              </p>
            </div>

            <QuestionList posts={paginatedPosts} />

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium border rounded-lg ${currentPage === page
                    ? "text-white bg-blue-600 border-blue-600"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 mt-[90px]">
            <StatsWidget />
            <ActivityFeed />

            {/* Featured Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Featured Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => {
                        navigate(`/forum/?tag=${tag}`);
                        setSelectedCategoryId(null);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition-colors ${filterTag === tag
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No tags available.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ForumPage;
