// Список уроков — экран выбора урока для прохождения (ученики видят вообще все уроки, не только свои)
function LessonList({ onSelectLesson }) {
  const [lessons, setLessons] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isDemoData, setIsDemoData] = React.useState(false);

  const API_BASE = "http://127.0.0.1:8000/api/v1/lesson";

  React.useEffect(() => {
    fetchLessons();
  }, []);

  // TODO(backend): нужен публичный эндпоинт GET /api/v1/lesson/all_lessons (без require_teacher,
  // в отличие от уже существующего all_lessons_by_teacher) — должен отдавать список ВСЕХ уроков,
  // доступных ученику для прохождения. Пока этого эндпоинта нет, используем seed-данные.
  async function fetchLessons() {
    setLoading(true);
    setIsDemoData(false);
    try {
      const res = await window.apiFetch(`${API_BASE}/all_lessons`, { method: "GET" });
      if (!res.ok) throw new Error("Эндпоинт /all_lessons недоступен");
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.warn("Бэкенд недоступен, показываю seed-данные:", err.message);
      setLessons(window.SEED_LESSONS || []);
      setIsDemoData(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[1080px] mx-auto pb-16">
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#0055A4]">Уроки</div>
        <h2 className="mt-1 text-[32px] font-bold text-slate-900 tracking-tight leading-none">Выбери урок</h2>
      </div>

      {isDemoData && !loading && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[13px] font-medium flex items-center gap-2">
          <window.LucideIcons.Info size={15} />
          Бэкенд-эндпоинт /all_lessons пока не готов — показаны демо-данные.
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-slate-500 text-sm">Загрузка уроков...</div>
      )}

      {!loading && lessons.length === 0 && (
        <div className="text-center py-16 bg-white border rounded-3xl border-dashed border-slate-200">
          <window.LucideIcons.BookOpen className="mx-auto text-slate-300 mb-3" size={32} />
          <div className="text-slate-800 font-semibold">Уроков пока нет</div>
        </div>
      )}

      {!loading && lessons.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {lessons.map((lesson, i) => (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLesson(lesson)}
              className="text-left p-6 bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_0_rgba(15,23,42,0.03)] hover:border-[#0055A4]/30 transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0055A4]/8 text-[#0055A4] grid place-items-center font-bold mb-4">
                FR
              </div>
              <h4 className="text-[16px] font-bold text-slate-900 leading-tight">{lesson.title}</h4>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// TODO(backend): уточнить у бэка формат ответа для содержимого одного урока. Два варианта:
//   1) /all_lessons сразу отдаёт вложенные vocabulary_cards / fill_blank_exercises / match_pairs
//      для каждого урока в списке (как сейчас отдаёт all_lessons_by_teacher) — тогда этот адаптер
//      можно применять прямо к элементу списка, доп. запрос не нужен;
//   2) нужен отдельный GET /api/v1/lesson/{lesson_id}, отдающий то же самое для одного урока —
//      тогда перед вызовом adaptLessonToStepsData нужно сходить за этим запросом.
// Сейчас реализован вариант (1) как более простой для адаптации, когда бэк будет готов.
// Важно: sentence.answer / correct_answer сюда намеренно НЕ прокидываются — правильность
// проверяется на бэке в submit_match / submit_fill_blank, а не на фронте.
function adaptLessonToStepsData(lesson) {
  const cards = lesson.vocabulary_cards || [];
  const vocab = cards.map((c) => ({
    fr: c.word_fr,
    ru: c.word_ru,
    emoji: c.emoji || null,
    icon: c.icon || "Sparkles",
    hint: c.hint || "",
  }));

  // TODO(backend): если на бэке появится отдельное поле match_pairs у урока — использовать его
  // вместо производных пар из vocabulary_cards.
  const match = lesson.match_pairs
    ? lesson.match_pairs.map((p) => ({ fr: p.fr, ru: p.ru }))
    : cards.map((c) => ({ fr: c.word_fr, ru: c.word_ru }));

  const exercises = lesson.fill_blank_exercises || lesson.fill_blank || [];
  const sentences = exercises.map((ex, i) => ({
    id: ex.id ?? i,
    prompt: ex.sentence,
    translation: ex.translation,
    options: ex.options || [],
  }));

  return { vocab, match, sentences };
}

window.LessonList = LessonList;
window.adaptLessonToStepsData = adaptLessonToStepsData;
