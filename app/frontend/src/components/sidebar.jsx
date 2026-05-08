// Sidebar component
const { motion } = window;

function Sidebar({ active, setActive, score, streak }) {
  const Icon = window.lucide ? null : null;
  const items = [
    { id: "progress", label: "Mon Progrès", icon: "TrendingUp" },
    { id: "lessons",  label: "Leçons",      icon: "BookOpen" },
    { id: "dict",     label: "Dictionnaire", icon: "Library" },
    { id: "settings", label: "Paramètres",  icon: "Settings" },
  ];

  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 bg-white/70 backdrop-blur-xl border-r border-slate-200/70 flex flex-col">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-[#0055A4] grid place-items-center shadow-[0_8px_20px_-8px_rgba(0,85,164,0.55)]">
            <span className="text-white font-bold text-lg tracking-tight">Fr</span>
            <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-[#EF4135] ring-2 ring-white"></span>
          </div>
          <div>
            <div className="text-[15px] font-semibold text-slate-900 leading-tight">Bonjour</div>
            <div className="text-xs text-slate-500">Apprends le français</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1">
        {items.map((it) => {
          const LucideIcon = window.LucideIcons[it.icon];
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setActive(it.id)}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-[14px] font-medium transition-all ${
                isActive
                  ? "bg-[#0055A4] text-white shadow-[0_10px_24px_-12px_rgba(0,85,164,0.7)]"
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              <LucideIcon size={18} strokeWidth={2.2} />
              <span>{it.label}</span>
              {isActive && (
                <motion.span
                  layoutId="navDot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Streak card */}
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#0055A4] to-[#1a6fc1] p-4 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="absolute right-3 bottom-3 w-3 h-3 rounded-full bg-[#EF4135]"></div>
          <div className="flex items-center gap-2 text-xs font-medium opacity-90">
            <window.LucideIcons.Flame size={14} />
            Série quotidienne
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">{streak} jours</div>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full ${i < streak ? "bg-white" : "bg-white/25"}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
