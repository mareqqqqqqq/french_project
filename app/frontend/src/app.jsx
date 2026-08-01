function App() {
  const [active, setActive] = React.useState("lessons");
  const [selectedLesson, setSelectedLesson] = React.useState(null); // урок, который сейчас проходим (null = показываем список)
  const [step, setStep] = React.useState(0); // 0 vocab, 1 match, 2 fill, 3 result
  const [authOpen, setAuthOpen] = React.useState(false);
  // TODO(backend): нет ни поля xp/streak на User, ни эндпоинта, отдающего реальный прогресс —
  // пока 0, подключим когда появится бэк-логика.
  const [score] = React.useState(0);
  const [streak] = React.useState(0);
  const [username, setUsername] = React.useState(localStorage.getItem("username") || "");

  const totalSteps = 4; // includes result

  const lessonSteps = React.useMemo(
    () => (selectedLesson ? window.adaptLessonToStepsData(selectedLesson) : null),
    [selectedLesson]
  );

  React.useEffect(() => {
    if (!authOpen) {
      setUsername(localStorage.getItem("username") || "");
    }
  }, [authOpen]);

  function selectLesson(lesson) {
    setSelectedLesson(lesson);
    setStep(0);
  }

  function backToLessons() {
    setSelectedLesson(null);
    setStep(0);
  }

  function restart() {
    setStep(0);
  }

  function handleLogout() {
    fetch("http://127.0.0.1:8000/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      localStorage.removeItem("username");
      setUsername("");
      setActive("lessons");
      setSelectedLesson(null);
    });
  }

  // TODO(backend): собранные пары/ответы пока никуда не отправляются — проверка правильности
  // и подсчёт результата появятся на бэке (lesson attempt). Фронт только передаёт данные дальше.
  function handleMatchComplete(pairs) {
    console.log("match pairs:", pairs);
    setStep(2);
  }

  function handleFillComplete(answers) {
    console.log("fill answers:", answers);
    setStep(3);
  }

  const transition = { type: "spring", stiffness: 130, damping: 22 };

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] text-slate-900 antialiased">
      <window.Sidebar active={active} setActive={setActive} score={score} streak={streak} username={username} />

      <div className="flex-1 min-w-0 flex flex-col">
        <window.Header
          score={score}
          step={step}
          totalSteps={totalSteps - 1}
          onAuthClick={() => setAuthOpen(true)}
          onLogoutClick={handleLogout}
          username={username}
        />

        {active !== "teacher" && selectedLesson && (
          <div className="px-10 pt-8">
            <Chapters step={step} />
          </div>
        )}

        <main className="px-10 pb-16 pt-6 flex-1">
          {active === "teacher" ? (
            <window.TeacherDashboard />
          ) : active === "progress" ? (
            <window.ComingSoonPlaceholder title="Мой прогресс" icon="TrendingUp" />
          ) : active === "dict" ? (
            <window.ComingSoonPlaceholder title="Словарь" icon="Library" />
          ) : active === "settings" ? (
            <window.ComingSoonPlaceholder title="Настройки" icon="Settings" />
          ) : !selectedLesson ? (
            <window.LessonList onSelectLesson={selectLesson} />
          ) : (
            <div className="relative max-w-[1080px] mx-auto">
              <button
                onClick={backToLessons}
                className="mb-6 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                <window.LucideIcons.ArrowLeft size={15} />
                Назад к списку уроков
              </button>

              <window.AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={transition}
                >
                  {step === 0 && <window.StepVocab vocab={lessonSteps.vocab} onComplete={() => setStep(1)} />}
                  {step === 1 && <window.StepMatch pairs={lessonSteps.match} onComplete={handleMatchComplete} />}
                  {step === 2 && <window.StepFill sentences={lessonSteps.sentences} onComplete={handleFillComplete} />}
                  {step === 3 && <window.StepResult onRestart={restart} />}
                </motion.div>
              </window.AnimatePresence>
            </div>
          )}
        </main>
      </div>

      <window.AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

function Chapters({ step }) {
  const items = [
    { label: "Словарный запас", icon: "BookOpen" },
    { label: "Сопоставление",   icon: "Link2" },
    { label: "Фразы",           icon: "PencilLine" },
    { label: "Результат",       icon: "Trophy" },
  ];
  return (
    <div className="max-w-[1080px] mx-auto flex items-center gap-2">
      {items.map((it, i) => {
        const Icon = window.LucideIcons[it.icon];
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <React.Fragment key={i}>
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition ${
                state === "current"
                  ? "bg-white border border-[#0055A4]/20 text-[#0055A4] shadow-[0_8px_18px_-12px_rgba(0,85,164,0.45)]"
                  : state === "done"
                    ? "bg-emerald-50/70 text-emerald-700 border border-emerald-100"
                    : "bg-transparent text-slate-400 border border-slate-200/70"
              }`}
            >
              <Icon size={14} />
              {it.label}
              {state === "done" && <window.LucideIcons.Check size={13} />}
            </div>
            {i < items.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? "bg-emerald-200" : "bg-slate-200"}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);