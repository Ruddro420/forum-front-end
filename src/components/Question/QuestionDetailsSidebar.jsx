import { HelpCircle } from 'lucide-react';
import { useAuth } from '../../Auth/context/AuthContext';
import { Link } from 'react-router';
// tags: array of current post tags, allPosts: array of all posts
const QuestionDetailsSidebar = ({ tags}) => {

    const {userPost} = useAuth();

    console.log("Tags in sidebar:", tags);
    // Filter similar questions by tags
    const similarQuestions = userPost?.filter(q => {
        if (!q.tag) return false;
        const qTags = q.tag.split(',').map(t => t.trim());
        return qTags.some(tag => tags.includes(tag));
    });
    return (
        <div>
            <div className="space-y-6">
                {/* Tips */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                        How to give a good answer
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Make your answer specific and descriptive
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Include relevant code examples
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Explain your reasoning clearly
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Use proper formatting for readability
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Be respectful and constructive in your feedback
                        </li>
                    </ul>
                </div>

                {/* Similar Questions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Similar Questions
                    </h3>
                    <div className="space-y-3">
                        {similarQuestions?.length > 0 ? (
                            similarQuestions.slice(0, 10).map((q, idx) => (
                                <Link
                                    key={q.id || idx}
                                    to={`/forum/question-detail/${q.id}`}
                                    className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    {q.title}
                                </Link>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">No similar questions found.</span>
                        )}
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Community Guidelines
                    </h3>
                    <p className="text-sm text-yellow-700">
                        Please follow our community guidelines to ensure a respectful and constructive environment for everyone.
                        Be kind, stay on topic, and help each other out.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetailsSidebar;