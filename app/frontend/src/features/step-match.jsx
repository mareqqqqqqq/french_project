// Шаг "Сопоставление". Данные приходят из app.jsx (GET .../match_data): французская сторона
// идентифицируется по card id, русская — по непрозрачному token'у, поэтому правильные пары
// не видны в Network tab. Каждая пара проверяется отдельным запросом POST .../check_match.
const MATCH_API_ROOT = "http://127.0.0.1:8000/api/v1/lesson/lesson";

const WRONG_FEEDBACK_MS = 700;

function StepMatch({ lessonId, fr_items, ru_items, loading, error, onRetry, onComplete }) {
  const frItems = fr_items || [];
  const ruItems = ru_items || [];

  const [selected, setSelected] = React.useState({ side: null, key: null }); // первая выбранная карточка
  const [pending, setPending] = React.useState(null);   // { frId, ruToken } — пара уехала на проверку
  const [wrong, setWrong] = React.useState(null);       // { frId, ruToken } — короткая подсветка ошибки
  const [solvedFr, setSolvedFr] = React.useState([]);   // id французских карточек с ответом true
  const [solvedRu, setSolvedRu] = React.useState([]);   // token'ы русских карточек с ответом true
  const [checking, setChecking] = React.useState(false);
  const [checkError, setCheckError] = React.useState("");

  const wrongTimer = React.useRef(null);

  // TODO(backend): get_match_data отдаёт fr_items и ru_items в одном и том же порядке
  // vocabulary_cards, то есть правильный ответ — просто "строка i слева = строка i справа".
  // Пока бэк не перемешивает — тасуем колонки на фронте (на связь id/token это не влияет).
  const frOrder = React.useMemo(() => shuffleItems(frItems.map((it) => ({ key: it.id, word: it.word }))), [fr_items]);
  const ruOrder = React.useMemo(() => shuffleItems(ruItems.map((it) => ({ key: it.token, word: it.word }))), [ru_items]);

  // новый урок / перезагрузка match_data — сбрасываем прогресс шага
  React.useEffect(() => {
    setSelected({ side: null, key: null });
    setPending(null);
    setWrong(null);
    setSolvedFr([]);
    setSolvedRu([]);
    setCheckError("");
  }, [fr_items, ru_items]);

  React.useEffect(() => () => clearTimeout(wrongTimer.current), []);

  const solvedFrSet = new Set(solvedFr);
  const solvedRuSet = new Set(solvedRu);
  const locked = checking || wrong !== null; // ждём ответ бэка или показываем ошибку — клики игнорируем
  const allSolved = solvedFr.length >= frItems.length;

  async function pick(side, key) {
    if (locked) return;
    if (side === "fr" && solvedFrSet.has(key)) return;
    if (side === "ru" && solvedRuSet.has(key)) return;

    setCheckError("");

    // первая карточка в паре (или смена выбора внутри той же колонки)
    if (!selected.side || selected.side === side) {
      setSelected({ side, key });
      return;
    }

    const frId = side === "fr" ? key : selected.key;
    const ruToken = side === "ru" ? key : selected.key;

    setSelected({ side: null, key: null });
    setPending({ frId, ruToken });
    setChecking(true);

    try {
      const url =
        `${MATCH_API_ROOT}/${lessonId}/check_match` +
        `?left_card_id=${encodeURIComponent(frId)}&right_token=${encodeURIComponent(ruToken)}`;
      const res = await window.apiFetch(url, { method: "POST" });
      if (!res.ok) throw new Error(`Сервер вернул ${res.status}`);

      const isMatch = await res.json(); // бэк отдаёт голый boolean
      setPending(null);

      if (isMatch === true) {
        setSolvedFr((prev) => [...prev, frId]);
        setSolvedRu((prev) => [...prev, ruToken]);
      } else {
        // пара не фиксируется: подсвечиваем ошибку и возвращаем обе карточки в обычное состояние
        setWrong({ frId, ruToken });
        wrongTimer.current = setTimeout(() => setWrong(null), WRONG_FEEDBACK_MS);
      }
    } catch (err) {
      console.error("Не удалось проверить пару:", err);
      setPending(null);
      setCheckError("Не удалось проверить пару — проверь соединение и попробуй ещё раз.");
    } finally {
      setChecking(false);
    }
  }

  const header = (
    <StepHeader
      eyebrow="Шаг 2 из 3"
      title="Сопоставление"
      subtitle="Соедини каждое французское слово с его русским переводом."
    />
  );

  if (loading) {
    return (
      <div>
        {header}
        <div className="text-center py-16 text-slate-500 text-sm">Загрузка заданий...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {header}
        <div className="mt-8 px-5 py-4 rounded-2xl bg-red-50 border border-[#EF4135]/25 text-[#b3241b] text-[13.5px] font-medium flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <window.LucideIcons.AlertTriangle size={16} />
            {error}
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-xl bg-white border border-[#EF4135]/30 text-[#b3241b] text-[12.5px] font-semibold hover:bg-red-50 transition"
            >
              Повторить
            </button>
          )}
        </div>
      </div>
    );
  }

  if (frItems.length === 0) {
    return (
      <div>
        {header}
        <div className="mt-8 text-center py-16 bg-white border rounded-3xl border-dashed border-slate-200">
          <window.LucideIcons.Link2 className="mx-auto text-slate-300 mb-3" size={32} />
          <div className="text-slate-800 font-semibold">В этом уроке пока нет пар для сопоставления</div>
        </div>
        <div className="mt-10 flex items-center justify-end">
          <NextButton onClick={() => onComplete(0)} label="Далее" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {header}

      <div className="grid grid-cols-2 gap-6 mt-8">
        <Column
          label="Français"
          accent="#0055A4"
          items={frOrder}
          side="fr"
          selectedKey={selected.side === "fr" ? selected.key : null}
          pendingKey={pending ? pending.frId : null}
          wrongKey={wrong ? wrong.frId : null}
          solved={solvedFrSet}
          locked={locked}
          onPick={pick}
        />
        <Column
          label="Русский"
          accent="#EF4135"
          items={ruOrder}
          side="ru"
          selectedKey={selected.side === "ru" ? selected.key : null}
          pendingKey={pending ? pending.ruToken : null}
          wrongKey={wrong ? wrong.ruToken : null}
          solved={solvedRuSet}
          locked={locked}
          onPick={pick}
        />
      </div>

      {checkError && (
        <div className="mt-6 px-5 py-3.5 rounded-2xl bg-red-50 border border-[#EF4135]/25 text-[#b3241b] text-[13px] font-medium flex items-center gap-2">
          <window.LucideIcons.AlertTriangle size={15} />
          {checkError}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <window.LucideIcons.Link2 size={15} />
          {solvedFr.length} / {frItems.length} соединено
        </div>
        <NextButton disabled={!allSolved} onClick={() => onComplete(solvedFr.length)} label="Далее" />
      </div>
    </div>
  );
}

function Column({ label, accent, items, side, selectedKey, pendingKey, wrongKey, solved, locked, onPick }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: accent }}>
        {label}
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const isPaired = solved.has(item.key);
          const isWrong = wrongKey === item.key;
          const isSelected = !isWrong && (selectedKey === item.key || pendingKey === item.key);
          const isDisabled = isPaired || locked;
          return (
            <motion.button
              key={item.key}
              onClick={() => onPick(side, item.key)}
              whileTap={!isDisabled ? { scale: 0.98 } : undefined}
              animate={isWrong ? { x: [0, -7, 6, -5, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.42 }}
              disabled={isDisabled}
              className={`w-full text-left px-5 py-4 rounded-2xl border text-[15px] font-medium transition-all ${
                isPaired
                  ? "bg-[#0055A4]/5 border-[#0055A4]/25 text-slate-500"
                  : isWrong
                    ? "bg-[#EF4135]/5 border-transparent shadow-[0_0_0_2px_#EF4135,0_18px_30px_-18px_rgba(239,65,53,0.5)] text-slate-900"
                    : isSelected
                      ? "bg-white border-transparent shadow-[0_0_0_2px_#0055A4,0_18px_30px_-18px_rgba(0,85,164,0.5)] text-slate-900"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-[0_2px_0_rgba(15,23,42,0.03)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{item.word}</span>
                {isPaired && <window.LucideIcons.Link2 size={17} className="text-[#0055A4]/60" />}
                {isWrong && <window.LucideIcons.X size={17} className="text-[#EF4135]" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function shuffleItems(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

window.StepMatch = StepMatch;
