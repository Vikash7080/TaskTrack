import {
  FiClipboard,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
function StatsCards({
  totalTasks,
  activeTasks,
  completedTasks,
}) {
 return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    
    <div className="bg-white rounded-2xl shadow-sm p-6 border">
      <FiClipboard className="text-blue-600 text-2xl mb-3" />
      <p className="text-4xl font-bold">
        {totalTasks}
      </p>
      <p className="text-slate-500 mt-1">
        Total Tasks
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-sm p-6 border">
      <FiClock className="text-orange-500 text-2xl mb-3" />
      <p className="text-4xl font-bold">
        {activeTasks}
      </p>
      <p className="text-slate-500 mt-1">
        Active Tasks
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-sm p-6 border">
      <FiCheckCircle className="text-green-600 text-2xl mb-3" />
      <p className="text-4xl font-bold">
        {completedTasks}
      </p>
      <p className="text-slate-500 mt-1">
        Completed Tasks
      </p>
    </div>

  </div>
);
}

export default StatsCards;