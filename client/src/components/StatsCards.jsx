import { useEffect } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ClipboardList, Clock, CircleCheck } from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";

/* Counts up to the value when it changes (instant if reduced motion) */
function AnimatedNumber({ value }) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(reduceMotion ? value : 0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (reduceMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.7,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, reduceMotion, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

function StatsCards({ totalTasks, activeTasks, completedTasks }) {
  const completedPercent = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // derived from the completed % so the two always add up to exactly 100
  const activePercent = totalTasks ? 100 - completedPercent : 0;

  const cards = [
    {
      key: "total",
      label: "Total tasks",
      value: totalTasks,
      icon: ClipboardList,
      iconStyle: "bg-slate-100 text-slate-700 ring-slate-200",
      sub: totalTasks ? "Across your whole list" : "No tasks yet",
      subStyle: "text-slate-500",
      // split bar: completed + active
      bar: [
        { width: completedPercent, color: "bg-emerald-500" },
        { width: activePercent, color: "bg-sky-400" },
      ],
    },
    {
      key: "active",
      label: "Active tasks",
      value: activeTasks,
      icon: Clock,
      iconStyle: "bg-sky-50 text-sky-600 ring-sky-200",
      sub: `${activePercent}% of total`,
      subStyle: "text-sky-700",
      bar: [{ width: activePercent, color: "bg-sky-400" }],
    },
    {
      key: "completed",
      label: "Completed tasks",
      value: completedTasks,
      icon: CircleCheck,
      iconStyle: "bg-emerald-50 text-emerald-600 ring-emerald-200",
      sub: `${completedPercent}% completion`,
      subStyle: "text-emerald-700",
      bar: [{ width: completedPercent, color: "bg-emerald-500" }],
    },
  ];

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      style={{ fontFamily: "'Plus Jakarta Sans Variable', system-ui, sans-serif" }}
    >
      {cards.map(({ key, label, value, icon: Icon, iconStyle, sub, subStyle, bar }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
          className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] ring-1 ring-slate-200"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${iconStyle}`}
            >
              <Icon size={18} />
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold leading-none tracking-tight text-slate-900 tabular-nums">
            <AnimatedNumber value={value} />
          </p>

          <div className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            {bar.map((segment, idx) => (
              <motion.div
                key={idx}
                className={`h-full ${segment.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${segment.width}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
              />
            ))}
          </div>

          <p className={`mt-2.5 text-xs font-medium ${subStyle}`}>{sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsCards;