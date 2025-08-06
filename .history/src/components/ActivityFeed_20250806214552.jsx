import React from 'react';
import { MessageSquare, Award, TrendingUp, Users, Clock, UserCircle } from 'lucide-react';
import { useAuth } from '../Auth/context/AuthContext';
import { format } from 'timeago.js';

const ActivityFeed = () => {
  const { recentPost } = useAuth()
  const activities = [
    {
      id: 1,
      type: 'question',
      icon: MessageSquare,
      title: 'New question about React hooks',
      user: 'Sarah Chen',
      time: '2 minutes ago',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      type: 'bounty',
      icon: Award,
      title: 'Bounty awarded for Node.js optimization',
      user: 'Michael Rodriguez',
      time: '15 minutes ago',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: 3,
      type: 'trending',
      icon: TrendingUp,
      title: 'CSS Grid question trending',
      user: 'Emma Thompson',
      time: '1 hour ago',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 4,
      type: 'user',
      icon: Users,
      title: 'New user joined the community',
      user: 'Alex Johnson',
      time: '2 hours ago',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 ">
          Recent Activity
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {recentPost?.map((post) => (
          <div key={post.id} className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 ">
              <MessageSquare className="h-4 w-4 text-blue-600 " />
            </div>
            <div className="flex-1 min-w-0">
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
              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <UserCircle className="h-3 w-3 mr-1" />
                <span>{post.student?.name || "Admin"}</span>
                <span className="mx-1">•</span>
                <Clock className="h-3 w-3 mr-1" />
                {/* <span>{moment(post.created_at).fromNow()}</span> */}
                <span>{format(post.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          Load more activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
