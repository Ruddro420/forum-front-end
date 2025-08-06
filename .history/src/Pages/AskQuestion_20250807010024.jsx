import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Adjust path as needed
import AddQuestionSidebar from "../components/Question/AddQuestionSidebar";
import { Plus, X, HelpCircle, BookOpen, Code, AlertCircle } from "lucide-react";

const AskQuestion = () => {
  const { user } = useAuth(); // 👈 Get user from context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || tags.length === 0) {
      alert("Please fill all required fields and add at least one tag.");
      return;
    }

    const data = {
      title,
      content,
      tags: tags.join(","), // You can store tags as comma-separated string or array
      category_id: user?.category_id,
      sub_category_id: user?.sub_category_id,
      student_id: user?.id,
    };

    try {
      setLoading(true);
      await axios.post("http://192.168.1.104:8000/api/posts", data, {
        withCredentials: true,
      });
      alert("Question posted successfully!");
      // Reset form
      setTitle("");
      setContent("");
      setTags([]);
    } catch (error) {
      console.error("Post submission failed:", error);
      alert("Failed to post the question. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      {/* ...breadcrumb and other UI remains unchanged */}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Form Fields (Title, Content, Tags) stay same */}

        {/* Submit */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </form>

      {/* Sidebar */}
      <AddQuestionSidebar />
    </div>
  );
};

export default AskQuestion;
