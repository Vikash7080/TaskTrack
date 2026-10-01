import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardPlus,
  Pencil,
  CalendarDays,
  Clock3,
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";

/* ---------- helpers ---------- */

function toLocalISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);

  return toLocalISODate(d);
}

function parseISODate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function formatDate(value) {
  const date = parseISODate(value);

  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "";

  const [hours, minutes] = value.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
}

function getTimeParts(value) {
  if (!value) {
    return {
      hour: "09",
      minute: "00",
      period: "AM",
    };
  }

  const [hoursString, minutesString] = value.split(":");

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
    return {
      hour: "09",
      minute: "00",
      period: "AM",
    };
  }

  return {
    hour: String(hours % 12 || 12).padStart(2, "0"),
    minute: String(minutes).padStart(2, "0"),
    period: hours >= 12 ? "PM" : "AM",
  };
}

function to24Hour(hour, minute, period) {
  let hours = Number(hour);

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  return `${String(hours).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
}

function Counter({ value, max }) {
  const nearLimit = value >= max * 0.9;

  return (
    <span
      className={`text-xs tabular-nums transition-colors ${
        nearLimit ? "font-medium text-amber-600" : "text-slate-400"
      }`}
    >
      {value}/{max}
    </span>
  );
}

/* ---------- Calendar Picker ---------- */

function CalendarPicker({ value, minDate, onChange, onClose }) {
  const initialDate =
    parseISODate(value) || parseISODate(minDate) || new Date();

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  const selectedDate = parseISODate(value);
  const minimumDate = parseISODate(minDate);

  const sameDay = (a, b) => {
    if (!a || !b) return false;

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const isBeforeMinimum = (date) => {
    if (!date || !minimumDate) return false;

    const current = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const minimum = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      minimumDate.getDate()
    );

    return current < minimum;
  };

  const previousMonth = new Date(year, month - 1, 1);

  const minimumMonth = new Date(
    minimumDate.getFullYear(),
    minimumDate.getMonth(),
    1
  );

  const previousDisabled = previousMonth < minimumMonth;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 top-[calc(100%+8px)] z-[60] w-[276px] overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold tracking-tight text-slate-900">
            {monthName}
          </p>

          <button
            type="button"
            onClick={() => {
              const today = parseISODate(minDate);

              setVisibleMonth(
                new Date(today.getFullYear(), today.getMonth(), 1)
              );

              onChange(minDate);
              onClose();
            }}
            className="mt-0.5 text-[11px] font-medium text-emerald-500 transition hover:text-emerald-600"
          >
            Jump to today
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={previousDisabled}
            onClick={() =>
              setVisibleMonth(new Date(year, month - 1, 1))
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() =>
              setVisibleMonth(new Date(year, month + 1, 1))
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="mb-1.5 grid grid-cols-7">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={`${day}-${index}`}
            className="flex h-7 items-center justify-center text-[10px] font-semibold text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-8" />;
          }

          const disabled = isBeforeMinimum(date);
          const selected = sameDay(date, selectedDate);
          const today = sameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange(toLocalISODate(date));
                onClose();
              }}
              className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                selected
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                  : disabled
                  ? "cursor-not-allowed text-slate-300"
                  : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              {date.getDate()}

              {today && !selected && !disabled && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-slate-100 pt-2.5">
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClose();
          }}
          className="text-[11px] font-medium text-slate-400 transition hover:text-slate-600"
        >
          Clear date
        </button>
      </div>
    </motion.div>
  );
}

/* ---------- Time Picker ---------- */

function TimePicker({ value, onChange, onClose }) {
  const initial = getTimeParts(value);

  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState(initial.period);

  const hours = Array.from({ length: 12 }, (_, index) =>
    String(index + 1).padStart(2, "0")
  );

  const minutes = Array.from({ length: 12 }, (_, index) =>
    String(index * 5).padStart(2, "0")
  );

  const updateTime = (newHour, newMinute, newPeriod) => {
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);

    onChange(to24Hour(newHour, newMinute, newPeriod));
  };

  const currentTime = to24Hour(hour, minute, period);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[276px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]"
    >
      <div className="border-b border-slate-100 px-3 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Set due time
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Choose a time for this task
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 ring-1 ring-emerald-100">
            <Clock3 size={15} />
          </div>
        </div>
      </div>

      <div className="flex justify-center px-3 py-3">
        <div className="rounded-lg bg-emerald-50 px-4 py-2 text-lg font-bold tracking-wide text-emerald-600 ring-1 ring-emerald-100">
          {formatTime(currentTime)}
        </div>
      </div>

      <div className="grid grid-cols-3 border-y border-slate-100">
        <div className="border-r border-slate-100 p-2">
          <p className="mb-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Hour
          </p>

          <div className="max-h-28 overflow-y-auto pr-1">
            {hours.map((item) => {
              const active = hour === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateTime(item, minute, period)}
                  className={`mb-1 w-full rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-r border-slate-100 p-2">
          <p className="mb-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Minute
          </p>

          <div className="max-h-28 overflow-y-auto pr-1">
            {minutes.map((item) => {
              const active = minute === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateTime(hour, item, period)}
                  className={`mb-1 w-full rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-2">
          <p className="mb-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Period
          </p>

          {["AM", "PM"].map((item) => {
            const active = period === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => updateTime(hour, minute, item)}
                className={`mb-1 w-full rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2.5">
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClose();
          }}
          className="text-[11px] font-medium text-slate-400 transition hover:text-slate-600"
        >
          Clear time
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
}

/* ---------- Main Form ---------- */

function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  editingId,
  setEditingId,
  handleSubmit,
}) {
  const today = toLocalISODate(new Date());

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const calendarRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setCalendarOpen(false);
      }

      if (
        timeRef.current &&
        !timeRef.current.contains(event.target)
      ) {
        setTimeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setEditingId(null);
  };

  const quickDates = [
    { label: "Today", value: today },
    { label: "Tomorrow", value: addDays(1) },
    { label: "Next week", value: addDays(7) },
  ];

  const HeaderIcon = editingId ? Pencil : ClipboardPlus;

  const selectedDateLabel = useMemo(
    () => (dueDate ? formatDate(dueDate) : "Select date"),
    [dueDate]
  );

  const selectedTimeLabel = useMemo(
    () => (dueTime ? formatTime(dueTime) : "Select time"),
    [dueTime]
  );

  return (
    <motion.section
      className="mb-8 rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_32px_-16px_rgba(15,23,42,0.18)] ring-1 ring-slate-200 sm:p-8"
      style={{
        fontFamily: "'Plus Jakarta Sans Variable', system-ui, sans-serif",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-7 flex items-center gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors duration-300 ${
            editingId
              ? "bg-amber-50 text-amber-600 ring-amber-200"
              : "bg-emerald-50 text-emerald-500 ring-emerald-200"
          }`}
        >
          <HeaderIcon size={21} />
        </span>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={editingId ? "edit" : "create"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="min-w-0"
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {editingId ? "Edit task" : "Create a new task"}
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {editingId
                ? "Update the details, then save your changes."
                : "Write it down now so you can focus on it later."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="task-title" className={labelClass}>
            Task title <span className="text-rose-500">*</span>
          </label>

          <input
            id="task-title"
            type="text"
            placeholder="e.g. Pay electricity bill"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
            className={`${inputClass} h-11`}
          />

          <div className="mt-1.5 text-right">
            <Counter value={title.length} max={100} />
          </div>
        </div>

        <div>
          <label htmlFor="task-description" className={labelClass}>
            Description
          </label>

          <textarea
            id="task-description"
            placeholder="Add any details you want to remember"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            maxLength={300}
            className={`${inputClass} resize-none py-3 leading-relaxed`}
          />

          <div className="mt-1.5 text-right">
            <Counter value={description.length} max={300} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Due Date */}

          <div ref={calendarRef} className="relative">
            <label className={labelClass}>
              Due date <span className="text-rose-500">*</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setCalendarOpen((prev) => !prev);
                setTimeOpen(false);
              }}
              className={`group flex h-11 w-full items-center gap-3 rounded-lg border bg-white px-3.5 text-left shadow-sm outline-none transition ${
                calendarOpen
                  ? "border-emerald-500 ring-4 ring-emerald-500/10"
                  : "border-slate-300 hover:border-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              }`}
            >
              <CalendarDays
                size={18}
                className={`shrink-0 ${
                  calendarOpen
                    ? "text-emerald-500"
                    : "text-slate-400 group-hover:text-emerald-500"
                }`}
              />

              <span
                className={`flex-1 text-[15px] ${
                  dueDate ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {selectedDateLabel}
              </span>

              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${
                  calendarOpen ? "rotate-180 text-emerald-500" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {calendarOpen && (
                <CalendarPicker
                  value={dueDate}
                  minDate={today}
                  onChange={setDueDate}
                  onClose={() => setCalendarOpen(false)}
                />
              )}
            </AnimatePresence>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {quickDates.map(({ label, value }) => {
                const active = dueDate === value;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDueDate(value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition ${
                      active
                        ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                        : "bg-white text-slate-600 ring-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              <AnimatePresence initial={false}>
                {dueDate && (
                  <motion.button
                    type="button"
                    onClick={() => setDueDate("")}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={12} />
                    Clear
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Due Time */}

          <div ref={timeRef} className="relative">
            <label className={labelClass}>Due time</label>

            <button
              type="button"
              onClick={() => {
                setTimeOpen((prev) => !prev);
                setCalendarOpen(false);
              }}
              className={`group flex h-11 w-full items-center gap-3 rounded-lg border bg-white px-3.5 text-left shadow-sm outline-none transition ${
                timeOpen
                  ? "border-emerald-500 ring-4 ring-emerald-500/10"
                  : "border-slate-300 hover:border-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              }`}
            >
              <Clock3
                size={18}
                className={`shrink-0 ${
                  timeOpen
                    ? "text-emerald-500"
                    : "text-slate-400 group-hover:text-emerald-500"
                }`}
              />

              <span
                className={`flex-1 text-[15px] ${
                  dueTime ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {selectedTimeLabel}
              </span>

              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${
                  timeOpen ? "rotate-180 text-emerald-500" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {timeOpen && (
                <TimePicker
                  value={dueTime}
                  onChange={setDueTime}
                  onClose={() => setTimeOpen(false)}
                />
              )}
            </AnimatePresence>

            <p className="mt-2.5 text-xs text-slate-500">
              Set a time to stay on schedule.
            </p>
          </div>
        </div>

        <p className="mt-2.5 text-xs text-slate-500">
          Only today or a future date can be selected.
        </p>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="flex h-11 items-center gap-2 rounded-lg bg-slate-900 px-5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20"
          >
            {editingId ? <Check size={18} /> : <Plus size={18} />}

            {editingId ? "Update task" : "Add task"}
          </motion.button>

          <AnimatePresence initial={false}>
            {editingId && (
              <motion.button
                type="button"
                onClick={handleCancel}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-[15px] font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Cancel
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </motion.section>
  );
}

/* ---------- shared styles ---------- */

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 shadow-sm placeholder-slate-400 outline-none transition hover:border-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export default TaskForm;