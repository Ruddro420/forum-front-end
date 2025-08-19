/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Award,
  MessageSquare,
  Eye,
  Star,
  Edit,
  Settings,
  Mail,
  Github,
  Twitter,
  ChevronLeft,
  Menu,
  LogOut,
  FileText
} from "lucide-react";
import { useAuth } from "../Auth/context/AuthContext";
import { Link, NavLink, useNavigate } from "react-router";
import Loader from "../components/Loader";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const { user, logout } = useAuth();
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navigate = useNavigate();

  // load statistics data
  const fetchTotalData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/posts/student/${user?.id}`
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setRecentQuestions(data.data);
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTotalData();
  }, [user?.id]);

  const tabs = [
    { id: "questions", label: "Questions", count: recentQuestions.length },
    { id: "tags", label: "Subjects" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto px-4 py-4 md:py-8">
      {/* Mobile Header */}
      <div className="flex items-center mb-4 md:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 mr-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 truncate flex-1">
          Profile
        </h1>
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
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
              Users
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-900 truncate max-w-xs">{user?.first_name}</li>
        </ol>
      </nav>

      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-4xl font-bold mb-4">
              {user?.first_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="flex gap-2 mb-4 md:hidden">
              <button 
                onClick={() => navigate("/forum/cv")}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                CV
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-start justify-between mb-4">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-2 break-all">{user?.email}</p>
              </div>
              
              {/* Desktop Action Buttons */}
              <div className="hidden md:flex gap-2">
                <button 
                  onClick={() => navigate("/forum/cv")}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-5 w-5 mr-1" />
                  Generate CV
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
              <div className="text-center border p-3 md:p-5 shadow-sm rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  {recentQuestions.length}
                </div>
                <div className="text-xs md:text-sm text-gray-500">Questions</div>
              </div>
              <div className="text-center border p-3 md:p-5 shadow-sm rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  {recentQuestions.filter((post) => post.status == 0).length}
                </div>
                <div className="text-xs md:text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6 md:mb-8">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex px-4 md:px-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 md:px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8">
          {activeTab === "questions" && (
            <div className="">
              <div className="flex flex-col gap-4 md:gap-6">
                {!loading ? (
                  recentQuestions.length > 0 ? (
                    recentQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="border border-gray-200 rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Link
                            to={`/forum/question-detail/${question.id}`}
                            className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 flex-1 mr-2"
                          >
                            {question.title}
                          </Link>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              question.status === "answered"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {question.status}
                          </span>
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 mb-1">
                          <span>Class: {question.category?.name}</span>
                          {question.sub_category && (
                            <>
                              {" | "}
                              <span>Group: {question.sub_category?.name}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500 mb-1">
                          <span>
                            Date:{" "}
                            {new Date(question.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {question.tag && (
                          <div className="mt-2 text-xs text-blue-600">
                            Subjects: {question.tag}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No questions found.</p>
                  )
                ) : (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "tags" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Used Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentQuestions.length > 0 ? (
                  Object.entries(
                    recentQuestions.reduce((acc, question) => {
                      if (question.tag) {
                        const tags = question.tag
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(tag => tag !== "");
                        tags.forEach((tag) => {
                          acc[tag] = (acc[tag] || 0) + 1;
                        });
                      }
                      return acc;
                    }, {})
                  ).map(([tag, count]) => (
                    <Link
                      to={`/forum/?tag=${tag}`}
                      key={tag}
                      className={`inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-blue-200 transition-colors`}
                    >
                      {tag} {count > 1 && `(${count})`}
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg p-4 w-48" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => { navigate("/forum/cv"); setShowMobileMenu(false); }}
              className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md mb-2"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate CV
            </button>
            <button 
              onClick={() => { handleLogout(); setShowMobileMenu(false); }}
              className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;