import { motion } from "framer-motion";
import {
  Check,
  Star,
  Pencil,
  Trash2,
  CalendarDays,
  Clock3,
  TriangleAlert,
} from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";

/* ---------- helpers ---------- */

// Reads YYYY-MM-DD as a LOCAL calendar date.
// This avoids the UTC shift caused by new Date("YYYY-MM-DD").
function parseDueDate(value) {
  if (!value) return null;

  const [y, m, d] = String(value)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!y || !m || !d) return null;

  return new Date(y, m - 1, d);
}

function formatDueTime(value) {
  if (!value) return "";

  const [hoursString, minutesString] = String(value).split(":");

  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "";
  }

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")} ${period}`;
}

const DAY_MS = 1000 * 60 * 60 * 24;

function IconButton({
  label,
  onClick,
  className = "",
  children,
  pressed,
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
    >
      {children}
    </motion.button>
  );
}

function TaskItem({
  task,
  handleToggle,
  handleImportant,
  handleEdit,
  handleDelete,
}) {
  /* ---------- dates ---------- */

  const due = parseDueDate(task.dueDate);

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const daysFromToday = due
    ? Math.round((due - todayStart) / DAY_MS)
    : null;

  const isOverdue =
    !task.completed &&
    daysFromToday !== null &&
    daysFromToday < 0;

  const daysOverdue = isOverdue ? -daysFromToday : 0;

  /* ---------- date label ---------- */

  let dueLabel = "";
  let dueTone = "slate";

  if (due) {
    const dateText = due.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (isOverdue) {
      dueLabel = `${daysOverdue} day${
        daysOverdue > 1 ? "s" : ""
      } overdue · ${dateText}`;

      dueTone = "rose";
    } else if (daysFromToday === 0) {
      dueLabel = `Due today · ${dateText}`;
      dueTone = task.completed ? "slate" : "emerald";
    } else if (daysFromToday === 1) {
      dueLabel = `Due tomorrow · ${dateText}`;
      dueTone = task.completed ? "slate" : "emerald";
    } else {
      dueLabel = `Due ${dateText}`;
      dueTone = task.completed ? "slate" : "slate";
    }
  }

  const dueTime = formatDueTime(task.dueTime);

  /* ---------- styles ---------- */

  const toneClasses = {
    slate:
      "bg-slate-50 text-slate-600 ring-slate-200",

    emerald:
      "bg-emerald-50 text-emerald-600 ring-emerald-200",

    rose:
      "bg-rose-50 text-rose-700 ring-rose-200",
  };

  const accent = isOverdue
    ? "bg-rose-500"
    : task.completed
    ? "bg-emerald-400"
    : task.important
    ? "bg-amber-400"
    : "bg-slate-300";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      style={{
        fontFamily:
          "'Plus Jakarta Sans Variable', system-ui, sans-serif",
      }}
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] ring-1 transition-shadow duration-200 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.22)] ${
        isOverdue
          ? "ring-rose-200"
          : "ring-slate-200"
      }`}
    >
      {/* Status accent */}
      <span
        className={`absolute inset-y-0 left-0 w-1 ${accent}`}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3 py-4 pl-5 pr-3 sm:gap-4 sm:py-5 sm:pl-6 sm:pr-4">
        {/* Complete toggle */}
        <button
          type="button"
          onClick={() => handleToggle(task._id)}
          aria-pressed={!!task.completed}
          aria-label={
            task.completed
              ? "Mark as not completed"
              : "Mark as completed"
          }
          title={
            task.completed
              ? "Mark as not completed"
              : "Mark as completed"
          }
          className="mt-0.5 shrink-0 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20"
        >
          <motion.span
            className="flex h-6 w-6 items-center justify-center rounded-full border-2"
            animate={{
              backgroundColor: task.completed
                ? "#34d399"
                : "#ffffff",

              borderColor: task.completed
                ? "#34d399"
                : "#cbd5e1",

              scale: task.completed
                ? [1, 1.18, 1]
                : 1,
            }}
            whileHover={{
              borderColor: task.completed
                ? "#34d399"
                : "#6ee7b7",
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <Check
              size={14}
              strokeWidth={3.5}
              className={`text-white transition-opacity duration-150 ${
                task.completed
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
          </motion.span>
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h3
              className={`break-words text-base font-semibold leading-snug transition-colors duration-300 ${
                task.completed
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
              }`}
            >
              {task.title}
            </h3>

            {task.important && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                <Star
                  size={11}
                  fill="currentColor"
                />
                Important
              </span>
            )}

            {task.completed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 ring-1 ring-inset ring-emerald-200">
                <Check
                  size={11}
                  strokeWidth={3}
                />
                Completed
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1.5 max-w-2xl break-words text-sm leading-relaxed ${
                task.completed
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Date + Time */}
          {due && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  toneClasses[dueTone]
                }`}
              >
                {isOverdue ? (
                  <TriangleAlert size={13} />
                ) : (
                  <CalendarDays size={13} />
                )}

                {dueLabel}
              </span>

              {dueTime && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 ring-1 ring-inset ring-emerald-200">
                  <Clock3 size={13} />
                  {dueTime}
                </span>
              )}
            </div>
          )}

          {/* Time without date */}
          {!due && dueTime && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 ring-1 ring-inset ring-emerald-200">
                <Clock3 size={13} />
                {dueTime}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton
            label={
              task.important
                ? "Remove important mark"
                : "Mark as important"
            }
            onClick={() =>
              handleImportant(task._id)
            }
            pressed={!!task.important}
            className={
              task.important
                ? "text-amber-500 hover:bg-amber-50"
                : "hover:bg-slate-100 hover:text-amber-500"
            }
          >
            <Star
              size={17}
              fill={
                task.important
                  ? "currentColor"
                  : "none"
              }
            />
          </IconButton>

          <IconButton
            label="Edit task"
            onClick={() => handleEdit(task)}
            className="hover:bg-slate-100 hover:text-slate-800"
          >
            <Pencil size={17} />
          </IconButton>

          <IconButton
            label="Delete task"
            onClick={() =>
              handleDelete(task._id)
            }
            className="hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={17} />
          </IconButton>
        </div>
      </div>
    </motion.article>
  );
}

export default TaskItem;