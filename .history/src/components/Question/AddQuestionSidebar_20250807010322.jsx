import { HelpCircle } from 'lucide-react';
import React from 'react';
import { useAuth } from '../../Auth/context/AuthContext';

const AddQuestionSidebar = () => {
    // get user and all users data
    return (
        <div>
            <div className="space-y-6">
                {/* Tips */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                        How to ask a good question
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Make your title specific and descriptive
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Include relevant code examples
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Explain what you've already tried
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Use proper tags to categorize your question
                        </li>
                        <li className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            Be respectful and patient
                        </li>
                    </ul>
                </div>

                {/* Similar Questions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Similar Questions
                    </h3>
                    <div className="space-y-3">
                        {[
                            "React Error Boundaries best practices",
                            "TypeScript error handling patterns",
                            "Async error handling in React hooks",
                        ].map((question, index) => (
                            <a
                                key={index}
                                href="#"
                                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {question}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Community Guidelines */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Community Guidelines
                    </h3>
                    <p className="text-sm text-yellow-700">
                        Please ensure your question follows our community guidelines. Be
                        respectful, provide context, and help others learn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionSidebar;