// Кабинет учителя — Список уроков и Форма создания с интеграцией с бэком на защищенных Cookie

function getExercises(lesson) {
  return lesson.fill_blank_exercises || lesson.fill_blank || [];
}

function TeacherDashboard() {
  const [activeTab, setActiveTab] = React.useState("list"); // "list" или "create"
  const [lessons, setLessons] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isDemoData, setIsDemoData] = React.useState(false);
  const [viewedLesson, setViewedLesson] = React.useState(null); // урок для просмотра содержимого

  // Состояние для создания нового урока
  const [lessonTitle, setLessonTitle] = React.useState("");
  const [vocab, setVocab] = React.useState([{ id: 1, fr: "", ru: "", emoji: "" }]);
  const [exercises, setExercises] = React.useState([{ id: 1, sentence: "", translation: "", answer: "" }]);
  const [errors, setErrors] = React.useState({});
  const [saved, setSaved] = React.useState(false);

  const API_BASE = "http://127.0.0.1:8000/api/v1/lesson"; // Базовый URL вашего FastAPI

  const requestHeaders = {
    "Content-Type": "application/json"
  };

  // ── Загрузка уроков с бэкенда (с откатом на seed-данные) ──────
  async function fetchLessons() {
    setLoading(true);
    setErrorMsg("");
    setIsDemoData(false);
    try {
      const response = await window.apiFetch(`${API_BASE}/all_lessons_by_teacher`, {
        method: "GET",
        headers: requestHeaders
      });
      if (!response.ok) throw new Error("Не удалось загрузить уроки. Проверьте авторизацию.");
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      console.warn("Бэкенд недоступен, показываю seed-данные:", err.message);
      setLessons(window.SEED_LESSONS || []);
      setIsDemoData(true);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (activeTab === "list") {
      fetchLessons();
    }
  }, [activeTab]);

  // ── Удаление урока на бэкенде ─────────────────────────────
  async function handleDeleteLesson(lessonId) {
    if (isDemoData) {
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      return;
    }
    if (!confirm("Вы уверены, что хотите удалить этот урок?")) return;
    try {
      const response = await window.apiFetch(`${API_BASE}/delete_lesson?lesson_id=${lessonId}`, {
        method: "POST",
        headers: requestHeaders
      });
      if (!response.ok) throw new Error("Ошибка при удалении урока");

      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err) {
      alert(err.message);
    }
  }

  // ── Создание урока и карточек на бэкенде ─────────────────
  async function handleSaveLesson() {
    const errs = {};
    if (!lessonTitle.trim()) errs.title = "Введите название урока";

    const filledVocab = vocab.filter((v) => v.fr.trim() && v.ru.trim());
    if (filledVocab.length < 2) errs.vocab = "Добавьте минимум 2 слова";

    const filledEx = exercises.filter((e) => e.sentence.trim() && e.answer.trim());
    if (filledEx.length < 1) errs.exercises = "Добавьте минимум 1 упражнение";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const lessonRes = await window.apiFetch(`${API_BASE}/create_lesson`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({ title: lessonTitle.trim() })
      });
      if (!lessonRes.ok) throw new Error("Не удалось создать урок");
      const createdLesson = await lessonRes.json();
      const lessonId = createdLesson.id;

      for (const item of filledVocab) {
        const res = await window.apiFetch(`${API_BASE}/add_vocabulary_card?lesson_id=${lessonId}`, {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({
            word_fr: item.fr.trim(),
            word_ru: item.ru.trim(),
            emoji: item.emoji.trim() || null
          })
        });
        if (!res.ok) throw new Error("Не удалось сохранить карточку слова");
      }

      for (const item of filledEx) {
        const res = await window.apiFetch(`${API_BASE}/add_fill_blank?lesson_id=${lessonId}`, {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({
            sentence: item.sentence.trim(),
            translation: item.translation.trim(),
            correct_answer: item.answer.trim(),
            options: filledVocab.map(v => v.fr.trim())
          })
        });
        if (!res.ok) throw new Error("Не удалось сохранить упражнение");
      }

      setSaved(true);
      setLessonTitle("");
      setVocab([{ id: 1, fr: "", ru: "", emoji: "" }]);
      setExercises([{ id: 1, sentence: "", translation: "", answer: "" }]);
      setTimeout(() => {
        setSaved(false);
        setActiveTab("list");
      }, 2000);

    } catch (err) {
      alert(err.message + "\n\n(Проверьте, запущен ли бэкенд на http://127.0.0.1:8000)");
    }
  }

  function updateVocab(id, field, val) {
    setVocab((v) => v.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  }
  function updateExercise(id, field, val) {
    setExercises((e) => e.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  }

  const cardClass = "bg-white border border-slate-200/80 rounded-3xl p-7 mb-6 shadow-[0_2px_0_rgba(15,23,42,0.03)]";

  return (
    <div className="max-w-[900px] mx-auto pb-16">

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#0055A4]">Кабинет учителя</div>
          <h2 className="mt-1 text-[32px] font-bold text-slate-900 tracking-tight leading-none">Управление уроками</h2>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
              activeTab === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Мои уроки
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
              activeTab === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Создать урок
          </button>
        </div>
      </div>

      {activeTab === "list" && (
        <div>
          {isDemoData && !loading && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[13px] font-medium flex items-center gap-2">
              <window.LucideIcons.Info size={15} />
              Бэкенд недоступен — показаны демо-данные для проверки вёрстки.
            </div>
          )}

          {loading && <div className="text-center py-12 text-slate-500 text-sm">Загрузка уроков с вашего бэкенда...</div>}
          {errorMsg && <div className="text-center py-12 text-red-500 text-sm">{errorMsg}</div>}

          {!loading && !errorMsg && lessons.length === 0 && (
            <div className="text-center py-16 bg-white border rounded-3xl border-dashed border-slate-200">
              <window.LucideIcons.BookOpen className="mx-auto text-slate-300 mb-3" size={32} />
              <div className="text-slate-800 font-semibold">У вас пока нет созданных уроков</div>
              <p className="text-slate-400 text-sm mt-1">Перейдите во вкладку «Создать урок»</p>
            </div>
          )}

          {!loading && !errorMsg && lessons.length > 0 && (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setViewedLesson(lesson)}
                  className="flex items-center justify-between p-6 bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_0_rgba(15,23,42,0.02)] cursor-pointer hover:border-[#0055A4]/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0055A4]/8 text-[#0055A4] grid place-items-center font-bold">
                      FR
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-slate-900 leading-tight">{lesson.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-[12px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <window.LucideIcons.Layers size={13} />
                          {lesson.vocabulary_cards?.length || 0} слов
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="flex items-center gap-1">
                          <window.LucideIcons.HelpCircle size={13} />
                          {getExercises(lesson).length} упражнений
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                    className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition"
                  >
                    <window.LucideIcons.Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div>
          <div className={cardClass}>
            <TeacherSectionTitle number="1" title="Название урока" />
            <div className="mt-5">
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => {
                  setLessonTitle(e.target.value);
                  if (errors.title) setErrors((er) => ({ ...er, title: undefined }));
                }}
                placeholder="Например: Météo & Lieux — Погода и места"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition ${
                  errors.title ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-[#0055A4]"
                }`}
              />
              {errors.title && <TeacherErrorMsg text={errors.title} />}
            </div>
          </div>

          <div className={cardClass}>
            <TeacherSectionTitle number="2" title="Словарный запас" />
            <div className="mt-5 space-y-3">
              {vocab.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-300 w-4 text-right">{idx + 1}</span>
                  <input
                    type="text"
                    value={item.fr}
                    placeholder="Французское слово"
                    onChange={(e) => updateVocab(item.id, "fr", e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#0055A4] outline-none"
                  />
                  <input
                    type="text"
                    value={item.ru}
                    placeholder="Русский перевод"
                    onChange={(e) => updateVocab(item.id, "ru", e.target.value)}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-[#0055A4] outline-none"
                  />
                  <input
                    type="text"
                    value={item.emoji}
                    placeholder="Emoji (🌤️)"
                    onChange={(e) => updateVocab(item.id, "emoji", e.target.value)}
                    className="w-20 border border-slate-200 rounded-xl px-2 py-2.5 text-sm text-center focus:border-[#0055A4] outline-none"
                  />
                  <TeacherDeleteButton onClick={() => setVocab((v) => v.filter((it) => it.id !== item.id))} />
                </div>
              ))}
            </div>
            {errors.vocab && <TeacherErrorMsg text={errors.vocab} className="mt-3" />}
            <TeacherAddButton onClick={() => setVocab((v) => [...v, { id: Date.now(), fr: "", ru: "", emoji: "" }])} label="Добавить слово" className="mt-4" />
          </div>

          <div className={cardClass}>
            <TeacherSectionTitle number="3" title="Заполни пропуск" />
            <p className="mt-1 text-[12.5px] text-slate-400">Пишите <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">___</span> на месте пропуска.</p>
            <div className="mt-5 space-y-4">
              {exercises.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="text-[11px] font-semibold text-slate-300 w-4 text-right mt-3">{idx + 1}</span>
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      type="text"
                      value={item.sentence}
                      placeholder="Фраза на французском (Il fait ___ aujourd'hui.)"
                      onChange={(e) => updateExercise(item.id, "sentence", e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0055A4]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.translation}
                        placeholder="Перевод на русский"
                        onChange={(e) => updateExercise(item.id, "translation", e.target.value)}
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0055A4]"
                      />
                      <input
                        type="text"
                        value={item.answer}
                        placeholder="Правильный ответ"
                        onChange={(e) => updateExercise(item.id, "answer", e.target.value)}
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0055A4]"
                      />
                    </div>
                  </div>
                  <TeacherDeleteButton onClick={() => setExercises((ex) => ex.filter((it) => it.id !== item.id))} className="mt-1" />
                </div>
              ))}
            </div>
            {errors.exercises && <TeacherErrorMsg text={errors.exercises} className="mt-3" />}
            <TeacherAddButton onClick={() => setExercises((ex) => [...ex, { id: Date.now(), sentence: "", translation: "", answer: "" }])} label="Добавить упражнение" className="mt-4" />
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            {saved && (
              <div className="flex items-center gap-1.5 text-emerald-700 text-[13px] font-semibold">
                <window.LucideIcons.CheckCircle2 size={15} className="text-emerald-500" />
                Урок успешно создан в вашей базе данных!
              </div>
            )}
            <button
              onClick={handleSaveLesson}
              className="flex items-center gap-2 bg-[#0055A4] text-white px-7 py-3.5 rounded-2xl text-[14px] font-semibold shadow-[0_18px_30px_-16px_rgba(0,85,164,0.7)] hover:bg-[#004a8f] transition"
            >
              <window.LucideIcons.Save size={16} />
              Создать урок
            </button>
          </div>
        </div>
      )}

      {viewedLesson && (
        <LessonPreviewModal lesson={viewedLesson} onClose={() => setViewedLesson(null)} />
      )}
    </div>
  );
}

// ── Окно просмотра содержимого урока (чисто для просмотра, без интерактива) ──
function LessonPreviewModal({ lesson, onClose }) {
  const exercises = getExercises(lesson);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-[28px] bg-white border border-slate-200 shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 grid place-items-center text-slate-500"
        >
          <window.LucideIcons.X size={16} />
        </button>

        <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0055A4] mb-1">Просмотр урока</div>
        <h3 className="text-[24px] font-bold text-slate-900 mb-6">{lesson.title}</h3>

        <div className="mb-7">
          <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Словарный запас ({lesson.vocabulary_cards?.length || 0})
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(lesson.vocabulary_cards || []).map((card) => (
              <div key={card.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[20px]">{card.emoji || "🇫🇷"}</span>
                <div>
                  <div className="text-[14px] font-semibold text-slate-900">{card.word_fr}</div>
                  <div className="text-[12.5px] text-slate-500">{card.word_ru}</div>
                </div>
              </div>
            ))}
            {(!lesson.vocabulary_cards || lesson.vocabulary_cards.length === 0) && (
              <div className="text-[13px] text-slate-400 col-span-2">Слов пока нет</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Упражнения ({exercises.length})
          </div>
          <div className="space-y-3">
            {exercises.map((ex) => (
              <div key={ex.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[14.5px] text-slate-900">{ex.sentence}</div>
                <div className="text-[12.5px] text-slate-400 italic mt-1">{ex.translation}</div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {(ex.options || []).map((opt, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg text-[12px] font-medium border ${
                        opt === ex.correct_answer
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-500"
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {exercises.length === 0 && (
              <div className="text-[13px] text-slate-400">Упражнений пока нет</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherSectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-[#0055A4] text-white grid place-items-center text-[12px] font-bold shrink-0">
        {number}
      </div>
      <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
    </div>
  );
}

function TeacherErrorMsg({ text, className = "" }) {
  return (
    <div className={`flex items-center gap-1.5 text-[12.5px] text-red-500 font-medium ${className}`}>
      <window.LucideIcons.AlertCircle size={13} />
      {text}
    </div>
  );
}

function TeacherAddButton({ onClick, label, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-[13px] font-semibold text-[#0055A4] hover:text-[#004a8f] transition ${className}`}
    >
      <window.LucideIcons.Plus size={15} />
      {label}
    </button>
  );
}

function TeacherDeleteButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition shrink-0 ${className}`}
    >
      <window.LucideIcons.X size={15} />
    </button>
  );
}

window.TeacherDashboard = TeacherDashboard;