function Header() {
  return (
    <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
      <div className="max-w-5xl mx-auto px-8 py-7 flex items-center justify-between gap-6 flex-wrap">

        {/* Left */}
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <p className="uppercase tracking-[0.2em] text-blue-400 text-[10px] font-semibold">
              TaskTrack
            </p>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight mb-2">
            Organize your work. Stay focused.<br />
            <span className="text-blue-500">Ship faster.</span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            A simple and modern task manager to track work, manage priorities,
            and stay productive every day.
          </p>
        </div>

        {/* Right — static feature pills */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {[
            { color: "#60a5fa", label: "Due date tracking",
              icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
            { color: "#34d399", label: "Priority management",
              icon: <polyline points="20 6 9 17 4 12"/> },
            { color: "#a78bfa", label: "Stay on schedule",
              icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
          ].map(({ color, label, icon }) => (
            <div key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
              {label}
            </div>
          ))}
        </div>

      </div>
    </header>
  );
}

export default Header;