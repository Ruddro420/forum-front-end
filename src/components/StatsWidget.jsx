import { Award, Eye, MessageSquare, Users } from "lucide-react";
import { useAuth } from "../Auth/context/AuthContext";

const StatsWidget = () => {
  const { stats } = useAuth();

  const statsData = [
    {
      label: "Total Posts",
      value: stats?.total_posts ?? 0,
      change: "+234",
      changeType: "increase",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Users",
      value: stats?.total_users ?? 0,
      change: "+156",
      changeType: "increase",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total Views",
      value: stats?.total_views ?? 0,
      change: "+12%",
      changeType: "increase",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Total Comments",
      value: stats?.total_comments ?? 0,
      change: "+45",
      changeType: "increase",
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 ">
      <h3 className="text-lg font-semibold text-gray-900  mb-6 text-center">
        Community Stats
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor} mb-2`}
              >
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 ">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600  mb-1">
                {stat.label}
              </div>
              {/* <div className="text-xs text-green-600 font-medium">
                {stat.change} this week
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsWidget;
