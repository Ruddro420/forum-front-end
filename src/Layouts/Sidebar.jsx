import { BookOpen, Clock, Home, Star, Tag, TrendingUp, Users } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../Auth/context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { fetauredTag } = useAuth();

  const navigationItems = [
    { icon: Home, label: 'Questions', count: null, url: "/" },
    // { icon: TrendingUp, label: 'Trending', count: null, url: "#" },
    { icon: BookOpen, label: 'Book Shop', count: '2.4k', url: "/shop" },
    // { icon: Users, label: 'Users', count: '890', url: "#" },
    // { icon: Tag, label: 'Tags', count: null, url: "#" },
  ];

  // Convert fetauredTag object to array and limit to 9
  const tagColors = [
    'bg-yellow-100 text-yellow-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
  ];

  const featuredTags = fetauredTag
    ? Object.entries(fetauredTag)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        count,
        color: tagColors[index % tagColors.length], // loop through colors
      }))
    : [];


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col lg:min-h-[90vh] pt-4 lg:pt-6">
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={index}
                  to={item.url}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${isActive
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.count && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Popular Tags */}
          <div className="px-4 py-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Popular Tags
            </h3>
            <div className="space-y-2">
              {featuredTags.length > 0 ? (
                featuredTags.map((tag, index) => (
                  <div key={index}>
                    <Link
                      to={`/?tag=${tag.name}`}
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors`}>
                      <span

                        className={`px-2 py-1 rounded text-xs font-medium ${tag.color}`}
                      >
                        {tag.name?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{tag.count}</span>
                    </ Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No tags found.</p>
              )}
            </div>
          </div>


          {/* Quick Stats */}
          {/* <div className="px-4 py-6 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Reputation</span>
                </div>
                <span className="text-sm font-medium text-gray-900">2,547</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">This Week</span>
                </div>
                <span className="text-sm font-medium text-gray-900">+127</span>
              </div>
            </div>
          </div> */}
        </div>
      </aside >
    </>
  );
};

export default Sidebar;
