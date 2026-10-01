import { motion } from "framer-motion";
import {
  ListTodo,
  CircleDot,
  CircleCheck,
} from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";

function FilterBar({ filter, setFilter }) {
  const filters = [
    {
      key: "all",
      label: "All",
      icon: ListTodo,
      activeStyle:
        "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      key: "active",
      label: "Active",
      icon: CircleDot,
      activeStyle:
        "bg-orange-50 text-orange-700 ring-orange-200",
    },
    {
      key: "completed",
      label: "Completed",
      icon: CircleCheck,
      activeStyle:
        "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
  ];

  return (
    <div
      className="flex w-full items-center justify-start sm:w-auto sm:justify-end"
      style={{
        fontFamily: "'Plus Jakarta Sans Variable', system-ui, sans-serif",
      }}
    >
      <div
        className="
          inline-flex items-center
          rounded-xl
          border border-slate-200
          bg-slate-50/80
          p-1
          shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        "
      >
        {filters.map(
          ({ key, label, icon: Icon, activeStyle }) => {
            const isActive = filter === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={isActive}
                className="
                  relative
                  flex items-center gap-2
                  rounded-lg
                  px-3.5 py-2
                  text-[12px] font-semibold
                  whitespace-nowrap
                  outline-none
                  transition-colors duration-200
                  focus-visible:ring-2
                  focus-visible:ring-emerald-500/20
                "
              >
                {/* Sliding active background */}
                {isActive && (
                  <motion.span
                    layoutId="task-filter-active"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                      mass: 0.7,
                    }}
                    className={`
                      absolute inset-0
                      rounded-lg
                      ring-1
                      shadow-[0_1px_3px_rgba(15,23,42,0.08)]
                      ${activeStyle}
                    `}
                  />
                )}

                {/* Icon */}
                <Icon
                  size={15}
                  strokeWidth={2.2}
                  className={`
                    relative z-10
                    shrink-0
                    transition-transform duration-200
                    ${
                      isActive
                        ? "scale-105"
                        : "text-slate-400"
                    }
                  `}
                />

                {/* Label */}
                <span
                  className={`
                    relative z-10
                    transition-colors duration-200
                    ${
                      isActive
                        ? "text-current"
                        : "text-slate-500"
                    }
                  `}
                >
                  {label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

export default FilterBar;