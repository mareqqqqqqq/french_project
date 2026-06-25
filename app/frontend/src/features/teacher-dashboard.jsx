// Кабинет учителя — форма создания урока

function TeacherDashboard() {
  const [lessonTitle, setLessonTitle] = React.useState("");
  const [vocab, setVocab] = React.useState([
    { id: 1, fr: "", ru: "", emoji: "" },
  ]);
  const [exercises, setExercises] = React.useState([
    { id: 1, sentence: "", translation: "", answer: "" },
  ]);
  const [errors, setErrors] = React.useState({});
  const [saved, setSaved] = React.useState(false);

  const vocabOptions = vocab
    .map((v) => v.fr.trim())
    .filter(Boolean);

  // ── Vocab helpers ──────────────────────────────────────────
  function addVocab() {
    setVocab((v) => [...v, { id: Date.now(), fr: "", ru: "", emoji: "" }]);
  }
  function removeVocab(id) {
    setVocab((v) => v.filter((item) => item.id !== id));
  }
  function updateVocab(id, field, val) {
    setVocab((v) =>
      v.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  }

  // ── Exercise helpers ───────────────────────────────────────
  function addExercise() {
    setExercises((e) => [
      ...e,
      { id: Date.now(), sentence: "", translation: "", answer: "" },
    ]);
  }
  function removeExercise(id) {
    setExercises((e) => e.filter((item) => item.id !== id));
  }
  function updateExercise(id, field, val) {
    setExercises((e) =>
      e.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  }

  // ── Validation & save ──────────────────────────────────────
  function save() {
    const errs = {};
    if (!lessonTitle.trim()) errs.title = "Введите название урока";

    const filledVocab = vocab.filter((v) => v.fr.trim() && v.ru.trim());
    if (filledVocab.length < 2) errs.vocab = "Минимум 2 заполненные карточки";

    const filledEx = exercises.filter((e) => e.sentence.trim() && e.answer.trim());
    if (filledEx.length < 1) errs.exercises = "Добавьте минимум 1 упражнение";

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      const payload = {
        title: lessonTitle.trim(),
        vocab: filledVocab.map((v) => ({
          fr: v.fr.trim(),
          ru: v.ru.trim(),
          emoji: v.emoji.trim(),
        })),
        exercises: filledEx.map((e) => ({
          sentence: e.sentence.trim(),
          translation: e.translation.trim(),
          answer: e.answer.trim(),
          options: vocabOptions,
        })),
      };
      console.log("💾 Данные урока:", payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const card =
    "bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_0_rgba(15,23,42,0.03),0_20px_30px_-24px_rgba(15,23,42,0.12)] p-7 mb-6";

  return (
    <div className="max-w-[900px] mx-auto pb-16">

      {/* ── Заголовок страницы ── */}
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#0055A4]">
          Кабинет учителя
        </div>
        <h2 className="mt-1 text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          Создать урок
        </h2>
        <p className="mt-2 text-[14.5px] text-slate-500">
          Заполните все секции и нажмите «Сохранить урок»
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          СЕКЦИЯ 1 — Урок
      ══════════════════════════════════════════════════════ */}
      <div className={card}>
        <TeacherSectionTitle number="1" title="Урок" />

        <div className="mt-5">
          <label className="block text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-400 mb-1.5">
            Название урока
          </label>
          <input
            type="text"
            value={lessonTitle}
            onChange={(e) => {
              setLessonTitle(e.target.value);
              if (errors.title) setErrors((er) => ({ ...er, title: undefined }));
            }}
            placeholder="Например: Météo & Lieux — Погода и места"
            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors bg-white ${
              errors.title
                ? "border-red-300 focus:border-red-400"
                : "border-slate-200 focus:border-[#0055A4]"
            }`}
          />
          {errors.title && <TeacherErrorMsg text={errors.title} />}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          СЕКЦИЯ 2 — Словарный запас
      ══════════════════════════════════════════════════════ */}
      <div className={card}>
        <TeacherSectionTitle number="2" title="Словарный запас" />

        <div className="mt-1 flex items-center gap-4 text-[11px] uppercase tracking-[0.1em] font-semibold text-slate-400 px-7">
          <span className="w-4 shrink-0" />
          <span className="flex-1">Французское слово</span>
          <span className="flex-1">Русский перевод</span>
          <span className="w-16 text-center">Emoji</span>
          <span className="w-8 shrink-0" />
        </div>

        <div className="mt-2 space-y-2.5">
          <window.AnimatePresence initial={false}>
            {vocab.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <span className="text-[11px] font-semibold text-slate-300 tabular-nums w-4 shrink-0 text-right">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item.fr}
                  onChange={(e) => updateVocab(item.id, "fr", e.target.value)}
                  placeholder="beau temps"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0055A4] transition-colors"
                />
                <input
                  type="text"
                  value={item.ru}
                  onChange={(e) => updateVocab(item.id, "ru", e.target.value)}
                  placeholder="хорошая погода"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0055A4] transition-colors"
                />
                <input
                  type="text"
                  value={item.emoji}
                  onChange={(e) => updateVocab(item.id, "emoji", e.target.value)}
                  placeholder="🌤️"
                  className="w-16 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-center outline-none focus:border-[#0055A4] transition-colors"
                />
                <TeacherDeleteButton onClick={() => removeVocab(item.id)} />
              </motion.div>
            ))}
          </window.AnimatePresence>
        </div>

        {errors.vocab && <TeacherErrorMsg text={errors.vocab} className="mt-3" />}
        <TeacherAddButton onClick={addVocab} label="Добавить слово" className="mt-4" />
      </div>

      {/* ══════════════════════════════════════════════════════
          СЕКЦИЯ 3 — Заполни пропуск
      ══════════════════════════════════════════════════════ */}
      <div className={card}>
        <div className="flex items-start justify-between gap-4">
          <TeacherSectionTitle number="3" title="Заполни пропуск" />
          {vocabOptions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[320px]">
              {vocabOptions.map((opt) => (
                <span
                  key={opt}
                  className="px-2.5 py-1 rounded-lg bg-[#0055A4]/8 text-[#0055A4] text-[11.5px] font-medium border border-[#0055A4]/15"
                >
                  {opt}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="mt-1.5 text-[12.5px] text-slate-400">
          Пиши <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">___</span> там,
          где должен быть пропуск. Варианты ответов подтягиваются из словарного запаса.
        </p>

        <div className="mt-5 space-y-4">
          <window.AnimatePresence initial={false}>
            {exercises.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-3"
              >
                <span className="text-[11px] font-semibold text-slate-300 tabular-nums w-4 shrink-0 text-right mt-[11px]">
                  {idx + 1}
                </span>

                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={item.sentence}
                    onChange={(e) => updateExercise(item.id, "sentence", e.target.value)}
                    placeholder="Il fait ___ aujourd'hui."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0055A4] transition-colors"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.translation}
                      onChange={(e) => updateExercise(item.id, "translation", e.target.value)}
                      placeholder="Сегодня ___ погода."
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0055A4] transition-colors"
                    />
                    <div className="relative shrink-0">
                      <select
                        value={item.answer}
                        onChange={(e) => updateExercise(item.id, "answer", e.target.value)}
                        className={`appearance-none border rounded-xl px-4 py-2.5 pr-8 text-sm outline-none transition-colors bg-white cursor-pointer ${
                          item.answer
                            ? "border-[#0055A4]/40 text-slate-900"
                            : "border-slate-200 text-slate-400"
                        } focus:border-[#0055A4]`}
                      >
                        <option value="">Правильный ответ…</option>
                        {vocabOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <window.LucideIcons.ChevronDown
                        size={13}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <TeacherDeleteButton onClick={() => removeExercise(item.id)} className="mt-[5px]" />
              </motion.div>
            ))}
          </window.AnimatePresence>
        </div>

        {errors.exercises && (
          <TeacherErrorMsg text={errors.exercises} className="mt-3" />
        )}
        <TeacherAddButton
          onClick={addExercise}
          label="Добавить упражнение"
          className="mt-4"
        />
      </div>

      {/* ── Кнопка сохранения ── */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <window.AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-emerald-700 text-[13px] font-semibold"
            >
              <window.LucideIcons.CheckCircle2 size={15} className="text-emerald-500" />
              Урок сохранён — данные в console.log
            </motion.div>
          )}
        </window.AnimatePresence>

        <motion.button
          onClick={save}
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          className="flex items-center gap-2 bg-[#0055A4] text-white px-7 py-3.5 rounded-2xl text-[14px] font-semibold shadow-[0_18px_30px_-16px_rgba(0,85,164,0.7)] hover:bg-[#004a8f] transition-colors"
        >
          <window.LucideIcons.Save size={16} />
          Сохранить урок
        </motion.button>
      </div>
    </div>
  );
}

// ── Вспомогательные компоненты ─────────────────────────────

function TeacherSectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#0055A4]/10 text-[#0055A4] grid place-items-center text-[12px] font-bold shrink-0">
        {number}
      </div>
      <h3 className="text-[17px] font-semibold text-slate-900">{title}</h3>
    </div>
  );
}

function TeacherDeleteButton({ onClick, className = "" }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      className={`w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ${className}`}
    >
      <window.LucideIcons.X size={14} />
    </motion.button>
  );
}

function TeacherAddButton({ onClick, label, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-[13px] font-medium text-[#0055A4] hover:text-[#004a8f] transition-colors ${className}`}
    >
      <div className="w-6 h-6 rounded-lg bg-[#0055A4]/10 grid place-items-center">
        <window.LucideIcons.Plus size={13} />
      </div>
      {label}
    </button>
  );
}

function TeacherErrorMsg({ text, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-1.5 text-[12px] text-red-500 font-medium mt-2 ${className}`}
    >
      <window.LucideIcons.AlertCircle size={13} />
      {text}
    </motion.div>
  );
}

window.TeacherDashboard = TeacherDashboard;
