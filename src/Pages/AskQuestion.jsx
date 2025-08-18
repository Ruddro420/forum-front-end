/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Plus, X, HelpCircle, BookOpen, Code, AlertCircle } from "lucide-react";
import AddQuestionSidebar from "../components/Question/AddQuestionSidebar";
import { useAuth } from "../Auth/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import RichTextEditor from "../components/RichTextEditor";
const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  // get user
  const { user, fetchPost, fetchTotalData, fetchUserPost } = useAuth()

  const addTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      addTag(currentTag.trim());
    }
  };
  // submit data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || tags.length === 0) {
      toast.error("Please fill all required fields and add at least one tag.");
      return;
    }

    const data = {
      title,
      details: content,
      tag: tags.join(","), // You can store tags as comma-separated string or array
      category_id: user?.category_id,
      sub_category_id: user?.sub_category_id,
      student_id: user?.id,
    };

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_SERVER_API}/add/posts`, data, {
        withCredentials: true,
      });
      toast.success("Question posted successfully!");
      // Reset form
      setTitle("");
      setContent("");
      setTags([]);
      fetchPost();
      fetchUserPost();
      fetchTotalData();
    } catch (error) {
      console.error("Post submission failed:", error);
      toast.error("Failed to post the question. Check console for details.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className=" mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <a href="#" className="hover:text-blue-600">
              Home
            </a>
          </li>
          <li>/</li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Questions
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-900">Ask Question</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ask a Question
            </h1>
            <p className="text-gray-600 mb-8">
              Get help from the community by asking a clear, detailed question.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Question Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your programming question? Be specific."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Be specific and imagine you're asking a question to another
                  person.
                </p>
              </div>


              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Question Details *
                </label>

                {/* <ReactQuill theme="snow" value={content} onChange={setContent} /> */}

                <RichTextEditor value={content} onChange={setContent} />


                {/* <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide all the details someone would need to answer your question. Include any code, error messages, or steps you've already tried."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                /> */}

              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects (up to 5)
                </label>

                {/* Current Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag Input */}
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add subjects  (EG: Bangla, English.. then press Enter to add)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={tags.length >= 5}
                />


              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Post Question
                  </button>
                  {/* {loading ? "Posting..." : "Post Question"} */}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <AddQuestionSidebar />
      </div>
    </div>
  );
};

export default AskQuestion;
