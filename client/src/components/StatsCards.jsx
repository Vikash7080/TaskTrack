import { FiClipboard, FiClock, FiCheckCircle } from "react-icons/fi";

function StatsCards({ totalTasks, activeTasks, completedTasks }) {
  const activePercent = totalTasks ? Math.round((activeTasks / totalTasks) * 100) : 0;
  const completedPercent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const cards = [
    {
      icon: <FiClipboard size={18} color="#3b82f6" />,
      iconBg: "bg-blue-50",
      value: totalTasks,
      label: "Total Tasks",
      valueColor: "text-slate-900",
      barColor: "bg-blue-500",
      barWidth: 100,
      badge: "All",
      badgeStyle: "bg-blue-50 text-blue-600",
      subText: "100%",
      subColor: "text-blue-600",
    },
    {
      icon: <FiClock size={18} color="#f97316" />,
      iconBg: "bg-orange-50",
      value: activeTasks,
      label: "Active Tasks",
      valueColor: "text-orange-500",
      barColor: "bg-orange-400",
      barWidth: activePercent,
      badge: "In progress",
      badgeStyle: "bg-orange-50 text-orange-600",
      subText: `${activePercent}% of total`,
      subColor: "text-orange-600",
    },
    {
      icon: <FiCheckCircle size={18} color="#22c55e" />,
      iconBg: "bg-green-50",
      value: completedTasks,
      label: "Completed Tasks",
      valueColor: "text-green-500",
      barColor: "bg-green-500",
      barWidth: completedPercent,
      badge: "Done",
      badgeStyle: "bg-green-50 text-green-600",
      subText: `${completedPercent}% completion`,
      subColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map(({ icon, iconBg, value, label, valueColor, barColor, barWidth, badge, badgeStyle, subText, subColor }) => (
        <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-start justify-between mb-3">
            <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
              {icon}
            </div>
            <span className={`${badgeStyle} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
              {badge}
            </span>
          </div>

          <p className={`text-3xl font-bold ${valueColor} leading-none`}>{value}</p>
          <p className="text-slate-400 text-xs font-medium mt-1">{label}</p>

          <div className="h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full ${barColor} rounded-full transition-all duration-500`}
              style={{ width: `${barWidth}%` }}
            />
          </div>

          {/* Percentage — sharp and bold */}
          <p className={`text-xs font-bold mt-2 ${subColor}`}>{subText}</p>

        </div>
      ))}
    </div>
  );
}

export default StatsCards;