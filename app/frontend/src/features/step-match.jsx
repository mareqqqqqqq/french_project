function StepMatch({ pairs, onComplete, recordAnswer }) {
  const [selected, setSelected] = React.useState({ side: null, value: null });
  const [matches, setMatches] = React.useState({}); // fr -> ru
  const [wrongFlash, setWrongFlash] = React.useState(null);
  const [attempts, setAttempts] = React.useState(0);

  const ruOrder = React.useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map((p) => p.ru),
    [pairs]
  );
  const frOrder = React.useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map((p) => p.fr),
    [pairs]
  );

  const matchedFr = new Set(Object.keys(matches));
  const matchedRu = new Set(Object.values(matches));

  function pick(side, value) {
    if ((side === "fr" && matchedFr.has(value)) || (side === "ru" && matchedRu.has(value))) return;
    if (!selected.side) {
      setSelected({ side, value });
      return;
    }
    if (selected.side === side) {
      setSelected({ side, value });
      return;
    }
    const fr = side === "fr" ? value : selected.value;
    const ru = side === "ru" ? value : selected.value;
    const isPair = pairs.find((p) => p.fr === fr && p.ru === ru);
    setAttempts((a) => a + 1);
    if (isPair) {
      setMatches((m) => ({ ...m, [fr]: ru }));
      recordAnswer && recordAnswer(true);
    } else {
      setWrongFlash({ fr, ru });
      recordAnswer && recordAnswer(false);
      setTimeout(() => setWrongFlash(null), 500);
    }
    setSelected({ side: null, value: null });
  }

  const done = Object.keys(matches).length === pairs.length;

  return (
    <div>
      <StepHeader
        eyebrow="Шаг 2 из 3"
        title="Сопоставление"
        subtitle="Соедини каждое французское слово с его русским переводом."
      />

      <div className="grid grid-cols-2 gap-6 mt-8">
        <Column
          label="Français"
          accent="#0055A4"
          items={frOrder}
          side="fr"
          selected={selected}
          matched={matchedFr}
          onPick={pick}
          wrongFlash={wrongFlash?.fr}
        />
        <Column
          label="Русский"
          accent="#EF4135"
          items={ruOrder}
          side="ru"
          selected={selected}
          matched={matchedRu}
          onPick={pick}
          wrongFlash={wrongFlash?.ru}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[13px] text-slate-500">
          <span className="flex items-center gap-2">
            <window.LucideIcons.Check size={15} className="text-emerald-500" />
            {Object.keys(matches).length} / {pairs.length}
          </span>
          <span className="flex items-center gap-2">
            <window.LucideIcons.Repeat size={15} />
            {attempts} попыток
          </span>
        </div>
        <NextButton disabled={!done} onClick={onComplete} label={done ? "Далее" : "Заверши все пары"} />
      </div>
    </div>
  );
}

function Column({ label, accent, items, side, selected, matched, onPick, wrongFlash }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: accent }}>
        {label}
      </div>
      <div className="space-y-3">
        {items.map((value) => {
          const isMatched = matched.has(value);
          const isSelected = selected.side === side && selected.value === value;
          const isWrong = wrongFlash === value;
          return (
            <motion.button
              key={value}
              onClick={() => onPick(side, value)}
              whileTap={!isMatched ? { scale: 0.98 } : undefined}
              animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
              transition={{ duration: 0.4 }}
              disabled={isMatched}
              className={`w-full text-left px-5 py-4 rounded-2xl border text-[15px] font-medium transition-all ${
                isMatched
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-700 line-through decoration-emerald-300"
                  : isSelected
                    ? "bg-white border-transparent shadow-[0_0_0_2px_#0055A4,0_18px_30px_-18px_rgba(0,85,164,0.5)] text-slate-900"
                    : isWrong
                      ? "bg-rose-50 border-rose-200 text-rose-700"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-[0_2px_0_rgba(15,23,42,0.03)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{value}</span>
                {isMatched && <window.LucideIcons.CheckCircle2 size={17} className="text-emerald-500" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

window.StepMatch = StepMatch;
