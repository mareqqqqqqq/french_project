function StepResult({ correct, total, xp, onRestart }) {
  const pct = Math.round((correct / total) * 100);
  const grade = pct >= 90 ? "Отлично!" : pct >= 70 ? "Хорошо!" : pct >= 50 ? "Неплохо!" : "Продолжай!";
  const { Trophy, Star, Repeat, ChevronRight, Sparkles } = window.LucideIcons;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[680px] mx-auto"
    >
      {/* Герой */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-[#0055A4] via-[#1860b1] to-[#2a73c2] text-white p-10 overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,85,164,0.6)]">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10"></div>
        <div className="absolute right-16 bottom-6 w-20 h-20 rounded-full bg-white/5"></div>
        <div className="absolute right-6 top-6 w-3 h-3 rounded-full bg-[#EF4135]"></div>

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles size={12} />
            Урок завершён
          </div>
          <h2 className="mt-4 text-[40px] font-bold tracking-tight leading-none">{grade}</h2>
          <p className="mt-2 text-white/80 text-[15px]">
            Ты прошёл урок <span className="font-semibold">Météo & Lieux</span>.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            <Stat icon={<Trophy size={16} />} label="Точность" value={`${pct}%`} />
            <Stat icon={<Star size={16} />} label="Получено XP" value={`+${xp}`} />
            <Stat icon={<window.LucideIcons.Target size={16} />} label="Ответы" value={`${correct}/${total}`} />
          </div>
        </div>
      </div>

      {/* Разбивка по шагам */}
      <div className="mt-6 rounded-3xl bg-white border border-slate-200/80 p-6">
        <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-4">Твои результаты</div>
        <Bar label="Словарный запас"  value={100} color="#0055A4" />
        <Bar label="Сопоставление"    value={pct} color="#0055A4" />
        <Bar label="Фразы"            value={pct} color="#EF4135" />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-slate-300 transition"
        >
          <Repeat size={16} />
          Начать заново
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0055A4] text-white font-semibold hover:bg-[#004a8f] transition shadow-[0_18px_30px_-16px_rgba(0,85,164,0.7)]"
        >
          Следующий урок
          <ChevronRight size={17} />
        </button>
      </div>
    </motion.div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/10">
      <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-medium uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-[24px] font-bold tabular-nums">{value}</div>
    </div>
  );
}

function Bar({ label, value, color }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13.5px] font-medium text-slate-700">{label}</span>
        <span className="text-[12.5px] font-semibold text-slate-500 tabular-nums">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        ></motion.div>
      </div>
    </div>
  );
}

window.StepResult = StepResult;
