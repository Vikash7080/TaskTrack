import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  TriangleAlert,
  CalendarClock,
  Flag,
  ChartNoAxesColumn,
} from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";
import {
  registerUser,
  loginUser,
} from "../services/authService";

/* ------------------------------------------------------------------ */
/*  Product preview (left side, large screens only)                    */
/*  Date + greeting are real (device clock). Tasks are examples.       */
/* ------------------------------------------------------------------ */

const sampleTasks = [
  { title: "Pay electricity bill", due: "Today", priority: "High" },
  { title: "Buy groceries", due: "Today", priority: "Medium" },
  { title: "Plan next week", due: "Tomorrow", priority: "Low" },
  { title: "Book dentist appointment", due: "This week", priority: "Medium" },
];

const priorityStyles = {
  High: "bg-rose-50 text-rose-700 ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-sky-50 text-sky-700 ring-sky-200",
};

const features = [
  { icon: CalendarClock, text: "Set due dates so nothing slips" },
  { icon: Flag, text: "Mark what is high, medium or low priority" },
  { icon: ChartNoAxesColumn, text: "See your progress at a glance" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function ProgressRing({ value }) {
  const size = 48;
  const stroke = 5;
  const r = (size - stroke) / 2;

  return (
    <div className="relative h-12 w-12">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: value }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-slate-700">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

function TodayPreview() {
  const reduceMotion = useReducedMotion();
  const total = sampleTasks.length;

  // step = number of ticked tasks; last step pauses on "all done"
  const [step, setStep] = useState(2);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (total + 2)), 1600);
    return () => clearInterval(id);
  }, [reduceMotion, total]);

  const doneCount = Math.min(step, total);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-medium text-slate-500">{today}</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        {getGreeting()}
      </h2>
      <p className="mt-2 text-[15px] text-slate-500">
        Here is how your day could look in TaskTrack.
      </p>

      <div className="mt-7 rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_32px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Today's tasks</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {doneCount} of {total} completed
            </p>
          </div>
          <ProgressRing value={doneCount / total} />
        </div>

        <ul className="mt-4 divide-y divide-slate-100">
          {sampleTasks.map((task, i) => {
            const done = i < doneCount;

            return (
              <li key={task.title} className="flex items-center gap-3 py-3">
                <motion.span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                  animate={{
                    backgroundColor: done ? "#10b981" : "#ffffff",
                    borderColor: done ? "#10b981" : "#cbd5e1",
                    scale: done ? [1, 1.18, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
                    <motion.path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      stroke="#fff"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: done ? 1 : 0 }}
                      transition={{ duration: 0.25, delay: done ? 0.1 : 0 }}
                    />
                  </svg>
                </motion.span>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium transition-colors duration-300 ${
                      done ? "text-slate-400 line-through" : "text-slate-800"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">Due {task.due.toLowerCase()}</p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${priorityStyles[task.priority]}`}
                >
                  {task.priority}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="mt-8 space-y-3">
        {features.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-slate-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-slate-200">
              <Icon size={16} />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 shadow-sm placeholder-slate-400 outline-none transition hover:border-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
        <Check size={20} strokeWidth={3} />
      </span>
      <span className="text-xl font-bold tracking-tight text-slate-900">
        TaskTrack
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth page                                                          */
/* ------------------------------------------------------------------ */

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI-only state
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await loginUser({
          email,
          password,
        });

        toast.success("Login successful");

        onLogin(response.data.user);
      } else {
        await registerUser({
          name,
          email,
          password,
        });

        toast.success("Registration successful");

        setIsLogin(true);
        setName("");
        setPassword("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="grid min-h-screen bg-white lg:grid-cols-2"
      style={{ fontFamily: "'Plus Jakarta Sans Variable', system-ui, sans-serif" }}
    >
      {/* ---------- Left: brand + preview ---------- */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-200 bg-slate-50 p-12 lg:flex xl:p-16"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(100,116,139,0.18) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative flex justify-center">
          <TodayPreview />
        </div>

        <p className="relative text-xs text-slate-400">
          © {new Date().getFullYear()} TaskTrack
        </p>
      </aside>

      {/* ---------- Right: form ---------- */}
      <main className="flex flex-col px-5 py-8 sm:px-10">
        {/* Mobile logo */}
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-900">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-2 text-[15px] text-slate-500">
                  {isLogin
                    ? "Log in to see your tasks and pick up where you left off."
                    : "Sign up to start planning your tasks in one place."}
                </p>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {/* padding keeps the focus ring from being clipped */}
                    <div className="-mx-1 px-1 pb-1">
                      <label htmlFor="name" className={labelClass}>
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        autoFocus
                        className={inputClass}
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                    onBlur={() => setCapsOn(false)}
                    placeholder="Enter your password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className={`${inputClass} pr-11`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {capsOn && (
                    <motion.p
                      key="caps"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-1.5 overflow-hidden pt-2 text-xs text-amber-700"
                      role="status"
                    >
                      <TriangleAlert size={14} />
                      Caps Lock is on
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={isSubmitting ? undefined : { scale: 0.985 }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-[15px] font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {isSubmitting
                  ? isLogin
                    ? "Logging in…"
                    : "Creating account…"
                  : isLogin
                  ? "Log in"
                  : "Create account"}
              </motion.button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              {isLogin ? "New to TaskTrack?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline focus:outline-none focus-visible:underline"
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Auth;