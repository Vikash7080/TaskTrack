function Header() {
  return (
    <header className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="max-w-5xl mx-auto px-4 py-16">

        <p className="uppercase tracking-[0.3em] text-blue-300 text-sm mb-4">
          Task Management Platform
        </p>

        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Organize your work.
          <br />
          Stay focused.
          <br />
          <span className="text-blue-400">
            Ship faster.
          </span>
        </h1>

        <p className="text-slate-300 mt-6 max-w-2xl text-lg">
          A simple and modern task manager
          to track work, manage priorities,
          and stay productive every day.
        </p>

      </div>
    </header>
  );
}

export default Header;