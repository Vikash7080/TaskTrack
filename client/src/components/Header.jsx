import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, LogOut } from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";
import { logoutUser } from "../services/authService";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);

  const fullName = user?.name?.trim() || "User";
  const firstName = fullName.split(" ")[0];
  const initial = fullName.charAt(0).toUpperCase() || "U";

  const greeting = getGreeting();

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* ---------------- Scroll ---------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 4);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ---------------- Close Menu ---------------- */

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "border-slate-200 shadow-[0_6px_20px_-12px_rgba(15,23,42,0.25)]"
          : "border-slate-200/70"
      }`}
      style={{
        fontFamily:
          "'Plus Jakarta Sans Variable', system-ui, sans-serif",
      }}
    >
      <div className="mx-auto flex h-[66px] max-w-7xl items-center justify-between px-5 sm:px-7 lg:px-10">

        {/* =====================================================
            LEFT — BRAND
        ====================================================== */}

        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-emerald-500 shadow-[0_4px_12px_-5px_rgba(16,185,129,0.55)]"
          >
            <Check
              size={18}
              strokeWidth={3}
              className="text-white"
            />
          </motion.div>

          <div className="leading-none">
            <h1 className="text-[17px] font-bold tracking-[-0.02em] text-slate-900">
              TaskTrack
            </h1>

            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Productivity
            </p>
          </div>
        </div>

        {/* =====================================================
            CENTER — GREETING
        ====================================================== */}

        <div className="absolute left-1/2 hidden -translate-x-1/2 text-center md:block">

          {/* Greeting */}

          <div className="flex items-center justify-center gap-1.5">

            <span className="text-[12px] font-medium text-slate-500">
              {greeting}
            </span>

            <span className="text-[13px] font-bold text-slate-900">
              {firstName}
            </span>

            {/* Green highlight dot */}
            <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>

          {/* Product message */}

          <p className="mt-1 text-[10px] font-medium tracking-wide text-slate-400">
            Your tasks,
            <span className="mx-1 font-semibold text-emerald-600">
              your progress
            </span>
            <span className="text-slate-300">•</span>
            <span className="ml-1">
              one step at a time
            </span>
          </p>
        </div>

        {/* =====================================================
            RIGHT — ACCOUNT
        ====================================================== */}

        <div
          ref={menuRef}
          className="relative ml-auto"
        >
          {/* Account Slider */}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={`relative flex h-[42px] w-[178px] items-center overflow-hidden rounded-full border bg-white transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/10 ${
              menuOpen
                ? "border-emerald-400 shadow-[0_5px_18px_-10px_rgba(16,185,129,0.5)]"
                : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            {/* ---------------------------------------------
                SLIDING GREEN AVATAR
            ---------------------------------------------- */}

            <motion.div
              className="absolute left-[4px] top-[4px] z-20 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-emerald-500 text-[13px] font-bold text-white shadow-[0_4px_12px_-5px_rgba(16,185,129,0.55)]"
              animate={{
                x: menuOpen ? 138 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 430,
                damping: 30,
              }}
            >
              {initial}
            </motion.div>

            {/* ---------------------------------------------
                USER INFORMATION
            ---------------------------------------------- */}

            <motion.div
              animate={{
                opacity: menuOpen ? 0 : 1,
                x: menuOpen ? -8 : 0,
              }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
              className="ml-[47px] flex min-w-0 flex-col items-start"
            >
              <span className="max-w-[90px] truncate text-[12px] font-bold leading-none text-slate-900">
                {fullName}
              </span>

              <span className="mt-1 text-[9px] font-medium leading-none text-slate-400">
                Account
              </span>
            </motion.div>

            {/* ---------------------------------------------
                CHEVRON
            ---------------------------------------------- */}

            <AnimatePresence>
              {!menuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-3.5"
                >
                  <ChevronDown
                    size={16}
                    strokeWidth={2.5}
                    className="text-slate-500"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* =================================================
              DROPDOWN
          ================================================== */}

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                initial={{
                  opacity: 0,
                  y: -6,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.16,
                  ease: "easeOut",
                }}
                className="absolute right-0 mt-2.5 w-[235px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.3)]"
              >
                {/* User Info */}

                <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-slate-900">
                        {fullName}
                      </p>

                      {user?.email && (
                        <p className="mt-0.5 truncate text-[9px] text-slate-500">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="my-1.5 h-px bg-slate-100" />

                {/* Logout */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
                    <LogOut size={13} />
                  </span>

                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;