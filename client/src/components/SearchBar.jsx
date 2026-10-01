import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import "@fontsource-variable/plus-jakarta-sans";

function SearchBar({ searchTerm, setSearchTerm }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName;

      const typing =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        e.target.isContentEditable;

      if (
        e.key === "/" &&
        !typing &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className="w-full"
      style={{
        fontFamily: "'Plus Jakarta Sans Variable', system-ui, sans-serif",
      }}
    >
      <label htmlFor="task-search" className="sr-only">
        Search tasks
      </label>

      <div className="relative">
        <Search
          size={17}
          strokeWidth={2}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id="task-search"
          ref={inputRef}
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (searchTerm) {
                setSearchTerm("");
              } else {
                e.currentTarget.blur();
              }
            }
          }}
          autoComplete="off"
          spellCheck="false"
          className="
            h-11 w-full rounded-xl
            border border-slate-200
            bg-white
            pl-10 pr-12
            text-[13px] font-medium text-slate-800
            shadow-[0_1px_2px_rgba(15,23,42,0.04)]
            placeholder:text-slate-400
            outline-none
            transition-all duration-200
            hover:border-slate-300
            focus:border-emerald-500
            focus:ring-4 focus:ring-emerald-500/10
          "
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <AnimatePresence initial={false} mode="wait">
            {searchTerm ? (
              <motion.button
                key="clear"
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                title="Clear search"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.12 }}
                className="
                  flex h-7 w-7 items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition-colors
                  hover:bg-slate-100
                  hover:text-slate-700
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-emerald-500/20
                "
              >
                <X size={15} />
              </motion.button>
            ) : (
              <motion.kbd
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="
                  pointer-events-none
                  hidden h-7 w-7 items-center justify-center
                  rounded-lg
                  border border-slate-200
                  bg-slate-50
                  text-[11px] font-semibold
                  text-slate-400
                  sm:flex
                "
              >
                /
              </motion.kbd>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;