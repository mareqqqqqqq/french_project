function StepMatch({ pairs, onComplete }) {
  const [selected, setSelected] = React.useState({ side: null, value: null });
  const [paired, setPaired] = React.useState({}); // fr -> ru, пары составленные пользователем

  const ruOrder = React.useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map((p) => p.ru),
    [pairs]
  );
  const frOrder = React.useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map((p) => p.fr),
    [pairs]
  );

  const pairedFr = new Set(Object.keys(paired));
  const pairedRu = new Set(Object.values(paired));

  function pick(side, value) {
    if ((side === "fr" && pairedFr.has(value)) || (side === "ru" && pairedRu.has(value))) return;
    if (!selected.side) {
      setSelected({ side, value });
      return;
    }
    if (selected.side === side) {
      setSelected({ side, value });
      return;
    }
    // Правильность здесь не проверяется — фронт лишь фиксирует, какие карточки
    // пользователь соединил. Сверка пар — задача бэкенда (submit_match).
    const fr = side === "fr" ? value : selected.value;
    const ru = side === "ru" ? value : selected.value;
    setPaired((m) => ({ ...m, [fr]: ru }));
    setSelected({ side: null, value: null });
  }

  function finish() {
    const collectedPairs = Object.entries(paired).map(([fr, ru]) => ({ fr, ru }));
    onComplete(collectedPairs);
  }

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
          paired={pairedFr}
          onPick={pick}
        />
        <Column
          label="Русский"
          accent="#EF4135"
          items={ruOrder}
          side="ru"
          selected={selected}
          paired={pairedRu}
          onPick={pick}
        />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <window.LucideIcons.Link2 size={15} />
          {Object.keys(paired).length} / {pairs.length} соединено
        </div>
        <NextButton onClick={finish} label="Далее" />
      </div>
    </div>
  );
}

function Column({ label, accent, items, side, selected, paired, onPick }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: accent }}>
        {label}
      </div>
      <div className="space-y-3">
        {items.map((value) => {
          const isPaired = paired.has(value);
          const isSelected = selected.side === side && selected.value === value;
          return (
            <motion.button
              key={value}
              onClick={() => onPick(side, value)}
              whileTap={!isPaired ? { scale: 0.98 } : undefined}
              disabled={isPaired}
              className={`w-full text-left px-5 py-4 rounded-2xl border text-[15px] font-medium transition-all ${
                isPaired
                  ? "bg-[#0055A4]/5 border-[#0055A4]/25 text-slate-500"
                  : isSelected
                    ? "bg-white border-transparent shadow-[0_0_0_2px_#0055A4,0_18px_30px_-18px_rgba(0,85,164,0.5)] text-slate-900"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-[0_2px_0_rgba(15,23,42,0.03)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{value}</span>
                {isPaired && <window.LucideIcons.Link2 size={17} className="text-[#0055A4]/60" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

window.StepMatch = StepMatch;
