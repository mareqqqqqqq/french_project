// TODO(backend): здесь появится реальная статистика (точность, XP, разбивка по шагам),
// когда бэк будет считать результат через попытку прохождения (lesson attempt).
// До этого фронту неоткуда честно взять цифры, поэтому экран — просто "Урок завершён".
function StepResult({ onRestart }) {
  const { Repeat, ChevronRight, Sparkles } = window.LucideIcons;

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
            Финиш
          </div>
          <h2 className="mt-4 text-[40px] font-bold tracking-tight leading-none">Урок завершён</h2>
          <p className="mt-2 text-white/80 text-[15px]">
            Ты прошёл все шаги урока. Можешь пройти его ещё раз или перейти к следующему.
          </p>
        </div>
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

window.StepResult = StepResult;
