import React from 'react';
import { MessageSquare, Award, TrendingUp, Users, Clock, UserCircle } from 'lucide-react';
import { useAuth } from '../Auth/context/AuthContext';
import { format } from 'timeago.js';
import { NavLink } from 'react-router';

const ActivityFeed = () => {
  const { recentPost } = useAuth()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 ">
          Recent Activity
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 ">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {recentPost?.map((post) => (
          <div key={post.id} className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 ">
              <MessageSquare className="h-4 w-4 text-blue-600 " />
            </div>
            <NavLink to={`/question-detail/${post.id}`} className="flex-1 min-w-0 cursor-pointer">
              <p className="text-sm text-gray-900  font-medium">
                {post.title}
              </p>
              <p className="text-xs text-gray-500 ">
                
                <span className="font-bold text-green-900 mr-2">
                  {post.category?.name || "N/A"} 
                </span>
                || 
                <span className="font-bold text-orange-900 ml-2">
                   {post.sub_category?.name || "N/A"}
                </span>
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <UserCircle className="h-3 w-3 mr-1" />
                <span>{post.student?.name || "Admin"}</span>
                <span className="mx-1">•</span>
                <Clock className="h-3 w-3 mr-1" />
                {/* <span>{moment(post.created_at).fromNow()}</span> */}
                <span>{format(post.created_at)}</span>
              </div>
            </NavLink>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700  font-medium">
          Load more activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
