// Верхний хедер: счёт, прогресс, авторизация
function Header({ score, step, totalSteps, onAuthClick, username }) {
  const pct = ((step) / (totalSteps)) * 100;
  const { Star, LogIn, Heart, User } = window.LucideIcons;

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/70">
      <div className="px-10 py-5 flex items-center gap-5">
        {/* Название урока */}
        <div className="min-w-[180px] hidden xl:block shrink-0">
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400 font-semibold whitespace-nowrap">Текущий урок</div>
          <div className="text-[17px] font-semibold text-slate-900 whitespace-nowrap">Météo & Lieux · A1</div>
        </div>

        {/* Жизни */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50/70 border border-rose-100 shrink-0">
          <Heart size={16} className="fill-[#EF4135] text-[#EF4135]" />
          <span className="text-[13px] font-semibold text-rose-600">5</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50/70 border border-amber-100 shrink-0">
          <Star size={16} className="fill-amber-400 text-amber-500" />
          <span className="text-[13px] font-semibold text-amber-700 tabular-nums whitespace-nowrap">{score} XP</span>
        </div>

        {/* Прогресс-бар */}
        <div className="flex-1 min-w-[140px]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Прогресс</div>
            <div className="text-[11px] font-semibold text-slate-700 tabular-nums">{Math.round(pct)}%</div>
          </div>
          <div className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 110, damping: 18 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0055A4] to-[#3b82f6] rounded-full"
            >
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.45)_50%,transparent_70%)] bg-[length:200%_100%] animate-[shine_2.4s_linear_infinite]"></div>
            </motion.div>
          </div>
        </div>

        {/* Авторизация / имя пользователя */}
        {username ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-semibold shrink-0 whitespace-nowrap">
            <User size={15} className="text-emerald-600" />
            {username}
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition shadow-[0_10px_24px_-12px_rgba(15,23,42,0.6)] shrink-0 whitespace-nowrap"
          >
            <LogIn size={15} />
            Войти
          </button>
        )}
      </div>
    </header>
  );
}

window.Header = Header;
